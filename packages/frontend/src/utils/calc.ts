import { ISolve, Status } from "@cubing/shared"; 

// Helper to convert solve to milliseconds (handling +2)
const getSolveTime = (s: ISolve): number => {
    if (s.status === Status.PlusTwo) return s.duration + 2000;
    return s.duration;
};

export function calculateAverage(solves: ISolve[], size: number): number | null {
    if (solves.length < size) return null;

    // 1. Get the chunk of solves we are calculating
    // (Assuming we are passing just the slice needed, or handling slicing outside)
    const activeSolves = solves.slice(0, size);

    let dnfCount = 0;
    const times: number[] = [];

    // 2. Extract times and count DNFs
    for (const s of activeSolves) {
        if (s.status === Status.DNF) {
            dnfCount++;
        } else {
            times.push(getSolveTime(s));
        }
    }

    // 3. Logic for DNF limits
    // Usually: More than 1 DNF in an Ao5 is a DNF. 
    // For Ao100, you can have up to 5 DNFs (5% rule).
    const trimCount = Math.ceil(size * 0.05); // 5% trim (1 for Ao5/12, 5 for Ao100)
    
    if (dnfCount > trimCount) return -1; // DNF result

    // 4. Sort times to find best/worst
    times.sort((a, b) => a - b);

    // 5. Remove best and worst
    // If we have DNFs, they technically count as the "worst" solves and are already removed from 'times' array,
    // so we only need to remove extra times from the top/bottom to satisfy the trim.
    
    // Total to remove from each side: trimCount.
    // We already "removed" 'dnfCount' from the bad side.
    const removeBest = trimCount;
    const removeWorst = trimCount - dnfCount;

    // Slice the valid times
    // We trim 'removeBest' from start (fastest) and 'removeWorst' from end (slowest)
    const validTimes = times.slice(removeBest, times.length - removeWorst);

    // 6. Calculate Mean
    const sum = validTimes.reduce((a, b) => a + b, 0);
    return sum / validTimes.length;
}