import { Discipline, type ISolve } from "@cubing/shared";
import { Box } from "@mui/system";
import { BarChart } from "@mui/x-charts";
import { useMemo, useState } from "react";
import { useSolveManager } from "../hooks/useSolveManager";

function StatisticsScreen() {
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(Discipline.ThreeByThree);
    const { solves } =
        useSolveManager(selectedDiscipline);
    const solvesOfDiscipline = useMemo(() => {
        return solves.filter((solve) => solve.discipline === selectedDiscipline);
    }, [solves, selectedDiscipline]);
    const key: keyof ISolve = "duration";

    const nBins: number = 9;
    const chartData = useMemo(() => {
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
        <Box sx={{ height: "100%", bgcolor: "primary.main" }}>
            <BarChart dataset={chartData} series={[{
                id: 'solves',
                label: "Solves Count",
                dataKey: "entries"
            }]} />
        </Box>
    );
}

export default StatisticsScreen;