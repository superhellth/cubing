import type { Discipline, ISolve, Status } from "@cubing/shared";

class Solve implements ISolve {
    readonly id: number;
    readonly uuid: string;
    readonly duration: number;
    readonly date: Date;
    readonly scramble: string;
    readonly discipline: Discipline;
    readonly status: Status;
    readonly session: string;

    constructor(uuid: string, timeInMs: number, date: Date, scramble: string, discipline: Discipline, status: Status, session: string) {
        this.id = -1;
        this.session = session;
        this.uuid = uuid;
        this.duration = timeInMs;
        this.date = date;
        this.scramble = scramble;
        this.discipline = discipline;
        this.status = status;
    }
}

export default Solve;