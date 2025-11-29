import type { ISolve } from "@cubing/shared";
import { Box, Card, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { useMemo } from "react";
import { useOutlierDetection } from "../../hooks/useOutlierDetection";
import BarChartIcon from '@mui/icons-material/BarChart';
import { GraphCard } from "../GraphCard";
import Timer from "../../utils/timer";

const DistributionCard = ({ solves }: any) => {
    const { nonOutliers } = useOutlierDetection(solves);
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
            range: `${Timer.formatTime(lowest + index * binSize)} - ${Timer.formatTime(lowest + (index + 1) * binSize)}`,
            entries: bin.length
        }));
    }, [nBins, nonOutliers]);

    return (
        <GraphCard title={"Distribution of Solve Times"} icon={<BarChartIcon />}>
            <BarChart dataset={timeBins} hideLegend={true}
                grid={{ horizontal: true }}
                xAxis={[{
                    scaleType: 'band',
                    dataKey: 'range',
                    tickLabelStyle: {
                        angle: 45,
                        textAnchor: 'start',
                        fontSize: 12
                    }
                }]}
                series={[{
                    id: 'solves',
                    label: "#Solves",
                    dataKey: "entries"
                }]} />
        </GraphCard>
    );
}

export default DistributionCard;