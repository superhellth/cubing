import type { ISolve } from "@cubing/shared";
import { Box, useTheme } from "@mui/system";
import { LineChart } from "@mui/x-charts";
import { memo, useMemo } from "react";

const AvgGraphs = memo(({ solves }: { solves: ISolve[] }) => {
    const useCleanAverages = (averages: (number | null | undefined)[]) => {
        return useMemo(() => {
            return [...averages.filter(value => value !== null && value !== undefined && value !== -1)].reverse().map(value => value / 1000);
        }, [averages]);
    }

    const avg5s: number[] = useCleanAverages(solves.map(solve => solve.avg5));
    const avg12s: number[] = useCleanAverages(solves.map(solve => solve.avg12));
    const avg100s: number[] = useCleanAverages(solves.map(solve => solve.avg100));
    const avg1000s: number[] = useCleanAverages(solves.map(solve => solve.avg1000));
    const diffTo12 = avg5s.length - avg12s.length;
    const diffTo100 = avg5s.length - avg100s.length;
    const diffTo1000 = avg5s.length - avg1000s.length;
    const avg12sPadded = [...Array(diffTo12).fill(null), ...avg12s];
    const avg100sPadded = [...Array(diffTo100).fill(null), ...avg100s];
    const avg1000sPadded = [...Array(diffTo1000).fill(null), ...avg1000s];
    const theme = useTheme();
    return (
        <Box>
            <LineChart
                xAxis={[{ data: [...avg5s.keys()] }]}
                slotProps={{
                    legend: {
                        position: {
                            vertical: 'bottom'
                        },
                    },
                }}
                hideLegend={true}
                series={[
                    {
                        data: avg5s,
                        color: theme.palette.info.light,
                        label: "Average of 5"
                    },
                    {
                        data: avg12sPadded,
                        color: theme.palette.info.dark,
                        label: "Average of 12"
                    },
                    {
                        data: avg100sPadded,
                        color: theme.palette.primary.main,
                        label: "Average of 100"
                    },
                    {
                        data: avg1000sPadded,
                        color: theme.palette.secondary.main,
                        label: "Average of 1000"
                    },
                ]}
                height={200}
            />
        </Box>
    );
});

export default AvgGraphs;