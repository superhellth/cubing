import type { Solve, SolveStats } from "@cubing/shared";
import { useMemo } from "react";
import { solvesToTimeSeries } from "../../utils/solveUtils";

const predictARMA = (data: number[], steps: number): number[] => {
    const n = data.length;
    if (n < 2) return Array(steps).fill(n === 1 ? data[0] : 0);

    // 1. Differencing (Integrated part): Convert raw values to "change per step"
    // This removes the trend so we can analyze the stationarity.
    const diffs: number[] = [];
    let sumDiffs = 0;
    for (let i = 1; i < n; i++) {
        const d = data[i] - data[i - 1];
        diffs.push(d);
        sumDiffs += d;
    }

    // 2. Fit AR(1) Model: Find correlation between a change and the previous change
    // formula: phi = Covariance(diff[t], diff[t-1]) / Variance(diff[t-1])
    const meanDiff = sumDiffs / diffs.length;
    let numerator = 0;
    let denominator = 0;

    for (let i = 1; i < diffs.length; i++) {
        const prev = diffs[i - 1] - meanDiff;
        const curr = diffs[i] - meanDiff;
        numerator += prev * curr;
        denominator += prev * prev;
    }

    // If variance is 0 (data is perfectly linear), phi is 0.
    const phi = denominator === 0 ? 0 : numerator / denominator;

    // 3. Forecast
    const predictions: number[] = [];
    let lastVal = data[n - 1];
    let lastDiff = diffs[diffs.length - 1];

    for (let i = 0; i < steps; i++) {
        // AR(1) formula: next_diff = mean + phi * (last_diff - mean)
        // This effectively "fades" the current momentum back to the average improvement rate
        const predictedDiff = meanDiff + phi * (lastDiff - meanDiff);

        // Re-integrate: Add the predicted change to the last known value
        const nextVal = lastVal + predictedDiff;

        predictions.push(Math.max(0, nextVal)); // Clamp to 0 like original

        // Update state for next step
        lastVal = nextVal;
        lastDiff = predictedDiff;
    }

    return predictions;
};

export const useARMA = (
    solvesChrono: Solve[],
    predictKeys: (keyof SolveStats)[],
    predictionHorizon: number
): SolveStats[] => {
    return useMemo(() => {
        if (solvesChrono.length === 0) return [];

        const predictions: SolveStats[] = [];
        const predictedSeries: Map<keyof SolveStats, number[]> = new Map();

        // Assuming you have this helper from your original code
        const solvesAsSeries: Map<keyof SolveStats, number[]> = solvesToTimeSeries(solvesChrono);

        // 1. Generate predictions for each key
        for (let key of predictKeys) {
            const seriesData = solvesAsSeries.get(key);
            if (seriesData) {
                predictedSeries.set(key, predictARMA(seriesData, predictionHorizon));
            }
        }

        // 2. Pivot from Column-based (Series) to Row-based (SolveStats objects)
        for (let i = 0; i < predictionHorizon; i++) {
            const stepPrediction: Partial<SolveStats> = {};

            for (let key of predictKeys) {
                const series = predictedSeries.get(key);
                if (series) {
                    stepPrediction[key] = series[i];
                }
            }
            predictions.push(stepPrediction as SolveStats);
        }

        return predictions;

    }, [solvesChrono, predictKeys, predictionHorizon]);
};