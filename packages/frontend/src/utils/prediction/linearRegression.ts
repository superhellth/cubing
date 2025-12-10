export class LinearRegression {
    private history: number[] = [];

    // Helper to cache calculations if needed, though for <10k points calculating on fly is fine
    constructor() {}

    /**
     * Adds a new observation to the model.
     * In Linear Regression, this adds to the dataset used to calculate the best fit line.
     */
    update(value: number): void {
        this.history.push(value);
    }

    /**
     * Internal helper to calculate Slope (m), Intercept (b), and Error metrics.
     * We assume x = 0, 1, 2... (time steps)
     */
    private getStats() {
        const n = this.history.length;
        if (n < 2) return null;

        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

        for (let i = 0; i < n; i++) {
            const x = i;
            const y = this.history[i];
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        }

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Calculate Standard Error of Estimate (Syx)
        let sse = 0; // Sum of squared errors
        let sumSqDiffX = 0; // Sum of (x - meanX)^2 for interval calc
        const meanX = sumX / n;

        for (let i = 0; i < n; i++) {
            const yActual = this.history[i];
            const yPred = slope * i + intercept;
            sse += Math.pow(yActual - yPred, 2);
            sumSqDiffX += Math.pow(i - meanX, 2);
        }

        // Standard Error of the Estimate
        const syx = Math.sqrt(sse / (n - 2));

        return { slope, intercept, syx, meanX, sumSqDiffX, n };
    }

    /**
     * Predicts the value 'steps' ahead of the current last point.
     */
    predict(steps: number = 1): number {
        const n = this.history.length;
        if (n === 0) return 0;
        if (n === 1) return this.history[0];

        const stats = this.getStats();
        if (!stats) return this.history[n - 1];

        // Current index is n-1. Future index is (n-1) + steps.
        const futureX = (n - 1) + steps;
        
        return Math.max(stats.slope * futureX + stats.intercept, 0.1);
    }

    /**
     * Returns the prediction range for a future step.
     * Uses the standard error of the estimate and prediction interval formula.
     */
    predictInterval(steps: number = 1, confidenceLevel: number = 0.95) {
        const forecast = this.predict(steps);
        const stats = this.getStats();

        // Need at least 3 points for meaningful statistics (n-2 degrees of freedom)
        if (!stats || stats.n < 3) {
            return { forecast, lower: forecast, upper: forecast, margin: 0 };
        }

        const { syx, n, meanX, sumSqDiffX } = stats;
        
        // Future X value
        const x0 = (n - 1) + steps;

        // T-statistic approximation (using Z for simplicity as in original code)
        // Ideally: use a T-distribution lookup for small n
        const t = confidenceLevel === 0.95 ? 1.96 : 1.645;

        // Prediction Interval Formula:
        // Margin = t * Syx * sqrt(1 + 1/n + (x0 - meanX)^2 / sum((xi - meanX)^2))
        const distanceTerm = Math.pow(x0 - meanX, 2) / sumSqDiffX;
        const margin = t * syx * Math.sqrt(1 + (1 / n) + distanceTerm);

        return {
            forecast,
            lower: forecast - margin,
            upper: forecast + margin,
            margin
        };
    }
}