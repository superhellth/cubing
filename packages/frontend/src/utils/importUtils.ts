import { Discipline, ImportSource, Status, type NewSolve } from "@cubing/shared";
import type { Session } from "../hooks/useExtractSessions";

export async function csTimerFileToSessions(file: any, uuid: string): Promise<Session[]> {
    const text = await file.text();
    const data = JSON.parse(text);
    data.properties.sessionData = JSON.parse(data.properties.sessionData);
    data.properties.toolsfunc = JSON.parse(data.properties.toolsfunc);
    const sessionData = data.properties.sessionData;

    const relevantSessions: Session[] = [];
    Object.entries(sessionData).forEach(([key, value]: any) => {
        if (value.stat && value.stat[0] > 0) {
            relevantSessions.push({
                name: value.name,
                solveCount: value.stat[0],
                solves: csTimerSolveArrayToSolves(data["session" + key], uuid, "default")
            });
        }
    })
    return relevantSessions;
}

const CUBIC_TIMER_CODE_TO_STATUS = new Map<number, Status>([
    [0, Status.Valid],
    [1, Status.PlusTwo],
    [2, Status.DNF],
]);

export async function cubicTimerFileToSessions(file: any, uuid: string): Promise<Session[]> {
    const text: string = await file.text();
    const lines: string[] = text.trim().split(/\r?\n/);
    const dataRows: string[] = lines.slice(1);
    const nonEmpty = dataRows.filter((line: string) => line.trim() !== "");
    const sessions: Map<string, Session> = new Map();

    for (let line of nonEmpty) {
        const cleanedLine = line.trim().replace(/^"|"$/g, "");
        const columns = cleanedLine.split('";"');
        const sessionName = columns[0] + " " + columns[1];
        if (!sessions.get(sessionName)) {
            sessions.set(sessionName, {name: sessionName, solveCount: 0, solves: []});
        }
        const session = sessions.get(sessionName);
        session!.solveCount += 1;
        const timestamp = parseInt(columns[3]);
        const scramble = columns[4];
        const duration = parseInt(columns[2]);
        session!.solves.push({
            uuid: uuid,
            discipline: Discipline.ThreeByThree,
            session: "default",
            duration: duration,
            date: new Date(timestamp),
            scramble: scramble,
            status: CUBIC_TIMER_CODE_TO_STATUS.get(parseInt(columns[5])) ?? Status.Valid,
            importSource: ImportSource.CubicTimer,
            importKey: generateNumericKey(timestamp, scramble, duration),
        });
    }

    return [...sessions.values()];
}

const CSTIMER_CODE_TO_STATUS = new Map<number, Status>([
    [0, Status.Valid],
    [-1, Status.DNF],
    [2000, Status.PlusTwo],
]);

export function csTimerSolveArrayToSolves(csTimerSolveArray: any[], uuid: string, session: string): NewSolve[] {
    const solves: NewSolve[] = [];
    let i: number = 0;
    const timeNow: number = (new Date()).getTime();
    for (let solve of csTimerSolveArray) {
        const duration: number = solve[0][1];
        const scramble: string = solve[1];
        const status: Status = CSTIMER_CODE_TO_STATUS.get(solve[0][0]) ?? Status.Valid;
        const timestamp: number = solve[3] * 1000;
        solves.push({
            uuid: uuid,
            discipline: Discipline.ThreeByThree,
            session: session,
            duration: duration,
            date: new Date(timeNow + i++),
            scramble: scramble,
            status: status,
            importSource: ImportSource.CsTimer,
            importKey: generateNumericKey(timestamp, scramble, duration)
        })
    }
    return solves;
}

function generateNumericKey(timestamp: number, scramble: string, duration: number): bigint {
    // 1. Combine all inputs into a unique string
    const input = `${timestamp}|${scramble}|${duration}`;

    // 2. FNV-1a 64-bit Hash Algorithm
    // Initial offset basis (standard constant)
    let hash = 0xcbf29ce484222325n;
    // FNV prime (standard constant)
    const fnvPrime = 0x100000001b3n;

    for (let i = 0; i < input.length; i++) {
        // XOR the lower 8 bits with the character code
        hash ^= BigInt(input.charCodeAt(i));
        // Multiply by the FNV prime
        hash *= fnvPrime;
        // Wrap to 64-bit unsigned to mimic C++ behavior (optional but safe)
        hash &= 0xffffffffffffffffn;
    }

    // Return as BigInt (or .toString() if you need to send it over JSON)
    return BigInt.asIntN(64, hash);;
}