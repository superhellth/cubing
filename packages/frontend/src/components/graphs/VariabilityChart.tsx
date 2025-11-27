import type { ISolve } from "@cubing/shared";
import { SparkLineChart } from "@mui/x-charts";
import { memo, useMemo } from "react";

const windowSize: number = 50;

const VariabilityChart = memo(({ solvesChronological }: any) => {

    const rollingStd: number[] = useMemo(() => {
        if (windowSize > solvesChronological.length) return [];
        const stds: number[] = [];
        for (let i = windowSize; i < solvesChronological.length; i++) {
            const solvesInWindow = solvesChronological.slice(i - windowSize, i);
            const meanDuration: number = solvesInWindow.reduce((accumulator: number, solve: ISolve) => accumulator + solve.duration, 0)
            const sse = solvesInWindow.reduce((accumulator: number, solve: ISolve) => accumulator + (solve.duration - meanDuration) ** 2, 0);
            stds.push(Math.sqrt((1 / (windowSize - 1)) * sse));
        }
        return stds;
    }, [solvesChronological]);

    return (
        <SparkLineChart data={rollingStd} />
    );
});

export default VariabilityChart;