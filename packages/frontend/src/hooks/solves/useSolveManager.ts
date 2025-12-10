import { Discipline, Status, type Solve, type StatlessSolve } from "@cubing/shared";
import { useCallback, useEffect, useMemo, useState } from 'react';
import DBReader from '../../services/dbReader';
import DBWriter from '../../services/dbWriter';
import { EVENT_TO_SCRAMBLE_KEY } from "../../utils/constants";
import { generateScramble, solveWithUpdatedStatus } from '../../utils/solveUtils';
import { useSolveStats } from './useSolveStats';

const dbWriter = DBWriter.instance;
const dbReader = DBReader.instance;

export const useSolveManager = (selectedDiscipline: Discipline, selectedSession: string) => {
    // Solves
    const [statlessSolvesChrono, setStatlessSolvesChrono] = useState<StatlessSolve[]>([]);
    const solvesChrono: Solve[] = useSolveStats(statlessSolvesChrono);
    const pb = useMemo(() => {
        let currentPb: number = Infinity;
        for (let i = 0; i < statlessSolvesChrono.length; i++) {
            const solve: StatlessSolve = statlessSolvesChrono[i];
            if (solve.duration < currentPb && solve.status === Status.Valid) {
                currentPb = solve.duration;
            }
        }
        return currentPb;
    }, [statlessSolvesChrono]);
    // Other
    const [currentScramble, setCurrentScramble] = useState<string>("Generating Scramble...");
    const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [userID] = useState<string>(() => {
        const USER_ID_KEY = "userID";
        let uID = localStorage.getItem(USER_ID_KEY);
        if (!uID) {
            uID = crypto.randomUUID();
            localStorage.setItem(USER_ID_KEY, uID);
        }
        return uID;
    });

    useEffect(() => {
        setHasFetched(false);
    }, [selectedDiscipline, selectedSession, userID]);

    useEffect(() => {
        let mounted = true;

        const initData = async () => {
            try {
                const fetchedSolves: StatlessSolve[] = await dbReader.getSolvesByDisciplineAndSession(userID, selectedDiscipline, selectedSession);
                if (mounted) {
                    setStatlessSolvesChrono(fetchedSolves);
                    const newScramble: string = await generateScramble(EVENT_TO_SCRAMBLE_KEY.get(selectedDiscipline));
                    setCurrentScramble(newScramble);
                    setHasFetched(true);
                }
            } catch (error) {
                console.error("Failed to fetch solves:", error);
            }
        };

        initData();

        return () => { mounted = false; };
    }, [userID, selectedDiscipline, selectedSession]);

    const addSolve = useCallback(async (finalTime: number, dnf: boolean) => {
        const solveStatus: Status = dnf ? Status.DNF : Status.Valid;

        try {
            const newSolve: StatlessSolve = await dbWriter.insertSolve({
                uuid: userID,
                duration: finalTime,
                date: new Date(),
                scramble: currentScramble,
                discipline: selectedDiscipline,
                status: solveStatus,
                session: "default"
            });

            setStatlessSolvesChrono(prev => [newSolve, ...prev]);

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
        setStatlessSolvesChrono(prev => prev.filter(s => s.pk !== solvePk));
    }, []);

    const updateSolveStatus = useCallback((oldSolve: Solve, newStatus: Status) => {
        const updatedSolve = solveWithUpdatedStatus(oldSolve, newStatus);
        dbWriter.updateSolveStatus(updatedSolve);
        setStatlessSolvesChrono(prev => prev.map(s =>
            s.pk === updatedSolve.pk ? updatedSolve : s
        ));
    }, [statlessSolvesChrono]);

    return {
        solvesChrono,
        currentScramble,
        isLimitDialogOpen,
        pb,
        hasFetched,
        setIsLimitDialogOpen,
        addSolve,
        deleteSolve,
        updateSolveStatus,
    };
};