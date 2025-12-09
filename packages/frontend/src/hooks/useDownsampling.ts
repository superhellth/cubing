import type { Solve } from "@cubing/shared";
import { LTTB } from "downsample";
import { useMemo } from "react";
import { sortChronologically } from "../utils/solveUtils";

interface LTTBPoint {
    x: number;
    y: number;
    original: Solve;
}

const useDownsampling = (solves: Solve[], samplingThreshold: number, keepPbs: boolean) => {
    return useMemo(() => {
        let pbs: Solve[] = [];
        if (keepPbs) {
            pbs = solves.filter((solve: Solve) => solve.newPB);
        }

        if (solves.length > samplingThreshold) {
            const mappedData = solves.map((solve) => ({
                x: solve.date.getTime(),
                y: solve.duration,
                original: solve
            }));
            const sampledPoints = LTTB(mappedData, samplingThreshold) as LTTBPoint[];
            const sampledSolves = sampledPoints.map((point: any) => point.original);
            if (keepPbs) {
                return sortChronologically([...new Set([...sampledSolves, ...pbs])]);
            } else {
                return sampledSolves;
            }
        }
        return solves;
    }, [solves, samplingThreshold]);
}

export default useDownsampling;