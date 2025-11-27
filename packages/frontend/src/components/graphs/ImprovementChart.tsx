import type { ISolve } from "@cubing/shared";
import { ChartDataProvider, ChartsAxisHighlight, ChartsGrid, ChartsSurface, ChartsTooltipContainer, ChartsXAxis, ChartsYAxis, LineHighlightPlot, LinePlot, ScatterPlot } from "@mui/x-charts";
import { memo, useMemo } from "react";
import theme from "../../styles/theme";
import { HoltsLinear } from "../../utils/holtsLinear";
import Timer from "../../utils/timer";
import { CustomItemTooltip } from "./CustomTooltip";
import { CustomAnimatedLine, ForecastArea, ShadedBackground } from "./PredictionArea";

const ImprovementChart = memo(({ solvesChronological, pbProgression, display = ["avg100", "avg1000"], predict = "avg100", showConfidence = true }:
    { solvesChronological: ISolve[], pbProgression: ISolve[], display: (keyof ISolve)[], predict: keyof ISolve, showConfidence: boolean }) => {
    if (!solvesChronological || solvesChronological.length < 1) return;
    const lastIndex = solvesChronological.length - 1;

    const forecaster = useMemo(() => {
        const averages: number[] = solvesChronological.map((solve: ISolve) => solve[predict]).filter((n): n is number => n !== undefined && n !== null);
        const { alpha, beta } = HoltsLinear.optimize(averages);
        const forecaster = new HoltsLinear({ alpha, beta });
        averages.forEach((val: number) => forecaster.update(val));
        return forecaster;
    }, [solvesChronological])

    const { predictedSolves, confidences } = useMemo(() => {
        const predicted = [];
        const confidences: any = [{ y0: solvesChronological[lastIndex][predict], y1: solvesChronological[lastIndex][predict] }];
        for (let i = 0; i < 12; i++) {
            const { forecast, lower, upper } = forecaster.predictInterval(i + 1, 0.95);
            predicted.push({
                id: lastIndex + i + 1, avg5: predict == "avg5" ? forecast : null, avg12: predict == "avg12" ? forecast : null,
                avg100: predict == "avg100" ? forecast : null, avg1000: predict == "avg1000" ? forecast : null, newPB: false, pb: null, index: lastIndex + i + 1
            });
            confidences.push({ y0: lower, y1: upper });
        }
        return { predictedSolves: predicted, confidences }
    }, [forecaster]);

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
                dataKey: key,
                label: key,
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
            label: "Personal Best",
            color: theme.palette.info.main,
            dataKey: "pb",
            disableHighlight: true,
        });
        return series;
    }, [])

    return (
        <ChartDataProvider dataset={extendedSolves as any}
            series={displaySeries}
            xAxis={[{
                scaleType: 'linear', data: xAxisData, min: 0,
                max: extendedSolves.length - 1,
            }]}>
            <ChartsSurface sx={{
                '& .line-after path': { strokeDasharray: '10 5' }, '& .MuiLineElement-series-pb-line': {
                    strokeDasharray: '10 5', // "10px dash, 5px gap"
                    strokeWidth: 2,          // Optional: adjust thickness
                },
            }}>
                <ShadedBackground limit={lastIndex} />
                {/* <LinkPoints seriesId="pb-scatter" /> */}
                <ChartsGrid horizontal />

                <LinePlot
                    slots={{ line: CustomAnimatedLine }}
                    slotProps={{ line: { limit: lastIndex } as any }}
                />
                {/* <MarkPlot /> */}
                <ScatterPlot />
                {showConfidence &&
                    <ForecastArea limit={lastIndex} forecast={confidences} />
                }

                {/* <ChartsTooltip trigger="axis" /> */}
                <ChartsAxisHighlight x="line" />
                <LineHighlightPlot />
                <ChartsXAxis />
                <ChartsYAxis />
            </ChartsSurface>
            <ChartsTooltipContainer trigger="axis">
                <CustomItemTooltip displayedSolves={extendedSolves} display={display} predictionStart={lastIndex + 1} />
            </ChartsTooltipContainer>
        </ChartDataProvider>
    );
});

export default ImprovementChart;