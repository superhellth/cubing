
class Timer {
    constructor() {
    }

    static formatTime(ms: number | null | undefined) {
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
}

export default Timer;