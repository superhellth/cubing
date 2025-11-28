import { keyToLabels, type ISolve } from "@cubing/shared";
import { ChartDataProvider, ChartsAxisHighlight, ChartsGrid, ChartsLegend, ChartsSurface, ChartsTooltipContainer, ChartsXAxis, ChartsYAxis, LineHighlightPlot, LinePlot, ScatterPlot } from "@mui/x-charts";
import { memo, useMemo } from "react";
import { HoltsLinear } from "../../utils/holtsLinear";
import Timer from "../../utils/timer";
import { CustomItemTooltip } from "./CustomTooltip";
import { CustomAnimatedLine, ForecastArea, ShadedBackground } from "./PredictionArea";
import { Box, Stack, useTheme } from "@mui/system";
import { Paper, Typography } from "@mui/material";

const predictionHorizon: number = 12;

const ImprovementChart = memo(({ solvesChronological, pbProgression, display = ["avg100", "avg1000"], predict = ["avg100"], showConfidence = true }:
    { solvesChronological: ISolve[], pbProgression: ISolve[], display: (keyof ISolve)[], predict: (keyof ISolve)[], showConfidence: boolean }) => {
    if (!solvesChronological || solvesChronological.length < 1) return;
    const theme = useTheme();
    const lastIndex = solvesChronological.length - 1;

    const forecasters = useMemo(() => {
        const forecasters: any[] = [];
        for (let predValue of predict) {
            const averages: number[] = solvesChronological.map((solve: ISolve) => solve[predValue]).filter((n): n is number => n !== undefined && n !== null);
            const { alpha, beta } = HoltsLinear.optimize(averages);
            const forecaster = new HoltsLinear({ alpha, beta });
            averages.forEach((val: number) => forecaster.update(val));
            forecasters.push(forecaster);
        }
        return forecasters;
    }, [solvesChronological])

    const { predictedSolves, confidences } = useMemo(() => {
        const predicted = [];
        const allConfidences: any[][] = [];
        for (let predValueIndex = 0; predValueIndex < predict.length; predValueIndex++) {
            const predictKey: keyof ISolve = predict[predValueIndex];
            const confidences: any = [{ y0: solvesChronological[lastIndex][predictKey], y1: solvesChronological[lastIndex][predictKey] }];
            for (let i = 0; i < predictionHorizon; i++) {
                if (predValueIndex == 0) {
                    predicted.push({
                        id: lastIndex + i + 1, avg5: null, avg12: null,
                        avg100: null, avg1000: null, newPB: false, pb: null, index: lastIndex + i + 1
                    });
                }

                const forecaster = forecasters[predValueIndex];
                const { forecast, lower, upper } = forecaster.predictInterval(i + 1, 0.95);
                predicted[i][predictKey] = forecast;
                confidences.push({ y0: lower, y1: upper });
            }
            allConfidences.push(confidences);
        }
        return { predictedSolves: predicted, confidences: allConfidences }
    }, [forecasters]);

    const { extendedSolves, xAxisData } = useMemo(() => {
        let currentPb: number = -1;
        let runningIndex: number = 0;
        const solvesWithPb: any[] = [];
        let newPB: boolean = false;
        for (let solve of solvesChronological) {
            if (currentPb == -1 || solve.duration < currentPb) {
                currentPb = solve.duration;
                newPB = true;
            } else {
                newPB = false;
            }
            solvesWithPb.push({
                ...solve,
                index: runningIndex++,
                pb: currentPb,
                newPB: newPB
            })
        }

        const finalSolves = [...solvesWithPb, ...predictedSolves];
        return {
            extendedSolves: [...solvesWithPb, ...predictedSolves],
            xAxisData: finalSolves.map((_, i) => i)
        };
    }, [solvesChronological, predictedSolves]);


    const pbs: any = useMemo(() => {
        return pbProgression.map((solve: ISolve) => {
            return { x: solvesChronological.indexOf(solve), y: solve.duration }
        });
    }, [solvesChronological]);

    const displaySeries: any = useMemo(() => {
        const series: any[] = display.map((key: keyof ISolve) => {
            return {
                type: "line",
                id: key,
                dataKey: key,
                label: keyToLabels[key],
                color: theme.palette.graphColors[key],
                showMark: true,
                valueFormatter: (v: number) => Timer.formatTime(v)
            }
        });
        series.push({
            type: "scatter",
            id: "pb-scatter",
            label: "Personal Best",
            data: pbs,
            color: theme.palette.info.main,
            markerSize: 5,
            valueFormatter: (_: any) => null
        });
        series.push({
            type: "line",
            id: "pb-line",
            label: "PB",
            color: theme.palette.info.main,
            dataKey: "pb",
            disableHighlight: true,
        });
        return series;
    }, [])

    return (
        <Paper sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box>
                <Stack direction="row" spacing={2} justifyContent="center">
                    {displaySeries.filter((series: any) => series.id != "pb-scatter").map((series: any) => (
                        <Stack key={series.id} direction="row" alignItems="center" spacing={1}>
                            <Box sx={{
                                width: 20,
                                height: 3,
                                ...(series.id == "pb-line" ? {
                                    background: `repeating-linear-gradient(
                        90deg, 
                        ${series.color}, 
                        ${series.color} 5px, 
                        transparent 5px, 
                        transparent 9px
                    )`,
                                } : {
                                    backgroundColor: series.color
                                })
                            }} />

                            <Typography>
                                {series.label}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>

            </Box>
            <Box sx={{ flex: 1 }}>
                <ChartDataProvider dataset={extendedSolves as any}
                    series={displaySeries}
                    xAxis={[{
                        scaleType: 'linear', data: xAxisData, min: 0,
                        max: extendedSolves.length - 1,
                    }]}>
                    <ChartsSurface sx={{
                        '& .line-after path': { strokeDasharray: '10 5' }, '& .MuiLineElement-series-pb-line': {
                            strokeDasharray: '10 5',
                        },
                    }}>
                        <ShadedBackground limit={lastIndex} />
                        <ChartsGrid horizontal />

                        <LinePlot
                            slots={{ line: CustomAnimatedLine }}
                            slotProps={{ line: { limit: lastIndex } as any }}
                        />
                        <ScatterPlot />
                        {/* {showConfidence &&
                            <ForecastArea limit={lastIndex} forecast={confidences[0]} />
                        } */}

                        <ChartsAxisHighlight x="line" />
                        <LineHighlightPlot />
                        <ChartsXAxis />
                        <ChartsYAxis />
                        <ChartsLegend direction="horizontal" />
                    </ChartsSurface>
                    <ChartsTooltipContainer trigger="axis">
                        <CustomItemTooltip displayedSolves={extendedSolves} display={display} predictionStart={lastIndex + 1} />
                    </ChartsTooltipContainer>
                </ChartDataProvider>
            </Box>
        </Paper>
    );
});

export default ImprovementChart;