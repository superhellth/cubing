// useSolvesForecast.ts (or top of file)
import { useMemo } from 'react';
import { ISolve } from "@cubing/shared";
import { HoltsLinear } from '../utils/holtsLinear';

const PREDICTION_HORIZON = 12;

interface ForecastResult {
    historyAndPredictions: ISolve[];
    xAxisData: number[];
    confidences: Array<{ y0: number; y1: number }[]>;
    lastIndex: number;
}

export const useSolvesForecast = (
    solves: ISolve[],
    predictKeys: (keyof ISolve)[]
): ForecastResult => {

    // 1. Calculate Forecasters
    const forecasters = useMemo(() => {
        return predictKeys.map(key => {
            const values = solves.map(s => s[key]).filter((n): n is number => typeof n === 'number');
            const { alpha, beta } = HoltsLinear.optimize(values);
            const model = new HoltsLinear({ alpha, beta });
            values.forEach(v => model.update(v));
            return model;
        });
    }, [solves, predictKeys]);

    // 2. Generate Predictions & Confidence Intervals
    const { predictedSolves, confidences } = useMemo(() => {
        const lastIdx = solves.length - 1;
        const predictions: any[] = [];
        const allConfidences: any[][] = [];

        // Initialize prediction array structure
        for (let i = 0; i < PREDICTION_HORIZON; i++) {
            predictions.push({ id: lastIdx + i + 1, index: lastIdx + i + 1, newPB: false });
        }

        predictKeys.forEach((key, keyIdx) => {
            const lastVal = solves[lastIdx][key] as number;
            const currentConf = [{ y0: lastVal, y1: lastVal }];

            for (let i = 0; i < PREDICTION_HORIZON; i++) {
                const { forecast, lower, upper } = forecasters[keyIdx].predictInterval(i + 1, 0.95);
                predictions[i][key] = forecast;
                currentConf.push({ y0: lower, y1: upper });
            }
            allConfidences.push(currentConf);
        });

        return { predictedSolves: predictions, confidences: allConfidences };
    }, [solves, forecasters, predictKeys]);

    // 3. Merge Data & Calculate PBs
    const result = useMemo(() => {
        let currentPb = Infinity;

        const historyWithMeta = solves.map((s, i) => {
            const isNewPB = s.duration < currentPb;
            if (isNewPB) currentPb = s.duration;
            return { ...s, index: i, pb: currentPb, newPB: isNewPB };
        });

        const combined = [...historyWithMeta, ...predictedSolves];

        return {
            historyAndPredictions: combined,
            xAxisData: combined.map((_, i) => i),
            confidences,
            lastIndex: solves.length - 1
        };
    }, [solves, predictedSolves, confidences]);

    return result;
};