import type { Solve, StatlessSolve } from "@cubing/shared";
import { calculateAverageOptimized } from "./calc";

const MAX_WINDOW_SIZE = 1000;

let cacheInput: StatlessSolve[] = [];
let cacheOutput: Solve[] = [];

self.onmessage = (e: MessageEvent<StatlessSolve[]>) => {
    // ⚠️ IMPORTANT: Ensure 'solves' is passed in CHRONOLOGICAL order (Oldest -> Newest)
    // If this array is reversed (Newest first), the PB logic will be backwards!
    const solves = e.data;

    if (!solves || solves.length === 0) {
        cacheInput = [];
        cacheOutput = [];
        self.postMessage([]);
        return;
    }

    // 1. Find Dirty Index
    let dirtyIndex = 0;
    const len = Math.min(solves.length, cacheInput.length);

    while (dirtyIndex < len && solves[dirtyIndex] === cacheInput[dirtyIndex]) {
        dirtyIndex++;
    }

    // 2. Determine Reuse Range
    // We go back 1000 steps to ensure averages (avg1000) are correct.
    // For PB logic, this is also safe because PB only depends on the past.
    const reuseUntilIndex = Math.max(0, dirtyIndex - MAX_WINDOW_SIZE);

    const newOutput: Solve[] = new Array(solves.length);

    // 3. Initialize "Running State" for PB
    let currentPb = Infinity;

    // A. Fast Copy (Reuse cached calculations)
    for (let i = 0; i < reuseUntilIndex; i++) {
        newOutput[i] = cacheOutput[i];
    }

    // B. Restore PB State
    // If we skipped the first 500 items, we need to know what the PB was at item 499.
    if (reuseUntilIndex > 0) {
        currentPb = cacheOutput[reuseUntilIndex - 1].pb ?? Infinity;
    }

    // C. Recalculate Loop
    for (let i = reuseUntilIndex; i < solves.length; i++) {
        const s = solves[i];

        // LOGIC: Calculate PB
        // We use grossDuration (handles +2). Ignore DNFs (null).
        const timeToCheck = s.grossDuration; 
        let isNewPB = false;

        // Only update PB if time is valid (not DNF) and better than current
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

    // 4. Update Cache
    cacheInput = solves;
    cacheOutput = newOutput;

    self.postMessage(newOutput);
};