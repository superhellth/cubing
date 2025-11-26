import { Discipline, type ISolve } from "@cubing/shared";
import { Grid } from "@mui/system";
import { LTTB } from 'downsample';
import { useMemo, useState } from "react";
import ImprovementChart from "../components/graphs/ImprovementChart";
import { useSolveManager } from "../hooks/useSolveManager";

const samplingThreshold: number = 1000;
const key: keyof ISolve = "duration";

function StatisticsScreen() {
    const [selectedDiscipline] = useState<Discipline>(Discipline.OneHanded);
    const [selectedSession] = useState<string>("default");
    const { solves } =
        useSolveManager(selectedDiscipline, selectedSession);

    const pbs = useMemo(() => {
        const pbs: ISolve[] = [];
        for (let solve of [...solves].reverse()) {
            if (pbs.length == 0 || pbs[pbs.length - 1].duration > solve.duration) {
                pbs.push(solve);
            }
        }
        return pbs;
    }, [solves]);

    const downsampledSolves = useMemo(() => {
        if (solves.length > samplingThreshold) {
            const mappedData = solves.map((solve) => ({
                x: solve.date,
                y: solve.duration,
                original: solve
            }));
            const downsampled = LTTB(mappedData, samplingThreshold).map((point: any) => point.original);
            return [...new Set([...downsampled, ...pbs])].sort((a: any, b: any) => {return b.date - a.date});
        }
        return solves;
    }, [solves]);
    // const { nonOutliers, outliers, thresholds } = useOutlierDetection(downsampledSolves);

    // const timeByDate = useMemo(() => {
    //     return downsampledSolves.map((solve: ISolve) => ({
    //         date: new Date(solve.date),
    //         id: solve.id,
    //         time: solve.duration
    //     }))
    // }, [downsampledSolves]);

    // const nBins: number = 20;
    // const timeBins = useMemo(() => {
    //     if (!nonOutliers || nonOutliers.length <= 1) return [];
    //     const highest: number = Math.max(...nonOutliers.map((solve: ISolve) => solve.duration));
    //     const lowest: number = Math.min(...nonOutliers.map((solve: ISolve) => solve.duration));
    //     const binSize: number = (highest - lowest) / nBins;
    //     const bins: number[][] = Array.from({ length: nBins }, () => []);

    //     for (let solve of nonOutliers) {
    //         let index: number = Math.floor((solve.duration - lowest) / binSize)
    //         if (index >= nBins) index = nBins - 1;
    //         bins[index].push(solve.duration);
    //     }

    //     return bins.map((bin: number[], index: number) => ({
    //         id: index,
    //         range: `${(lowest + index * binSize).toFixed(2)} - ${(lowest + (index + 1) * binSize).toFixed(2)}`,
    //         entries: bin.length
    //     }));
    // }, [nBins, nonOutliers, key]);

    return (
        <Grid container spacing={2} sx={{ height: "100%", bgcolor: "primary.main" }}>
            {/* <Grid size={5}>
                <BarChart dataset={timeBins} series={[{
                    id: 'solves',
                    label: "Solves Count",
                    dataKey: "entries"
                }]} />
            </Grid>
            <Grid size={5}>
                {relevantSolves.length > 0 &&
                    <ScatterChart dataset={timeByDate} xAxis={[{ scaleType: "linear", dataKey: "id", label: "All Solves" }]} series={[{
                        id: "scatter",
                        datasetKeys: { x: "id", y: "time" }
                    }]}>
                        <RegressionLine seriesId={"scatter"} />
                    </ScatterChart>
                }
            </Grid> */}
            <Grid size={12}>
                <ImprovementChart solves={downsampledSolves} pbProgression={pbs} />
            </Grid>
            {/* <Grid size={6}>
                <LineWithUncertaintyArea />
            </Grid> */}
        </Grid>
    );
}

export default StatisticsScreen;