import BarChartIcon from '@mui/icons-material/BarChart';
import { BarChart } from "@mui/x-charts";
import { useMemo } from "react";
import { useOutlierDetection } from "../../hooks/useOutlierDetection";
import { formatTime } from '../../utils/solveUtils';
import { GraphCard } from "../GraphCard";

const DistributionCard = ({ solves }: any) => {
    const { nonOutliers } = useOutlierDetection(solves);
    const timeBins = useMemo(() => {
        if (!nonOutliers || nonOutliers.length <= 1) return [];

        // 1. Find Raw min/max
        const rawHighest = Math.max(...nonOutliers.map((s) => s.duration));
        const rawLowest = Math.min(...nonOutliers.map((s) => s.duration));
        const rawRange = rawHighest - rawLowest;

        // 2. Define "Pretty" Bin Sizes (in milliseconds)
        // These are the steps that look clean on a graph axis.
        const PRETTY_SIZES = [
            100,   // 0.1s (Precision speedsolving)
            250,   // 0.25s
            500,   // 0.5s
            1000,  // 1s
            2000,  // 2s
            5000,  // 5s
            10000, // 10s
            30000, // 30s
            60000  // 1m
        ];
        const TARGET_BAR_COUNT = 30;
        const idealBinSize = rawRange / TARGET_BAR_COUNT;
        let binSize = PRETTY_SIZES.find(size => size >= idealBinSize) || PRETTY_SIZES[PRETTY_SIZES.length - 1];

        const start = Math.floor(rawLowest / binSize) * binSize;
        const end = Math.ceil(rawHighest / binSize) * binSize;
        const nBins = Math.max(1, Math.round((end - start) / binSize));

        const bins: number[][] = Array.from({ length: nBins }, () => []);

        for (let solve of nonOutliers) {
            let index = Math.floor((solve.duration - start) / binSize);

            if (index >= nBins) index = nBins - 1;
            if (index < 0) index = 0;

            bins[index].push(solve.duration);
        }

        return bins.map((bin: number[], index: number) => ({
            id: index,
            range: `${formatTime(start + index * binSize)} - ${formatTime(start + (index + 1) * binSize)}`,
            entries: bin.length
        }));
    }, [nonOutliers]);

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