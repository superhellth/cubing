import { Status, type ISolve } from "@cubing/shared";
import Timer from "../timer/timer";

export function getDisplayableAvg5(solve: ISolve) {
    if (solve.avg5 == -1) {
        return "DNF";
    }
    return Timer.formatTime(solve.avg5);
}

export function getDisplayableAvg12(solve: ISolve) {
    if (solve.avg12 == -1) {
        return "DNF";
    }
    return Timer.formatTime(solve.avg12);
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