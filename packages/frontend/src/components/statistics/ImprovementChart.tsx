import { keyToLabels, type Solve } from "@cubing/shared";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import { ChartDataProvider, ChartsAxisHighlight, ChartsGrid, ChartsSurface, ChartsTooltipContainer, ChartsXAxis, ChartsYAxis, LineHighlightPlot, LinePlot, ScatterPlot } from "@mui/x-charts";
import { memo, useMemo, useState } from "react";
import useDownsampling from "../../hooks/solves/useDownsampling";
import { useSolvesForecast } from "../../hooks/solves/useSolveForecast";
import { formatTime } from "../../utils/solveUtils";
import { CustomAnimatedLine, ShadedBackground } from "../graphs/PredictionArea";
import ImprovementChartControl from "./ImprovementChartControl";
import { ImprovementChartLegend } from "./ImprovementChartLegend";
import { ImprovementChartTooltip } from "./ImprovementChartTooltip";

interface ImprovementChartProps {
    solvesChrono: Solve[];
    isLocked: boolean;
}

const ImprovementChart = memo(({
    solvesChrono, isLocked
}: ImprovementChartProps) => {
    if (!solvesChrono?.length) return null;
    const theme = useTheme();

    // Chart Controller
    const [display, setDisplay] = useState<(keyof Solve)[]>(["avg5", "avg12", "avg100", "avg1000", "pb"]);
    const [predictionHorizon, setPredictionHorizon] = useState<number>(20);
    const mediumSamplingLimit = Math.max(101, Math.floor(solvesChrono.length / 10));
    const [samplingLimit, setSamplingLimit] = useState<number>(mediumSamplingLimit);

    // Data cleaning
    const sampledSolves: Solve[] = useDownsampling(solvesChrono, samplingLimit, true);
    const lastIndex: number = useMemo(() => { return sampledSolves.length - 1 }, [sampledSolves]);
    console.log(lastIndex)

    // Prediction
    const { predictions } = useSolvesForecast(solvesChrono,
        display.filter((s) => s !== "pb"), predictionHorizon, "linear");

    // Chart Configuration
    const historyAndPredictions: Solve[] = useMemo(() => {
        const foundIndex = sampledSolves.findIndex(solve =>
            display.some(key => solve[key as keyof Solve] != null)
        );
        const firstNonNull = foundIndex === -1 ? 0 : foundIndex;
        return [...sampledSolves.slice(firstNonNull), ...predictions];
    }, [sampledSolves, predictions]);
    const xAxisData = useMemo(() => {
        return historyAndPredictions.map((_: Solve, i: number) => i);
    }, [historyAndPredictions]);
    const pbData: any = useMemo(() => {
        const dataPoints: any[] = [];
        for (let i = 0; i < sampledSolves.length; i++) {
            const solve: Solve = sampledSolves[i];
            if (solve.newPB) {
                dataPoints.push({ x: i, y: solve.duration });
            }
        }
        return dataPoints;
    }, [sampledSolves]);
    const seriesConfig: any = useMemo(() => {
        const lines = display.filter((value: string) => value !== "pb").map(key => ({
            type: "line",
            id: key,
            dataKey: key,
            label: keyToLabels[key as keyof typeof keyToLabels],
            color: theme.palette.graphColors[key],
            showMark: true,
            skipAnimation: true,
            valueFormatter: (v: number) => formatTime(v)
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
    }, [display, sampledSolves, theme, pbData]);

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
            bgcolor: theme.palette.primary.main,
            borderRadius: '16px',
            p: 2,
            boxShadow: 'none',
            border: '1px solid #27272a',
            position: "relative"
        }} >
            {isLocked &&
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        // Glass effect
                        bgcolor: "rgba(0, 0, 0, 0.4)",
                        zIndex: 1,
                    }}
                >
                    {/* Lock Icon */}
                    {/* <LockIcon sx={{ fontSize: 40, color: "grey.500", mb: 1 }} /> */}

                    {/* The "Enticement" CTA */}
                    <Typography variant="h4">
                        Keep cubing to unlock
                    </Typography>
                </Box>
            }
            <Box sx={{
                flex: 1, height: "100%", flexDirection: "column", display: "flex", p: 0, filter: isLocked ? "blur(6px)" : "none", userSelect: "none", opacity: isLocked ? 0.5 : 1
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h4" sx={{ color: '#fff', mb: 3, fontWeight: "bold" }} noWrap>Your Improvements</Typography>
                    <ImprovementChartControl numSolves={sampledSolves.length}
                        display={display} onDisplaySelectionChanged={(displaySelection: (keyof Solve)[]) => setDisplay(displaySelection)}
                        predict={predictionHorizon} onPredictionHorizonChanged={(newValue: number) => setPredictionHorizon(newValue)}
                        sampleThreshold={samplingLimit} onSampleThresholdChanged={(newValue: number) => { setSamplingLimit(newValue) }}
                        mediumSamplingLimit={mediumSamplingLimit} />
                </Box>

                {/* <Divider sx={{mb: 1,  }}/> */}

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
            </Box>
        </Paper>
    );
});

export default ImprovementChart;