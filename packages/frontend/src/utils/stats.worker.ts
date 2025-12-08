import type { ISolve } from "@cubing/shared"; // Adjust import
 // Adjust import
import { calculateAverageOptimized } from "./calc";

const MAX_WINDOW_SIZE = 1000;

// Worker-level cache. 
// This persists as long as the worker is alive.
let cacheInput: ISolve[] = [];
let cacheOutput: ISolve[] = [];

self.onmessage = (e: MessageEvent<ISolve[]>) => {
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

    // Compare object references
    while (dirtyIndex < len && solves[dirtyIndex] === cacheInput[dirtyIndex]) {
        dirtyIndex++;
    }

    // 2. Determine Reuse Range
    // If index 500 changed, it affects averages starting from (500 - 1000)
    const reuseUntilIndex = Math.max(0, dirtyIndex - MAX_WINDOW_SIZE);

    // 3. Construct New Array
    const newOutput: ISolve[] = new Array(solves.length);

    // A. Fast Copy (Reuse cached calculations)
    for (let i = 0; i < reuseUntilIndex; i++) {
        newOutput[i] = cacheOutput[i];
    }

    // B. Recalculate (Only the changed window)
    for (let i = reuseUntilIndex; i < solves.length; i++) {
        // Note: calculateAverageOptimized handles the bounds checking internally
        // so we just pass the full array and current index
        newOutput[i] = {
            ...solves[i],
            avg5: calculateAverageOptimized(solves, i, 5),
            avg12: calculateAverageOptimized(solves, i, 12),
            avg100: calculateAverageOptimized(solves, i, 100),
            avg1000: calculateAverageOptimized(solves, i, 1000),
        };
    }

    // 4. Update Cache
    cacheInput = solves;
    cacheOutput = newOutput;

    // 5. Send back to React
    self.postMessage(newOutput);
};