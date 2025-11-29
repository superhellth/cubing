import { keyToLabels, type ISolve } from "@cubing/shared";
import { Box, useTheme } from "@mui/system";
import { LineChart } from "@mui/x-charts";
import { memo, useMemo } from "react";
import Timer from "../../utils/timer";

const cleanVal = (val: number | undefined | null) => {
    if (val === undefined || val === null || val === -1) return null;
    return val;
};

const AvgGraphs = memo(({ solves, xByDate, display = ["avg12", "avg100", "avg1000"] }: { solves: ISolve[], xByDate: boolean, display: any }) => {
    const theme = useTheme();

    const chartData = useMemo(() => {
        const chronologicalSolves = [...solves].reverse();

        return chronologicalSolves.map((solve, i) => ({
            index: i + 1,
            id: solve.id,
            date: new Date(solve.date),
            avg5: cleanVal(solve.avg5),
            avg12: cleanVal(solve.avg12),
            avg100: cleanVal(solve.avg100),
            avg1000: cleanVal(solve.avg1000),
        }));
    }, [solves]);

    const series = display.map((key: any) => ({
        id: key,
        label: keyToLabels[key as keyof typeof keyToLabels],
        dataKey: key,
        color: theme.palette.graphColors[key],
        showMark: false,
        valueFormatter: (v: number | null) => v == null ? null : Timer.formatTime(v)
    }));

    return (
        <Box>
            <LineChart
                dataset={chartData}
                xAxis={[{
                    label: xByDate ? "Date" : "ID",
                    dataKey: xByDate ? "date" : "id",
                    scaleType: xByDate ? 'time' : 'linear',
                    valueFormatter: xByDate
                        ? (date: Date) => date.toLocaleDateString()
                        : (v: number) => v.toString()
                }]}
                slotProps={{
                    legend: {
                        position: {
                            vertical: 'bottom'
                        },
                    },
                }}
                grid={{ horizontal: true }}
                yAxis={[{ label: 'Seconds' }]}
                hideLegend={true}
                series={series}
                height={200}
            />
        </Box>
    );
});

export default AvgGraphs;