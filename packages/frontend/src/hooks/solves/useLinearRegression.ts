import type { Solve, SolveStats } from '@cubing/shared';
import { useMemo } from 'react';
import { solvesToTimeSeries } from '../../utils/solveUtils';

const predictLinearRegression = (data: number[], steps: number): number[] => {
    const n = data.length;
    if (n === 0) return [];

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
        const x = i;
        const y = data[i];
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const predictions = [];
    for (let i = 1; i <= steps; i++) {
        const futureX = n - 1 + i;
        const predictedY = slope * futureX + intercept;
        predictions.push(Math.max(0, predictedY));
    }

    return predictions;
};

export const useLinearRegression = (solvesChrono: Solve[], predictKeys: (keyof SolveStats)[], predictionHorizon: number): SolveStats[] => {
    return useMemo(() => {
        if (solvesChrono.length == 0) return [];
        const predictions: SolveStats[] = [];
        const predictedSeries: Map<keyof SolveStats, number[]> = new Map();
        const solvesAsSeries: Map<keyof SolveStats, number[]> = solvesToTimeSeries(solvesChrono);
        for (let key of predictKeys) {
            predictedSeries.set(key, predictLinearRegression(solvesAsSeries.get(key)!, predictionHorizon));
        }
        for (let i = 0; i < predictionHorizon; i++) {
            const stepPrediction: Partial<SolveStats> = {};
            for (let key of predictKeys) {
                stepPrediction[key] = predictedSeries.get(key)![i];
            }
            predictions.push(stepPrediction as SolveStats);
        }
        return predictions;
    }, [solvesChrono, predictKeys, predictionHorizon]);
};