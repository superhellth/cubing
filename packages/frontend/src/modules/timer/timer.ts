import type Solve from "../api/solve";

class Timer {
    constructor() {
    }

    static formatTime(ms: number) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        if (minutes > 0) {
            return `${minutes}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
        }

        return `${seconds}.${String(milliseconds).padStart(2, "0")}`;
    };

    static getFilteredAvg(solves: Solve[]): number {
        const solveTimes: number[] = [...solves.map(solve => solve.timeInMs)];
        const max: number = Math.max(...solveTimes);
        let index: number = solveTimes.indexOf(max);
        if (index !== -1) solves.splice(index, 1);
        const min = Math.min(...solveTimes);
        index = solveTimes.indexOf(min)
        if (index !== -1) solves.splice(index, 1);
        return this.getAvg(solves)
    }

    static getAvg(solves: Solve[]): number {
        const solveTimes = [...solves.map(solve => solve.timeInMs)]
        const sum = solveTimes.reduce((acc, val) => acc + val, 0);
        return sum / solves.length;
    }
}

export default Timer;