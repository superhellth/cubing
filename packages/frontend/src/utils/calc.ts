// utils/averages.ts

import { type StatlessSolve, Status } from "@cubing/shared";

// Reusable buffer (Max window 1000)
const buffer = new Float64Array(1000);

export function calculateAverageOptimized(
    allSolves: StatlessSolve[],
    currentIndex: number, // <--- Renamed from startIndex for clarity
    size: number
): number | null | undefined {

    // 1. Bounds check (Backwards)
    // We need 'size' items ending at 'currentIndex'.
    // So if currentIndex is 4 (5th solve) and size is 5, 4 - 5 + 1 = 0. We are good.
    if (currentIndex - size + 1 < 0) return undefined;

    let dnfCount = 0;
    let validCount = 0;

    // 2. Extract times (Backwards Loop or Index Math)
    for (let i = 0; i < size; i++) {
        // LOOKING BACKWARDS: Grab current, then previous, etc.
        const solve = allSolves[currentIndex - i];

        if (solve.status === Status.DNF) {
            dnfCount++;
        } else {
            // Note: Order in the buffer doesn't matter because we Sum or Sort later.
            buffer[validCount++] = solve.status === Status.PlusTwo ? solve.duration + 2000 : solve.duration;
        }
    }

    // --- The rest of your math logic remains exactly the same ---

    // 3. DNF Logic
    const trimCount = Math.ceil(size * 0.05);
    if (dnfCount > trimCount) return null;

    // 4. Ao5 Optimization
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

        if (dnfCount === 0) {
            return (sum - min - max) / 3;
        } else {
            return (sum - min) / 3;
        }
    }

    // 5. General Case
    const activeBuffer = buffer.subarray(0, validCount);
    activeBuffer.sort();

    const removeBest = trimCount;
    const removeWorst = trimCount - dnfCount;

    let sum = 0;
    const loopEnd = validCount - removeWorst;
    for (let i = removeBest; i < loopEnd; i++) {
        sum += activeBuffer[i];
    }

    return sum / (size - 2 * trimCount);
}