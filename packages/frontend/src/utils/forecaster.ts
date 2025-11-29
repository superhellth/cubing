import { HoltsLinear } from "./holtsLinear";
import { LinearRegression } from "./linearRegression";

// defined in your types file or at the top of the hook file
export type ForecastModelType = 'holts' | 'linear';

interface IForecaster {
    update(value: number): void;
    predictInterval(steps: number, confidence: number): { forecast: number, lower: number, upper: number };
}

// Factory to unify creation logic
export const createForecaster = (type: ForecastModelType, values: number[]): IForecaster => {
    if (type === 'holts') {
        // Holt's specific: Optimize parameters first
        const { alpha, beta } = HoltsLinear.optimize(values);
        const model = new HoltsLinear({ alpha, beta });
        values.forEach(v => model.update(v));
        return model;
    } else {
        // Linear Regression: Just add data (or use a sliding window if desired)
        const model = new LinearRegression();
        values.forEach(v => model.update(v));
        return model;
    }
};