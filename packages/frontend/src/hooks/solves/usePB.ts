import { Status, type StatlessSolve } from "@cubing/shared";
import { useMemo } from "react";

export const usePB = (statlessSolvesChrono: StatlessSolve[]) => {
    return useMemo(() => {
        let currentPb: number = Infinity;
        for (let i = 0; i < statlessSolvesChrono.length; i++) {
            const solve: StatlessSolve = statlessSolvesChrono[i];
            if (solve.duration < currentPb && solve.status === Status.Valid) {
                currentPb = solve.duration;
            }
        }
        return currentPb;
    }, [statlessSolvesChrono])
}