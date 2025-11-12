import type { Discipline, ISolve } from "@cubing/shared";

class Solve implements ISolve {
    readonly id: number;
    readonly username: string;
    readonly timeInMs: number;
    readonly date: Date;
    readonly scramble: string;
    discipline: Discipline;

    constructor(username: string, timeInMs: number, date: Date, scramble: string, discipline: Discipline) {
        this.id = -1;
        this.username = username;
        this.timeInMs = timeInMs;
        this.date = date;
        this.scramble = scramble;
        this.discipline = discipline;
    }
}

export default Solve;