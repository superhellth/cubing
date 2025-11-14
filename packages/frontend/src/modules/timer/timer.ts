import type Solve from "../api/solve";

class Timer {
    constructor() {
    }

    static formatTime(ms: number | null) {
        if (ms == 0) {
            return "0.00";
        }
        if (!ms) {
            return "";
        }
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        if (minutes > 0) {
            return `${minutes}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
        }

        return `${seconds}.${String(milliseconds).padStart(2, "0")}`;
    };

    static getFilteredAvg(solves: Solve[]): number {
        const solveTimes: number[] = solves.map(solve => solve.duration);
        solveTimes.sort((a, b) => a - b);
        const relevantTimes = solveTimes.slice(1, -1);
        const sum = relevantTimes.reduce((acc, val) => acc + val, 0);
        return sum / relevantTimes.length;
    }

    static getAvg(solves: Solve[]): number {
        const solveTimes = [...solves.map(solve => solve.duration)]
        const sum = solveTimes.reduce((acc, val) => acc + val, 0);
        return sum / solves.length;
    }
}

export default Timer;