import type { Solve } from "@cubing/shared";
import { useMemo } from "react";

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

const useImprovementStats = (solvesChrono: Solve[]) => {
    return useMemo(() => {

        const columns = {
            duration: [] as number[],
            pb: [] as number[],
            avg5: [] as number[],
            avg12: [] as number[],
            avg100: [] as number[],
            avg1000: [] as number[],
        };

        for (const solve of solvesChrono) {
            columns.pb.push(solve.pb);
            columns.duration.push(solve.duration);
            columns.avg5.push(solve.avg5!);
            columns.avg12.push(solve.avg12!);
            columns.avg100.push(solve.avg100!);
            columns.avg1000.push(solve.avg1000!);
        }

        const getTrend = (data: number[]) => {
            return calculateTrend(data.filter(Boolean));
        };

        const RECENT_LIMIT = 100;

        return {
            all: {
                pb: getTrend(columns.pb),
                duration: getTrend(columns.duration),
                avg5: getTrend(columns.avg5),
                avg12: getTrend(columns.avg12),
                avg100: getTrend(columns.avg100),
                avg1000: getTrend(columns.avg1000),
            },
            recent: {
                pb: getTrend(columns.pb.slice(RECENT_LIMIT)),
                duration: getTrend(columns.duration.slice(RECENT_LIMIT)),
                avg5: getTrend(columns.avg5.slice(RECENT_LIMIT)),
                avg12: getTrend(columns.avg12.slice(RECENT_LIMIT)),
                avg100: getTrend(columns.avg100.slice(RECENT_LIMIT)),
                avg1000: getTrend(columns.avg1000.slice(RECENT_LIMIT)),
            }
        };
    }, [solvesChrono]);
}

export default useImprovementStats;