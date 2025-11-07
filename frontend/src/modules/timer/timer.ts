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

    static getFilteredAvg(solves: number[]): number {
        const max = Math.max(...solves);
        let index = solves.indexOf(max);
        if (index !== -1) solves.splice(index, 1);
        const min = Math.min(...solves);
        index = solves.indexOf(min)
        if (index !== -1) solves.splice(index, 1);
        return this.getAvg(solves)
    }

    static getAvg(solves: number[]): number {
        const sum = solves.reduce((acc, val) => acc + val, 0);
        return sum / solves.length;
    }
}

export default Timer;