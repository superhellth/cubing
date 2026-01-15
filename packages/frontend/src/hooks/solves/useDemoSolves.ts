import type { Solve, StatlessSolve } from "@cubing/shared";
import { useEffect, useState } from "react";
import DBReader from "../../services/dbReader";
import { useSolveStats } from "./useSolveStats";

export const useDemoSolves = (loadSolves: boolean) => {
    const [statlessSolvesChrono, setStatlessSolvesChrono] = useState<StatlessSolve[]>([]);
    const solvesChrono: Solve[] = useSolveStats(statlessSolvesChrono);
    const [hasFetched, setHasFetched] = useState(false);
    const [demoIsReady, setDemoIsReady] = useState<boolean>(false);

    useEffect(() => {
        setDemoIsReady(hasFetched && solvesChrono.length !== 0);
    }, [statlessSolvesChrono, solvesChrono, hasFetched])

    useEffect(() => {
        if (!loadSolves) {
            setStatlessSolvesChrono([]);
            return;
        }

        let mounted = true;

        const initData = async () => {
            try {
                const fetchedSolves: StatlessSolve[] = await DBReader.instance.getDemoSolves();
                if (mounted) {
                    setStatlessSolvesChrono(fetchedSolves);
                    setHasFetched(true);
                }
            } catch (error) {
                console.error("Failed to fetch solves:", error);
            }
        };

        initData();

        return () => { mounted = false; };
    }, [loadSolves]);

    return { demoSolves: solvesChrono, demoIsReady };
}