import type { ISolve } from "@cubing/shared";
import { Box, useTheme } from "@mui/system";
import { LineChart } from "@mui/x-charts";
import { memo, useMemo } from "react";

const AvgGraphs = memo(({ solves }: { solves: ISolve[] }) => {
    const useCleanAverages = (averages: (number | null | undefined)[]) => {
        return useMemo(() => {

            return [...averages.filter(value => value !== null && value !== undefined)].reverse().map(value => value / 1000);
        }, [averages]);
    }

    const avg5s: number[] = useCleanAverages(solves.map(solve => solve.avg5));
    const avg12s: number[] = useCleanAverages(solves.map(solve => solve.avg12));
    const diff = avg5s.length - avg12s.length;
    const avg12sPadded = [...Array(diff).fill(null), ...avg12s];
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
                ]}
                height={200}
            />
        </Box>
    );
});

export default AvgGraphs;