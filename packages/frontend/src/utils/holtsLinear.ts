export interface HoltsParams {
    alpha: number;
    beta: number;
}

export class HoltsLinear {
    private alpha: number;
    private beta: number;
    private level: number | null = null;
    private trend: number | null = null;

    // New: Track errors to calculate confidence/prediction intervals
    private sse: number = 0; // Sum of Squared Errors
    private n: number = 0;   // Number of updates (observations)

    constructor({ alpha = 0.5, beta = 0.3 }: Partial<HoltsParams> = {}) {
        this.alpha = alpha;
        this.beta = beta;
    }

    update(value: number): void {
        if (this.level === null) {
            this.level = value;
            return;
        }

        if (this.trend === null) {
            // Initialize trend on second point
            this.trend = value - this.level;
            this.level = value;
            return;
        }

        // 1. Calculate prediction for THIS step (before seeing the real value)
        const prediction = this.level + this.trend;

        // 2. Track the error (Residual)
        const error = value - prediction;
        this.sse += error * error;
        this.n++;

        // 3. Update Level and Trend
        const prevLevel = this.level;
        const prevTrend = this.trend;

        this.level = this.alpha * value + (1 - this.alpha) * (prevLevel + prevTrend);
        this.trend = this.beta * (this.level - prevLevel) + (1 - this.beta) * prevTrend;
    }

    predict(steps: number = 1): number {
        if (this.level === null) return 0;
        if (this.trend === null) return this.level;
        return this.level + (steps * this.trend);
    }

    /**
     * Returns the prediction range for a future step.
     * @param steps - How far ahead to predict (e.g., 1, 2, 3...)
     * @param confidenceLevel - 0.95 for 95% confidence (default)
     */
    predictInterval(steps: number = 1, confidenceLevel: number = 0.95) {
        const forecast = this.predict(steps);

        // If we don't have enough history to measure error, return 0 margin
        if (this.n < 2) return { forecast, lower: forecast, upper: forecast };

        // 1. Calculate Standard Deviation of residuals (Sigma)
        const sigma = Math.sqrt(this.sse / (this.n - 1));

        // 2. Calculate Variance Multiplier for h-steps ahead
        // Formula: 1 + sum[(alpha + j*beta)^2] for j=1 to h-1
        let sumCoeffs = 0;
        for (let j = 1; j < steps; j++) {
            const coeff = this.alpha + (j * this.beta);
            sumCoeffs += coeff * coeff;
        }
        const varianceMultiplier = 1 + sumCoeffs;

        // 3. Calculate Margin of Error
        // z-score approx: 1.96 for 95%, 1.64 for 90%
        const z = confidenceLevel === 0.95 ? 1.96 : 1.645;
        const margin = z * sigma * Math.sqrt(varianceMultiplier);

        return {
            forecast,
            lower: forecast - margin,
            upper: forecast + margin,
            margin
        };
    }

    // Optimize method remains the same...
    static optimize(history: number[]): HoltsParams {
        let bestParams = { alpha: 0.5, beta: 0.3 };
        let minError = Infinity;

        // Grid search resolution (0.1 steps)
        for (let a = 0.1; a <= 0.9; a += 0.1) {
            for (let b = 0.1; b <= 0.9; b += 0.1) {
                const model = new HoltsLinear({ alpha: a, beta: b });
                let errorSum = 0;
                let count = 0;

                // "Walk forward" validation
                for (let i = 0; i < history.length - 1; i++) {
                    model.update(history[i]);
                    // Predict next value (1 step ahead)
                    const prediction = model.predict(1);
                    // Compare with actual next value
                    const actualNext = history[i + 1];

                    if (model.trend !== null) { // Only score if model has fully initialized
                        const diff = actualNext - prediction;
                        errorSum += diff * diff;
                        count++;
                    }
                }

                const mse = count > 0 ? errorSum / count : Infinity;
                if (mse < minError) {
                    minError = mse;
                    bestParams = { alpha: a, beta: b };
                }
            }
        }
        return bestParams;
    }
}