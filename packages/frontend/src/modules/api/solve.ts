import type { Discipline, ISolve, Status } from "@cubing/shared";
import Timer from "../timer/timer";

class Solve implements ISolve {
    readonly id: number;
    readonly uuid: string;
    readonly duration: number;
    readonly date: Date;
    readonly scramble: string;
    readonly discipline: Discipline;
    readonly session: string;
    status: Status;
    avg5?: number | null;
    avg12?: number | null;

    constructor(data: any) {
        this.id = Number(data.id) ?? null;
        this.session = data.session;
        this.uuid = data.uuid;
        this.duration = data.duration;
        this.date = data.date;
        this.scramble = data.scramble;
        this.discipline = data.discipline;
        this.status = data.status;
        this.avg5 = data.avg5 ?? null;
        this.avg12 = data.avg12 ?? null;
    }

    public setStatus(status: Status): void {
        this.status = status;
    }

    public getDisplayableAvg5() {
        return Timer.formatTime(this.avg5)
    }
    public getDisplayableAvg12() {
        return Timer.formatTime(this.avg12)
    }
}

export default Solve;