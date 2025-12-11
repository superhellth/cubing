import type { Solve, StatlessSolve } from "@cubing/shared";
import { calculateAverageOptimized } from "./calc";

const MAX_WINDOW_SIZE = 1000;

let cacheInput: StatlessSolve[] = [];
let cacheOutput: Solve[] = [];

self.onmessage = (e: MessageEvent<StatlessSolve[]>) => {
    const solves = e.data;

    if (!solves || solves.length === 0) {
        cacheInput = [];
        cacheOutput = [];
        self.postMessage([]);
        return;
    }

    let dirtyIndex = 0;
    const len = Math.min(solves.length, cacheInput.length);

    while (dirtyIndex < len && solves[dirtyIndex] === cacheInput[dirtyIndex]) {
        dirtyIndex++;
    }

    const reuseUntilIndex = Math.max(0, dirtyIndex - MAX_WINDOW_SIZE);

    const newOutput: Solve[] = new Array(solves.length);

    let currentPb = Infinity;

    for (let i = 0; i < reuseUntilIndex; i++) {
        newOutput[i] = cacheOutput[i];
    }

    if (reuseUntilIndex > 0) {
        currentPb = cacheOutput[reuseUntilIndex - 1].pb ?? Infinity;
    }

    for (let i = reuseUntilIndex; i < solves.length; i++) {
        const s = solves[i];

        const timeToCheck = s.grossDuration; 
        let isNewPB = false;

        if (timeToCheck !== null && timeToCheck < currentPb) {
            currentPb = timeToCheck;
            isNewPB = true;
        }

        newOutput[i] = {
            ...s,
            // Averages
            avg5: calculateAverageOptimized(solves, i, 5),
            avg12: calculateAverageOptimized(solves, i, 12),
            avg100: calculateAverageOptimized(solves, i, 100),
            avg1000: calculateAverageOptimized(solves, i, 1000),
            
            // PB Stats
            pb: currentPb,
            newPB: isNewPB,
        };
    }

    cacheInput = solves;
    cacheOutput = newOutput;

    self.postMessage(newOutput);
};