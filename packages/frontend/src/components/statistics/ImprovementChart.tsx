import { keyToLabels, type ISolve } from "@cubing/shared";
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, useTheme } from "@mui/material";
import { ChartDataProvider, ChartsAxisHighlight, ChartsGrid, ChartsSurface, ChartsTooltipContainer, ChartsXAxis, ChartsYAxis, LineHighlightPlot, LinePlot, ScatterPlot } from "@mui/x-charts";
import { memo, useMemo, useState } from "react";
import Timer from "../../utils/timer";
import { CustomAnimatedLine, ForecastArea, ShadedBackground } from "../graphs/PredictionArea";
import { useSolvesForecast } from "../../hooks/useSolveForecast";
import { ImprovementChartLegend } from "./ImprovementChartLegend";
import { ImprovementChartTooltip } from "./ImprovementChartTooltip";
import ImprovementChartControl from "./ImprovementChartControl";

interface ImprovementChartProps {
    solvesChronological: ISolve[];
    pbProgression: ISolve[];
    predict?: (keyof ISolve)[];
    showConfidence?: boolean;
}

const ImprovementChart = memo(({
    solvesChronological,
    pbProgression,
    predict = ["avg100"],
    showConfidence = true
}: ImprovementChartProps) => {
    if (!solvesChronological?.length) return null;

    const theme = useTheme();
    const [display, setDisplay] = useState<string[]>(["avg100", "avg1000", "pb"]);
    const [predictionHorizon, setPredictionHorizon] = useState<number>(20);

    // Guard Clause

    // 1. Logic Hook
    const { historyAndPredictions, xAxisData, confidences, lastIndex } = useSolvesForecast(solvesChronological,
        display.filter((s: string) => s !== "pb"), predictionHorizon);

    // 2. Chart Configuration (Memoized)
    const seriesConfig: any = useMemo(() => {
        const lines = display.filter((value: string) => value !== "pb").map(key => ({
            type: "line",
            id: key,
            dataKey: key,
            label: keyToLabels[key as keyof typeof keyToLabels],
            color: theme.palette.graphColors[key],
            showMark: true,
            valueFormatter: (v: number) => Timer.formatTime(v)
        }));

        const pbScatter = {
            type: "scatter",
            id: "pb-scatter",
            label: "Personal Best",
            data: pbProgression.map(s => ({ x: solvesChronological.indexOf(s), y: s.duration })),
            color: theme.palette.info.main,
            markerSize: 5,
            valueFormatter: () => null
        };

        const pbLine = {
            type: "line",
            id: "pb-line",
            label: "PB",
            color: theme.palette.info.main,
            dataKey: "pb",
            disableHighlight: true,
        };
        if (display.includes("pb")) return [...lines, pbScatter, pbLine]

        return lines;
    }, [display, pbProgression, solvesChronological, theme]);

    const chartSurfaceSx = {
        '& .line-after path': { strokeDasharray: '10 5' },
        '& .MuiLineElement-series-pb-line': { strokeDasharray: '10 5' },
    };

    return (
        <Paper sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}>

            <ImprovementChartControl display={display} onDisplaySelectionChanged={(displaySelection: string[]) => setDisplay(displaySelection)}
                predict={predictionHorizon} onPredictionHorizonChanged={(newValue: number) => setPredictionHorizon(newValue)} />
            <ImprovementChartLegend series={seriesConfig} />

            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                <ChartDataProvider
                    dataset={historyAndPredictions as any}
                    series={seriesConfig}
                    xAxis={[{
                        scaleType: 'linear',
                        data: xAxisData,
                        min: 0,
                        max: historyAndPredictions.length - 1,
                    }]}
                    yAxis={[{
                        valueFormatter: (v: number) => (v / 1000).toFixed(0)
                    }]}
                >
                    <ChartsSurface sx={chartSurfaceSx}>
                        <ShadedBackground limit={lastIndex} />
                        <ChartsGrid horizontal />

                        <LinePlot
                            slots={{ line: CustomAnimatedLine }}
                            slotProps={{ line: { limit: lastIndex } as any }}
                        />
                        <ScatterPlot />

                        {/* {showConfidence && (
                            <ForecastArea limit={lastIndex} forecast={confidences[0]} />
                        )} */}

                        <ChartsAxisHighlight x="line" />
                        <LineHighlightPlot />
                        <ChartsXAxis />
                        <ChartsYAxis />
                    </ChartsSurface>

                    <ChartsTooltipContainer trigger="axis">
                        <ImprovementChartTooltip
                            displayedSolves={historyAndPredictions}
                            display={display}
                            predictionStart={lastIndex + 1}
                        />
                    </ChartsTooltipContainer>
                </ChartDataProvider>
            </Box>
        </Paper>
    );
});

export default ImprovementChart;