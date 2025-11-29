import { Status, type ISolve } from "@cubing/shared";
import Timer from "./timer";

export function getDisplayableTime(solve: ISolve, key: keyof ISolve) {
    if (key == "duration") return getDisplayTime(solve);
    const time = solve[key];
    if (time === -1) {
        return "DNF";
    }
    return Timer.formatTime(time as number);
}

export function getDisplayTime(solve: ISolve) {
    let solveDuration: number = solve.duration;
    if (solve.status === Status.PlusTwo) {
        solveDuration += 2000;
    } else if (solve.status === Status.DNF) {
        return "DNF";
    }
    return Timer.formatTime(solveDuration);
}

export function solveWithUpdatedStatus(solve: ISolve, newStatus: Status) {
    return {
        ...solve,
        status: newStatus
    }
}

export function sortChronologically(solves: ISolve[], order="asc") {
    if (order === "asc") {
        return solves.sort((a: ISolve, b: ISolve) => {return a.date.getTime() - b.date.getTime()})
    } else {
        return solves.sort((a: ISolve, b: ISolve) => {return b.date.getTime() - a.date.getTime()})
    }
}