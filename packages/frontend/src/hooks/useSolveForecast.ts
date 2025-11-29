// useSolvesForecast.ts (or top of file)
import { ISolve } from "@cubing/shared";
import { useMemo } from 'react';
import { HoltsLinear } from '../utils/holtsLinear';

interface ForecastResult {
    predictions: ISolve[];
    confidences: Array<{ y0: number; y1: number }[]>;
}

export const useSolvesForecast = (solvesChronologically: ISolve[], predictKeys: string[], predictionHorizon: number): ForecastResult => {

    // 1. Calculate Forecasters
    const forecasters = useMemo(() => {
        return predictKeys.map((key: any) => {
            const values = solvesChronologically.map((s: ISolve) => s[key as keyof ISolve]).filter((n: any): n is number => typeof n === 'number');
            const { alpha, beta } = HoltsLinear.optimize(values);
            const model = new HoltsLinear({ alpha, beta });
            values.forEach((v: any) => model.update(v));
            return model;
        });
    }, [solvesChronologically, predictKeys]);

    // 2. Generate Predictions & Confidence Intervals
    const { predictedSolves, confidences } = useMemo(() => {
        const lastIdx = solvesChronologically.length - 1;
        const predictions: any[] = [];
        const allConfidences: any[][] = [];

        // Initialize prediction array structure
        for (let i = 0; i < predictionHorizon; i++) {
            predictions.push({});
        }

        predictKeys.forEach((key: any, keyIdx: any) => {
            const lastVal = solvesChronologically[lastIdx][key as keyof ISolve] as number;
            const currentConf = [{ y0: lastVal, y1: lastVal }];

            for (let i = 0; i < predictionHorizon; i++) {
                const { forecast, lower, upper } = forecasters[keyIdx].predictInterval(i + 1, 0.95);
                predictions[i][key] = forecast;
                currentConf.push({ y0: lower, y1: upper });
            }
            allConfidences.push(currentConf);
        });

        return { predictedSolves: predictions, confidences: allConfidences };
    }, [solvesChronologically, forecasters, predictKeys]);

    return {predictions: predictedSolves, confidences};
};