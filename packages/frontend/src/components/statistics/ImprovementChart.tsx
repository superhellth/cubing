import { keyToLabels, type ISolve } from "@cubing/shared";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { ChartDataProvider, ChartsAxisHighlight, ChartsGrid, ChartsSurface, ChartsTooltipContainer, ChartsXAxis, ChartsYAxis, LineHighlightPlot, LinePlot, ScatterPlot } from "@mui/x-charts";
import { memo, useMemo, useState } from "react";
import useDownsampling from "../../hooks/useDownsampling";
import usePBStats from "../../hooks/usePBStats";
import { useSolvesForecast } from "../../hooks/useSolveForecast";
import { sortChronologically } from "../../utils/solveUtils";
import Timer from "../../utils/timer";
import { CustomAnimatedLine, ShadedBackground } from "../graphs/PredictionArea";
import ImprovementChartControl from "./ImprovementChartControl";
import { ImprovementChartLegend } from "./ImprovementChartLegend";
import { ImprovementChartTooltip } from "./ImprovementChartTooltip";

interface ImprovementChartProps {
    solves: ISolve[];
}

const ImprovementChart = memo(({
    solves
}: ImprovementChartProps) => {
    if (!solves?.length) return null;
    const theme = useTheme();

    // Chart Controller
    const [display, setDisplay] = useState<string[]>(["avg100", "avg1000", "pb"]);
    const [predictionHorizon, setPredictionHorizon] = useState<number>(20);
    const [samplingLimit, setSamplingLimit] = useState<number>(100);

    // Data cleaning
    const solvesWithPbs: ISolve[] = usePBStats(solves);
    const sampledSolves: ISolve[] = useDownsampling(solvesWithPbs, samplingLimit, true);
    const solvesChronological: ISolve[] = useMemo(() => { return sortChronologically(sampledSolves) }, [sampledSolves]);
    const lastIndex: number = sampledSolves.length - 1;

    // Prediction
    const { predictions, confidences } = useSolvesForecast(sortChronologically(solves),
        display.filter((s: string) => s !== "pb"), predictionHorizon, "linear");

    // Chart Configuration (Memoized)
    const historyAndPredictions: ISolve[] = useMemo(() => {
        const foundIndex = solvesChronological.findIndex(solve =>
            display.some(key => solve[key as keyof ISolve] != null)
        );
        const firstNonNull = foundIndex === -1 ? 0 : foundIndex;
        return [...solvesChronological.slice(firstNonNull), ...predictions];
    }, [sampledSolves, predictions]);
    const xAxisData = useMemo(() => {
        return historyAndPredictions.map((_: ISolve, i: number) => i);
    }, [historyAndPredictions]);
    const pbData: any = useMemo(() => {
        const dataPoints: any[] = [];
        for (let i = 0; i < solvesChronological.length; i++) {
            const solve: ISolve = solvesChronological[i];
            if (solve.newPB) {
                dataPoints.push({ x: i, y: solve.duration });
            }
        }
        // console.log()
        return dataPoints;
    }, [solvesChronological]);
    const seriesConfig: any = useMemo(() => {
        const lines = display.filter((value: string) => value !== "pb").map(key => ({
            type: "line",
            id: key,
            dataKey: key,
            label: keyToLabels[key as keyof typeof keyToLabels],
            color: theme.palette.graphColors[key],
            showMark: true,
            skipAnimation: true,
            valueFormatter: (v: number) => Timer.formatTime(v)
        }));

        const pbScatter = {
            type: "scatter",
            id: "pb-scatter",
            label: "Personal Best",
            data: pbData,
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
    }, [display, solves, theme, pbData]);

    const chartSurfaceSx = {
        '& .line-after path': { strokeDasharray: '10 5' },
        '& .MuiLineElement-series-pb-line': { strokeDasharray: '10 5' },
    };

    return (
        <Paper sx={{
            height: "100%",
            width: '100%',
            overflow: 'hidden',
            display: "flex",
            flexDirection: "column",
            bgcolor: theme.palette.secondary.main,
            borderRadius: '16px',
            p: 2,
            boxShadow: 'none',
            border: '1px solid #2C2C2C',
        }} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <Typography variant="h4" sx={{ color: '#fff', mb: 3, fontWeight: 600 }} noWrap>Your Improvements</Typography>
                <ImprovementChartControl numSolves={solves.length}
                    display={display} onDisplaySelectionChanged={(displaySelection: string[]) => setDisplay(displaySelection)}
                    predict={predictionHorizon} onPredictionHorizonChanged={(newValue: number) => setPredictionHorizon(newValue)}
                    sampleThreshold={samplingLimit} onSampleThresholdChanged={(newValue: number) => setSamplingLimit(newValue)} />
            </Box>

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