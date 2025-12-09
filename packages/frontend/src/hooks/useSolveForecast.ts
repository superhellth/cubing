import type { Solve } from '@cubing/shared';
import { useMemo } from 'react';
import { createForecaster, type ForecastModelType } from '../utils/forecaster';

export const useSolvesForecast = (
    solvesChrono: Solve[],
    predictKeys: (keyof Solve)[],
    predictionHorizon: number,
    modelType: ForecastModelType = 'holts'
) => {
    const forecasters = useMemo(() => {
        return predictKeys.map((key) => {
            const timeSeries = solvesChrono
                .map((s) => s[key])
                .filter((n): n is number => typeof n === 'number');

            return createForecaster(modelType, timeSeries);
        });
    }, [solvesChrono, predictKeys, modelType]);

    const { predictedSolves, confidences } = useMemo(() => {
        if (solvesChrono.length === 0) return { predictedSolves: [], confidences: [] };

        const lastIdx = solvesChrono.length - 1;
        const predictions: any[] = Array.from({ length: predictionHorizon }, () => ({}));
        const allConfidences: any[][] = [];

        predictKeys.forEach((key, keyIdx) => {
            const lastValRaw = solvesChrono[lastIdx][key];
            const lastVal = typeof lastValRaw === 'number' ? lastValRaw : 0;

            const currentConf = [{ y0: lastVal, y1: lastVal }];

            for (let i = 0; i < predictionHorizon; i++) {
                const step = i + 1;
                const { forecast, lower, upper } = forecasters[keyIdx].predictInterval(step, 0.95);

                predictions[i][key] = forecast === 0 ? null : forecast;
                currentConf.push({ y0: lower, y1: upper });
            }
            allConfidences.push(currentConf);
        });
        return { predictedSolves: predictions, confidences: allConfidences };
    }, [solvesChrono, forecasters, predictKeys, predictionHorizon]);

    return { predictions: predictedSolves, confidences };
};