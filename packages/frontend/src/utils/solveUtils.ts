import { getGrossDuration, SOLVE_STATS_KEYS, Status, type Solve, type SolveStats } from "@cubing/shared";
import { randomScrambleForEvent } from "cubing/scramble";

export async function generateScramble(event: string = "333") {
    return (await randomScrambleForEvent(event)).toString();
}

export function formatTime(ms: number | null | undefined) {
    // console.log(ms)
    if (ms == 0) {
        return "0.00";
    }
    if (!ms) {
        return " - ";
    }
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    if (minutes > 0) {
        return `${minutes}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
    }

    return `${seconds}.${String(milliseconds).padStart(2, "0")}`;
};

export function getDisplayableTime(solve: Solve, key: keyof Solve) {
    if (solve === undefined) return " - "
    let time = solve[key];
    if (key === "duration") {
        time = solve.grossDuration;
    }
    if (time === null) {
        return "DNF";
    }
    return formatTime(Number(time));
}

export function solveWithUpdatedStatus(solve: Solve, newStatus: Status) {
    return {
        ...solve,
        status: newStatus,
        grossDuration: getGrossDuration(solve.duration, newStatus)
    }
}

export function sortChronologically(solves: Solve[], order = "asc") {
    if (order === "asc") {
        return solves.sort((a: Solve, b: Solve) => { return a.date.getTime() - b.date.getTime() })
    } else {
        return solves.sort((a: Solve, b: Solve) => { return b.date.getTime() - a.date.getTime() })
    }
}

export function solvesToTimeSeries(solves: Solve[]): Map<keyof SolveStats, number[]> {
    return new Map<keyof SolveStats, number[]>(
        SOLVE_STATS_KEYS.map(key => [
            key,
            solves.map(solve => solve[key]).filter(v => v != null)
        ])
    );
}