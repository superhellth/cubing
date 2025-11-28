import { useMemo } from 'react';
import { ISolve } from "@cubing/shared";
import { calculateAverage } from '../utils/calc';

export function useSolveStats(solves: ISolve[]) {

    return useMemo(() => {
        if (!solves.length) return [];

        return solves.map((solve, index): ISolve => {
            const relevantSolves = solves.slice(index, index + 1000);

            const getAvg = (size: number) => {
                if (relevantSolves.length < size) return undefined;
                const result = calculateAverage(relevantSolves, size);
                return result === null ? undefined : result;
            };

            return {
                ...solve,
                avg5: getAvg(5),
                avg12: getAvg(12),
                avg100: getAvg(100),
                avg1000: getAvg(1000),
            };
        });
    }, [solves]);
}