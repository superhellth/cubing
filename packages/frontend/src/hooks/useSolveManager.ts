import { useState, useEffect, useCallback } from 'react';
import { Discipline, Status, type ISolve } from "@cubing/shared";
import { useSolvesWithAverages } from "../utils/timer_utils";
import DBWriter from '../services/db_writer';
import DBReader from '../services/db_reader';
import Scrambler from '../utils/scrambling/scrambler';
import { solveWithUpdatedStatus } from '../utils/solveUtils';

const dbWriter = DBWriter.instance;
const dbReader = DBReader.instance;
const scrambleGenerator = new Scrambler();

export const useSolveManager = (selectedDiscipline: Discipline, selectedSession: string) => {
    const [rawSolves, setRawSolves] = useState<ISolve[]>([]);
    const [currentScramble, setCurrentScramble] = useState<string>("");
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
    const solves = useSolvesWithAverages(rawSolves);

    useEffect(() => {
        let mounted = true;

        const initData = async () => {
            try {
                const fetchedSolves = await dbReader.getSolvesByDisciplineAndSession(userID, selectedDiscipline, selectedSession);
                if (mounted) {
                    setRawSolves(fetchedSolves);
                    setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));
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

            setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));

        } catch (error: any) {
            if (error.message === 'LIMIT_REACHED') {
                setIsLimitDialogOpen(true);
            } else {
                console.error("Failed to save solve", error);
            }
        }
    }, [userID, currentScramble, selectedDiscipline]);

    const deleteSolve = useCallback((solveID: number) => {
        dbWriter.deleteSolve(solveID);
        setRawSolves(prev => prev.filter(s => s.id !== solveID));
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
    };
};