import type { ISolve } from "@cubing/shared";
import { useMemo } from "react";

export const useOutlierDetection = (solves: ISolve[]) => {
    return useMemo(() => {
        if (solves.length < 4) return { valid: solves, outliers: [] };

        const sorted = [...solves].sort((a, b) => a.duration - b.duration);

        const q1Index = Math.floor(sorted.length * 0.25);
        const q3Index = Math.floor(sorted.length * 0.75);

        const q1 = sorted[q1Index].duration;
        const q3 = sorted[q3Index].duration;

        const iqr = q3 - q1;
        const lowerFence = q1 - (1.5 * iqr);
        const upperFence = q3 + (1.5 * iqr);

        const nonOutliers: ISolve[] = [];
        const outliers: ISolve[] = [];

        for (const solve of solves) {
            if (solve.duration >= lowerFence && solve.duration <= upperFence) {
                nonOutliers.push(solve);
            } else {
                outliers.push(solve);
            }
        }

        return { nonOutliers, outliers, thresholds: { low: lowerFence, high: upperFence } };
    }, [solves])
}