import type { ISolve } from '@cubing/shared';
import { useMemo } from 'react';
import { createForecaster, type ForecastModelType } from '../utils/forecaster';

export const useSolvesForecast = (
    solvesChronologically: ISolve[],
    predictKeys: string[],
    predictionHorizon: number,
    modelType: ForecastModelType = 'holts'
) => {
    const forecasters = useMemo(() => {
        return predictKeys.map((key) => {
            const values = solvesChronologically
                .map((s) => s[key as keyof ISolve])
                .filter((n): n is number => typeof n === 'number');

            return createForecaster(modelType, values);
        });
    }, [solvesChronologically, predictKeys, modelType]);

    const { predictedSolves, confidences } = useMemo(() => {
        if (solvesChronologically.length === 0) return { predictedSolves: [], confidences: [] };

        const lastIdx = solvesChronologically.length - 1;
        const predictions: any[] = Array.from({ length: predictionHorizon }, () => ({}));
        const allConfidences: any[][] = [];

        predictKeys.forEach((key, keyIdx) => {
            const lastValRaw = solvesChronologically[lastIdx][key as keyof ISolve];
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
    }, [solvesChronologically, forecasters, predictKeys, predictionHorizon]);

    return { predictions: predictedSolves, confidences };
};