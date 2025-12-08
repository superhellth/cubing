// utils/averages.ts

import { type ISolve, Status } from "@cubing/shared";

// Reusable buffer to prevent memory allocation in the hot loop
// We assume max window is 1000.
const buffer = new Float64Array(1000);

export function calculateAverageOptimized(
    allSolves: ISolve[],
    startIndex: number,
    size: number
): number | null {
    // 1. Bounds check
    if (startIndex + size > allSolves.length) return null;

    let dnfCount = 0;
    let validCount = 0;

    // 2. Extract times into our pre-allocated buffer
    // This avoids creating `const times = []` and `.slice()`
    for (let i = 0; i < size; i++) {
        const solve = allSolves[startIndex + i];
        if (solve.status === Status.DNF) {
            dnfCount++;
        } else {
            buffer[validCount++] = solve.status === Status.PlusTwo ? solve.duration + 2000 : solve.duration; // Assuming duration is in milliseconds or seconds
        }
    }

    // 3. DNF Logic (5% rule)
    const trimCount = Math.ceil(size * 0.05);
    if (dnfCount > trimCount) return -1; // -1 represents DNF result

    // 4. SPECIAL CASE: Ao5 (Optimization)
    // For Ao5, we don't need to sort (O(N log N)). We just need sum, min, and max (O(N)).
    if (size === 5) {
        let min = Infinity;
        let max = -Infinity;
        let sum = 0;

        for (let i = 0; i < validCount; i++) {
            const val = buffer[i];
            if (val < min) min = val;
            if (val > max) max = val;
            sum += val;
        }

        // Remove 1 best, and (trimCount - dnfCount) worst
        // In Ao5, trimCount is 1.
        // If 0 DNFs: remove min and max.
        // If 1 DNF: remove min (best). The DNF counts as the max (worst).

        if (dnfCount === 0) {
            return (sum - min - max) / 3;
        } else {
            // DNF is the "worst", so we only remove the "best" (min) from the valid times
            return (sum - min) / 3;
        }
    }

    // 5. General Case (Ao12, Ao100, Ao1000)
    // We only sort the valid numbers we collected (subarray of buffer)
    const activeBuffer = buffer.subarray(0, validCount);
    activeBuffer.sort(); // Float64Array sorts numerically by default, unlike Array.sort()

    // 6. Calculate Mean
    const removeBest = trimCount;
    const removeWorst = trimCount - dnfCount;

    let sum = 0;
    // Sum only the central part
    const loopEnd = validCount - removeWorst;
    for (let i = removeBest; i < loopEnd; i++) {
        sum += activeBuffer[i];
    }

    return sum / (size - 2 * trimCount);
}