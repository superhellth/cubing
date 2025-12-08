import type { ISolve } from "@cubing/shared";
import { LTTB } from "downsample";
import { useMemo } from "react";

interface LTTBPoint {
    x: number;
    y: number;
    original: ISolve;
}

const useDownsampling = (solves: ISolve[], samplingThreshold: number, keepPbs: boolean) => {
    return useMemo(() => {
        let pbs: ISolve[] = [];
        if (keepPbs) {
            pbs = solves.filter((solve: ISolve) => solve.newPB);
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
                return [...new Set([...sampledSolves, ...pbs])];
            } else {
                return sampledSolves;
            }
        }
        return solves;
    }, [solves, samplingThreshold]);
}

export default useDownsampling;