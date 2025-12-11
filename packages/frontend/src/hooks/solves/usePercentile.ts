import { Status, type Solve } from "@cubing/shared";
import { useMemo } from "react";

const usePercentile = (solvesChrono: Solve[]) => {
    return useMemo(() => {
        if (solvesChrono.length <= 1) return 100;
        if (solvesChrono[0].status === Status.DNF) return 0;
        const slowerSolvesCount = solvesChrono.filter(s => s.duration > solvesChrono[0].duration || s.status === Status.DNF).length;
        const rawPercent = (slowerSolvesCount / (solvesChrono.length - 1)) * 100;
        return Math.round(rawPercent);
    }, [solvesChrono]);
}

export default usePercentile;