import { Status, type Discipline, type NewSolve } from "@cubing/shared";

export async function csTimerFileToObject(file: any) {
    const text = await file.text();
    const data = JSON.parse(text);
    data.properties.sessionData = JSON.parse(data.properties.sessionData)
    data.properties.toolsfunc = JSON.parse(data.properties.toolsfunc)
    return data;
}

const CODE_TO_STATUS = new Map<number, Status>([
    [0, Status.Valid],
    [-1, Status.DNF],
    [2000, Status.PlusTwo],
]);

export function csTimerSolveArrayToSolves(csTimerSolveArray: any[], disc: Discipline, uuid: string, session: string): NewSolve[] {
    const solves: NewSolve[] = [];
    for (let solve of csTimerSolveArray) {
        const duration: number = solve[0][1];
        const scramble: string = solve[1];
        const status: Status = CODE_TO_STATUS.get(solve[0][0]) ?? Status.Valid;
        solves.push({
            uuid: uuid,
            discipline: disc,
            session: session,
            duration: duration,
            date: new Date(),
            scramble: scramble,
            status: status,
        })
    }
    return solves;
}