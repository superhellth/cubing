import { Discipline, type ISolve } from "@cubing/shared";
import { Grid } from "@mui/system";
import { LTTB } from 'downsample';
import { useMemo, useState } from "react";
import { useOutlierDetection } from "../hooks/useOutlierDetection";
import { useSolveManager } from "../hooks/useSolveManager";
import ImprovementChart from "../components/graphs/ImprovementChart";
import LineWithUncertaintyArea from "../components/graphs/TestGraph";

const samplingThreshold: number = 50;
const key: keyof ISolve = "duration";

function StatisticsScreen() {
    const [selectedDiscipline] = useState<Discipline>(Discipline.OneHanded);
    const [selectedSession] = useState<string>("default");
    const { solves } =
        useSolveManager(selectedDiscipline);
    const relevantSolves = useMemo(() => {
        const candidates: ISolve[] = solves.filter((solve: ISolve) => solve.discipline === selectedDiscipline && solve.session == selectedSession);
        if (candidates.length > samplingThreshold) {
            const mappedData = solves.map((solve) => ({
                x: solve.date,
                y: solve.duration,
                original: solve
            }));
            return LTTB(mappedData, samplingThreshold).map((point: any) => point.original);
        }
        return candidates;
    }, [solves, selectedDiscipline]);
    const { nonOutliers, outliers, thresholds } = useOutlierDetection(relevantSolves);

    const timeByDate = useMemo(() => {
        return relevantSolves.map((solve: ISolve) => ({
            date: new Date(solve.date),
            id: solve.id,
            time: solve.duration
        }))
    }, [relevantSolves]);
    const pbProgression = useMemo(() => {
        const pbs: ISolve[] = [];
        for (let solve of solves.reverse()) {
            if (pbs.length == 0 || pbs[pbs.length - 1].duration > solve.duration) {
                pbs.push(solve);
            }
        }
        return pbs;
    }, [solves]);

    const nBins: number = 20;
    const timeBins = useMemo(() => {
        if (!nonOutliers || nonOutliers.length <= 1) return [];
        const highest: number = Math.max(...nonOutliers.map((solve: ISolve) => solve.duration));
        const lowest: number = Math.min(...nonOutliers.map((solve: ISolve) => solve.duration));
        const binSize: number = (highest - lowest) / nBins;
        const bins: number[][] = Array.from({ length: nBins }, () => []);

        for (let solve of nonOutliers) {
            let index: number = Math.floor((solve.duration - lowest) / binSize)
            if (index >= nBins) index = nBins - 1;
            bins[index].push(solve.duration);
        }

        return bins.map((bin: number[], index: number) => ({
            id: index,
            range: `${(lowest + index * binSize).toFixed(2)} - ${(lowest + (index + 1) * binSize).toFixed(2)}`,
            entries: bin.length
        }));
    }, [nBins, nonOutliers, key]);

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
            <Grid size={6}>
                <ImprovementChart solves={relevantSolves} pbProgression={pbProgression} />
            </Grid>
            <Grid size={6}>
                <LineWithUncertaintyArea />
            </Grid>
        </Grid>
    );
}

export default StatisticsScreen;