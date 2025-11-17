import type { Discipline, ISolve, Status } from "@cubing/shared";

class Solve implements ISolve {
    readonly id: number;
    readonly uuid: string;
    readonly duration: number;
    readonly date: Date;
    readonly scramble: string;
    readonly discipline: Discipline;
    status: Status;
    readonly session: string;

    constructor(data: any) {
        this.id = Number(data.id);
        this.session = data.session;
        this.uuid = data.uuid;
        this.duration = data.duration;
        this.date = data.date;
        this.scramble = data.scramble;
        this.discipline = data.discipline;
        this.status = data.status;
    }

    public setStatus(status: Status): void {
        this.status = status;
    }
}

export default Solve;