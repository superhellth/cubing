import { Discipline, Status, type ISolve } from "@cubing/shared";
import { useCallback, useEffect, useMemo, useState } from 'react';
import DBReader from '../services/dbReader';
import DBWriter from '../services/dbWriter';
import { EVENT_TO_SCRAMBLE_KEY } from "../utils/constants";
import { generateScramble, solveWithUpdatedStatus } from '../utils/solveUtils';
import { useSolveStats } from './useSolveStats';

const dbWriter = DBWriter.instance;
const dbReader = DBReader.instance;

export const useSolveManager = (selectedDiscipline: Discipline, selectedSession: string) => {
    const [rawSolves, setRawSolves] = useState<ISolve[]>([]);
    const [currentScramble, setCurrentScramble] = useState<string>("Generating Scramble...");
    const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);

    const [userID] = useState<string>(() => {
        const USER_ID_KEY = "userID";
        let uID = localStorage.getItem(USER_ID_KEY);
        if (!uID) {
            uID = crypto.randomUUID();
            localStorage.setItem(USER_ID_KEY, uID);
        }
        return uID;
    });
    const solves: ISolve[] = useSolveStats(rawSolves);
    const pb = useMemo(() => {
        let currentPb: number = Infinity;
        for (let i = 0; i < solves.length; i++) {
            const solve: ISolve = solves[i];
            if (solve.duration < currentPb && solve.status === Status.Valid) {
                currentPb = solve.duration;
            }
        }
        return currentPb;
    }, [solves]);

    useEffect(() => {
        let mounted = true;

        const initData = async () => {
            try {
                const fetchedSolves = await dbReader.getSolvesByDisciplineAndSession(userID, selectedDiscipline, selectedSession);
                if (mounted) {
                    setRawSolves(fetchedSolves);
                    const newScramble: string = await generateScramble(EVENT_TO_SCRAMBLE_KEY.get(selectedDiscipline));
                    setCurrentScramble(newScramble);
                }
            } catch (error) {
                console.error("Failed to fetch solves:", error);
            }
        };

        initData();

        return () => { mounted = false; };
    }, [userID, selectedDiscipline]);

    const addSolve = useCallback(async (finalTime: number, dnf: boolean) => {
        const solveStatus: Status = dnf ? Status.DNF : Status.Valid;

        try {
            const newSolve = await dbWriter.insertSolve({
                uuid: userID,
                duration: finalTime,
                date: new Date(),
                scramble: currentScramble,
                discipline: selectedDiscipline,
                status: solveStatus,
                session: "default"
            });

            setRawSolves(prev => [newSolve, ...prev]);

            const newScramble: string = await generateScramble(EVENT_TO_SCRAMBLE_KEY.get(selectedDiscipline));
            setCurrentScramble(newScramble);

        } catch (error: any) {
            if (error.message === 'LIMIT_REACHED') {
                setIsLimitDialogOpen(true);
            } else {
                console.error("Failed to save solve", error);
            }
        }
    }, [userID, currentScramble, selectedDiscipline]);

    const deleteSolve = useCallback((solvePk: bigint, uuid: string) => {
        dbWriter.deleteSolve(solvePk, uuid);
        setRawSolves(prev => prev.filter(s => s.pk !== solvePk));
    }, []);

    const updateSolveStatus = useCallback((oldSolve: ISolve, newStatus: Status) => {
        const updatedSolve = solveWithUpdatedStatus(oldSolve, newStatus);
        dbWriter.updateSolveStatus(updatedSolve);
        setRawSolves(prev => prev.map(s =>
            s.id === updatedSolve.id ? updatedSolve : s
        ));
    }, []);

    return {
        solves,
        currentScramble,
        isLimitDialogOpen,
        setIsLimitDialogOpen,
        addSolve,
        deleteSolve,
        updateSolveStatus,
        pb
    };
};