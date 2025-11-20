import { Status, type ISolve } from "@cubing/shared";
import Timer from "../timer/timer";

type TimeKey = 'duration' | 'avg5' | 'avg12' | 'avg100' | 'avg1000';

export function getDisplayableTime(solve: ISolve, key: TimeKey) {
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