import { Discipline, type ISolve } from "@cubing/shared";
import { Grid } from "@mui/system";
import { BarChart, LineChart, ScatterChart } from "@mui/x-charts";
import { useMemo, useState } from "react";
import RegressionLine from "../components/graphs/RegressionLine";
import { useSolveManager } from "../hooks/useSolveManager";

function StatisticsScreen() {
    const [selectedDiscipline] = useState<Discipline>(Discipline.ThreeByThree);
    const { solves } =
        useSolveManager(selectedDiscipline);
    const solvesOfDiscipline = useMemo(() => {
        return solves.filter((solve: ISolve) => solve.discipline === selectedDiscipline);
    }, [solves, selectedDiscipline]);
    const key: keyof ISolve = "duration";
    const timeByDate = useMemo(() => {
        return solvesOfDiscipline.map((solve: ISolve) => ({
            date: new Date(solve.date),
            time: solve.duration
        }))
    }, [solvesOfDiscipline]);
    const pbProgression = useMemo(() => {
        const pbs: ISolve[] = [];
        for (let solve of solves) {
            if (pbs.length == 0 || pbs[pbs.length - 1].duration > solve.duration) {
                pbs.push(solve);
            }
        }
        return pbs.map((solve: ISolve) => ({
            date: new Date(solve.date),
            id: solve.id,
            time: solve.duration
        }));
    }, [solves]);

    const nBins: number = 9;
    const timeBins = useMemo(() => {
        const relevantDataPoints: (number)[] = solves.filter((solve: ISolve) => solve[key]).map((solve: ISolve) => solve[key]);
        const highest: number = Math.max(...relevantDataPoints);
        const lowest: number = Math.min(...relevantDataPoints);
        const binSize: number = (highest - lowest) / nBins;
        const bins: number[][] = Array.from({ length: nBins }, () => []);

        for (let time of relevantDataPoints) {
            let index: number = Math.floor((time - lowest) / binSize)
            if (index >= nBins) index = nBins - 1;
            bins[index].push(time);
        }

        return bins.map((bin: number[], index: number) => ({
            id: index,
            range: `${(lowest + index * binSize).toFixed(2)} - ${(lowest + (index + 1) * binSize).toFixed(2)}`,
            entries: bin.length
        }));
    }, [nBins, solvesOfDiscipline, key]);

    return (
        <Grid container spacing={2} sx={{ height: "100%", bgcolor: "primary.main" }}>
            <Grid size={5}>
                <BarChart dataset={timeBins} series={[{
                    id: 'solves',
                    label: "Solves Count",
                    dataKey: "entries"
                }]} />
            </Grid>
            <Grid size={5}>
                {solvesOfDiscipline.length > 0 &&
                    <ScatterChart dataset={timeByDate} xAxis={[{ scaleType: "time", dataKey: "date", label: "All Solves" }]} series={[{
                        id: "scatter",
                        datasetKeys: { x: "date", y: "time" }
                    }]}>
                        <RegressionLine seriesId={"scatter"} />
                    </ScatterChart>
                }
            </Grid>
            <Grid size={5}>
                <LineChart dataset={pbProgression} series={[{dataKey: "time", label: "PB Progression"}]} />
            </Grid>
        </Grid>
    );
}

export default StatisticsScreen;