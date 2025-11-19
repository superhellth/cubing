import type { ISolve, Status } from "@cubing/shared";

export function getDisplayableAvg5(solve: ISolve) {
    if (!solve.avg5) return "-";
    return (solve.avg5 / 1000).toFixed(2);
}

export function getDisplayableAvg12(solve: ISolve) {
    if (!solve.avg12) return "-";
    return (solve.avg12 / 1000).toFixed(2);
}

export function setStatus(solve: ISolve, newStatus: Status) {
    return {
        ...solve,
        status: newStatus
    }
}