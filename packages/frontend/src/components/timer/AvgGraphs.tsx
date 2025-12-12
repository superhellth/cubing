import { keyToLabels, type Solve } from "@cubing/shared";
import { Box, useTheme } from "@mui/system";
import { LineChart } from "@mui/x-charts";
import { memo, useMemo } from "react";
import { formatTime } from "../../utils/solveUtils";

const cleanVal = (val: number | undefined | null) => {
    if (val === undefined || val === null || val === -1) return null;
    return val;
};

const AvgGraphs = memo(({ solves, settings }: { solves: Solve[], settings: any }) => {
    const theme = useTheme();
    const xByDate: boolean = useMemo(() => { return settings.avgGraphXAxis == "date" }, [settings]);
    const display: any[] = useMemo(() => { return settings.avgGraphDisplay }, [settings]);
    const displayHorizon: number = useMemo(() => { return settings.avgGraphNumSolves }, [settings]);

    const chartData = useMemo(() => {
        const chronologicalSolves = solves.slice(-Math.min(displayHorizon, solves.length));
        const foundIndex = chronologicalSolves.findIndex(solve =>
            display.some(key => solve[key as keyof Solve] != null)
        );
        const firstNonNull = foundIndex === -1 ? 0 : foundIndex;

        return chronologicalSolves.slice(firstNonNull).map((solve, i) => ({
            index: i + 1,
            id: solve.id,
            date: new Date(solve.date),
            avg5: cleanVal(solve.avg5),
            avg12: cleanVal(solve.avg12),
            avg100: cleanVal(solve.avg100),
            avg1000: cleanVal(solve.avg1000),
        }));
    }, [solves, displayHorizon, display]);

    const series = useMemo(() => {
        if (display == null) return [];
        return display.map((key: any) => ({
            id: key,
            label: keyToLabels[key as keyof typeof keyToLabels],
            dataKey: key,
            color: theme.palette.graphColors[key],
            showMark: false,
            valueFormatter: (v: number | null) => v == null ? null : formatTime(v)
        }));
    }, [display]);

    return (
        <Box>
            <LineChart
                dataset={chartData}
                xAxis={[{
                    label: xByDate ? "Date" : "Solve",
                    dataKey: xByDate ? "date" : "id",
                    scaleType: xByDate ? 'time' : 'linear',
                    valueFormatter: xByDate
                        ? (date: Date) => date.toLocaleDateString()
                        : (v: number) => v.toString()
                }]}
                yAxis={[{ label: 'Time (s)', valueFormatter: (v: number) => (v / 1000).toFixed(0), domainLimit: "strict" }]}
                slotProps={{
                    legend: {
                        position: {
                            vertical: 'bottom'
                        },
                    },
                }}
                hideLegend={true}
                series={series}
                height={200}
            />
        </Box>
    );
});

export default AvgGraphs;