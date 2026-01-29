import { Discipline, Status, type NewSolve, type Solve, type StatlessSolve } from "@cubing/shared";
import { useCallback, useEffect, useState } from 'react';
import DBReader from '../../services/dbReader';
import DBWriter from '../../services/dbWriter';
import { EVENT_TO_SCRAMBLE_KEY } from "../../utils/constants";
import { generateScramble, solveWithUpdatedStatus } from '../../utils/solveUtils';
import { useUserID } from "../useUserID";
import { usePB } from "./usePB";
import { useSolveStats } from './useSolveStats';

const dbWriter = DBWriter.instance;
const dbReader = DBReader.instance;

export const useSolveManager = (selectedDiscipline: Discipline, selectedSession: string) => {
    // Solves
    const [statlessSolvesChrono, setStatlessSolvesChrono] = useState<StatlessSolve[]>([]);
    const solvesChrono: Solve[] = useSolveStats(statlessSolvesChrono);
    // Other
    const pb = usePB(statlessSolvesChrono);
    const [currentScramble, setCurrentScramble] = useState<string>("Generating Scramble...");
    const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [dataIsReady, setDataIsReady] = useState<boolean>(false);
    const userID = useUserID();

    useEffect(() => {
        setDataIsReady(hasFetched && statlessSolvesChrono.length === solvesChrono.length);
    }, [statlessSolvesChrono, solvesChrono, hasFetched])

    useEffect(() => {
        setHasFetched(false);
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

    const getSolvesOfAverage = (solve: Solve, avgType: "avg5" | "avg12") => {
        const solveIndex = solvesChrono.findIndex(s => s.pk === solve.pk);
        const relevantSolves: Solve[] = [];
        const howMany: number = avgType == "avg5" ? 5 : 12;
        for (let i = solveIndex; i > Math.max(0, solveIndex - howMany); i--) {
            relevantSolves.push(solvesChrono[i]);
        }
        return relevantSolves;
    }

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
                session: "default",
                importSource: null,
                importKey: null
            });

            setStatlessSolvesChrono(prev => [...prev, newSolve]);

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

    const insertBulk = useCallback(async (solves: NewSolve[]) => {
        const insertedSolves: StatlessSolve[] = await dbWriter.insertSolvesBulk(solves);
        setStatlessSolvesChrono(prev => [...prev, ...insertedSolves]);
    }, [])

    const deleteSolve = useCallback((solvePk: bigint, uuid: string) => {
        dbWriter.deleteSolve(solvePk, uuid);
        setStatlessSolvesChrono(prev => prev.filter(s => s.pk !== solvePk));
    }, []);

    const deleteLastSolves = useCallback((pkOfFirstSolve: bigint, lastX: number) => {
        const solveIndex = solvesChrono.findIndex(s => s.pk === pkOfFirstSolve);
        const toDelete: bigint[] = []
        for (let i = Math.max(0, solveIndex - lastX); i <= solveIndex; i++) {
            toDelete.push(solvesChrono[i].pk);
        }
        deleteMany(toDelete);
    }, [solvesChrono]);

    const deleteMany = useCallback((pksToDelete: bigint[]) => {
        dbWriter.deleteSolvesBulk(pksToDelete, userID)
        setStatlessSolvesChrono(prev => prev.filter(s => !pksToDelete.includes(s.pk)));
    }, [solvesChrono]);

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
        dataIsReady,
        setIsLimitDialogOpen,
        getSolvesOfAverage,
        addSolve,
        insertBulk,
        deleteSolve,
        deleteMany,
        deleteLastSolves,
        updateSolveStatus,
    };
};