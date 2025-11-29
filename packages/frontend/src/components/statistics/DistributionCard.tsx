import type { ISolve } from "@cubing/shared";
import { Box, Card, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useMemo } from "react";
import { useOutlierDetection } from "../../hooks/useOutlierDetection";
import BarChartIcon from '@mui/icons-material/BarChart';
import { GraphCard } from "../GraphCard";

const DistributionCard = ({ solves }: any) => {
    const { nonOutliers } = useOutlierDetection(solves);
    const nBins: number = 9;
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
    }, [nBins, nonOutliers]);

    return (
        <GraphCard title={"Distribution of Solve Times"} icon={<BarChartIcon />}>
            <BarChart dataset={timeBins} hideLegend={true} series={[{
                id: 'solves',
                label: "Solves Count",
                dataKey: "entries"
            }]} />
        </GraphCard>
    )
}

export default DistributionCard;