import type { ISolve } from "@cubing/shared";
import { Box } from "@mui/system";
import { LineChart } from "@mui/x-charts";
import { memo, useMemo } from "react";
import Timer from "./timer";

const cleanVal = (val: number | undefined | null) => {
    if (val === undefined || val === null || val === -1) return null;
    return val; // Convert ms to seconds
};

const AvgGraphs = memo(({ solves, xByDate }: { solves: ISolve[], xByDate: boolean }) => {
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

    const series = [
        {
            id: "avg5",
            label: "Average of 5",
            dataKey: 'avg5',
            showMark: false,
            valueFormatter: (v: number | null) => v == null ? null : Timer.formatTime(v)
        },
        {
            id: 'avg12',
            label: 'Average of 12',
            dataKey: "avg12",
            showMark: false,
            valueFormatter: (v: number | null) => v == null ? null : Timer.formatTime(v)
        },
        {
            id: "avg100",
            label: "Average of 100",
            dataKey: 'avg100',
            showMark: false,
            valueFormatter: (v: number | null) => v == null ? null : Timer.formatTime(v)
        },
        {
            id: "avg1000",
            label: "Average of 1000",
            dataKey: 'avg1000',
            showMark: false,
            valueFormatter: (v: number | null) => v == null ? null : Timer.formatTime(v)
        },
    ];

    return (
        <Box>
            <LineChart
                // experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
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