import { ISolve } from "@cubing/shared";
import { useMemo } from "react";
import { sortChronologically } from "../utils/solveUtils";

export interface ImprovementStats {
    slope: number,
    absoluteChange: number,
    relativeChange: number
}

const calculateTrend = (data: number[]): ImprovementStats => {
    const n = data.length;
    if (n < 2) return { slope: 0, absoluteChange: 0, relativeChange: 0 };

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    for (let i = 0; i < n; i++) {
        const x = i;
        const y = data[i];
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = (n * sumXX) - (sumX * sumX);
    const slope = numerator / denominator;
    const estimatedChange = slope * (n - 1);

    const intercept = (sumY - slope * sumX) / n;
    const startEstimate = intercept;
    const endEstimate = slope * (n - 1) + intercept;
    let relativeChange = 0;
    if (startEstimate !== 0) {
        relativeChange = (endEstimate - startEstimate) / Math.abs(startEstimate);
    }

    return {
        slope: parseFloat(slope.toFixed(2)),
        absoluteChange: parseFloat(estimatedChange.toFixed(2)),
        relativeChange: relativeChange
    };
};

const useImprovementStats = (solves: ISolve[]) => {
    return useMemo(() => {
        const solvesChronologically = sortChronologically(solves);
        const singles: number[] = [];
        const avg5s: number[] = [];
        const avg12s: number[] = [];
        const avg100s: number[] = [];
        const avg1000s: number[] = [];
        for (let i = 0; i < solvesChronologically.length; i++) {
            const solve: ISolve = solvesChronologically[i];
            singles.push(solve.duration);
            avg5s.push(solve.avg5!);
            avg12s.push(solve.avg12!);
            avg100s.push(solve.avg100!);
            avg1000s.push(solve.avg1000!);
        }
        const trendSingle: any = calculateTrend(singles.filter(Boolean));
        const trendAvg5: any = calculateTrend(avg5s.filter(Boolean));
        const trendAvg12: any = calculateTrend(avg12s.filter(Boolean));
        const trendAvg100: any = calculateTrend(avg100s.filter(Boolean));
        const trendAvg1000: any = calculateTrend(avg1000s.filter(Boolean));

        return {
            "duration": trendSingle,
            "avg5": trendAvg5,
            "avg12": trendAvg12,
            "avg100": trendAvg100,
            "avg1000": trendAvg1000
        }
    }, [solves]);
}

export default useImprovementStats;