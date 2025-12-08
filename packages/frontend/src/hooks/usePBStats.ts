import type { ISolve } from "@cubing/shared";
import { useMemo } from "react";
import { sortChronologically } from "../utils/solveUtils";

const usePBStats = (solves: ISolve[]) => {
    return useMemo(() => {

        let currentPb = Infinity;

        return sortChronologically(solves).map((s: any, i: any) => {
            const isNewPB = s.duration < currentPb;
            if (isNewPB) currentPb = s.duration;
            return { ...s, index: i, pb: currentPb, newPB: isNewPB };
        });
    }, [solves]);
}

export default usePBStats;