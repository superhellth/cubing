import type { ISolve } from "@cubing/shared";
import { ChartContainer, ChartsGrid, ChartsTooltip, ChartsXAxis, ChartsYAxis, LinePlot, MarkPlot, ScatterPlot } from "@mui/x-charts";
import { memo, useMemo } from "react";
import { HoltsLinear } from "../../utils/holtsLinear";
import { LinkPoints } from "./LinkPoints";
import { CustomAnimatedLine, ForecastArea, ShadedBackground } from "./PredictionArea";
import theme from "../../styles/theme";
import { Card, Paper } from "@mui/material";
import { Grid } from "@mui/system";
import Timer from "../../utils/timer";

const ImprovementChart = memo(({ solves, pbProgression, display = ["avg100", "avg1000"], predict = "avg100", showConfidence = true }:
    { solves: ISolve[], pbProgression: ISolve[], display: (keyof ISolve)[], predict: keyof ISolve, showConfidence: boolean }) => {
    if (!solves || solves.length < 1) return;
    const lastIndex = solves.length - 1;

    const forecaster = useMemo(() => {
        const chronologicalSolves: ISolve[] = [...solves].reverse();
        const averages: number[] = chronologicalSolves.map((solve: ISolve) => solve[predict]).filter((n): n is number => n !== undefined && n !== null);
        const { alpha, beta } = HoltsLinear.optimize(averages);
        const forecaster = new HoltsLinear({ alpha, beta });
        averages.forEach((val: number) => forecaster.update(val));
        return forecaster;
    }, [solves])

    const { predictedSolves, confidences } = useMemo(() => {
        const predicted = [];
        const confidences = [];
        for (let i = 0; i < 12; i++) {
            const { forecast, lower, upper } = forecaster.predictInterval(i + 1, 0.95);
            predicted.push({
                id: lastIndex + i + 1, avg5: predict == "avg5" ? forecast : null, avg12: predict == "avg12" ? forecast : null,
                avg100: predict == "avg100" ? forecast : null, avg1000: predict == "avg1000" ? forecast : null, pb: null, index: i
            });
            confidences.push({ y0: lower, y1: upper });
        }
        return { predictedSolves: predicted, confidences }
    }, [forecaster]);

    const { extendedSolves, limitIndex } = useMemo(() => {
        const pbIds = new Set(pbProgression.map(s => s.id));
        const reversedHistory = [...solves].reverse().map((solve, index) => ({
            ...solve,
            // If this solve ID is in our PB list, add the value, otherwise null
            pb: pbIds.has(solve.id) ? solve.duration : null,
            index: index
        }));
        return {
            // 3. Merge history with predictions (predictions don't have PBs)
            extendedSolves: [...reversedHistory, ...predictedSolves],
            limitIndex: lastIndex
        };
    }, [solves, predictedSolves, pbProgression]);


    const pbs: any = useMemo(() => {
        return pbProgression.map((solve: ISolve) => {
            return { x: solves.length - 1 - solves.indexOf(solve), y: solve.duration }
        });
    }, [solves]);

    const displaySeries: any = display.map((key: keyof ISolve) => {
        return {
            type: "line",
            dataKey: key,
            label: key,
            valueFormatter: (v: number) => Timer.formatTime(v)
        }
    })

    return (

        <ChartContainer
            dataset={extendedSolves as any}
            series={[
                ...displaySeries,
                {
                    type: "scatter",
                    id: "pb-scatter",
                    label: "Personal Best",
                    datasetKeys: { x: 'index', y: 'pb' },
                    color: theme.palette.info.main,
                    dataKey: "pb",
                    markerSize: 5,
                    valueFormatter: (v) => (v != null && v.y != null) ? Timer.formatTime(v.y) : null
                }
            ]}
            voronoiMaxRadius={50}
            sx={{ '& .line-after path': { strokeDasharray: '10 5' } }}
            xAxis={[{
                scaleType: 'linear', data: extendedSolves.map((_, index) => index), min: 0,
                max: extendedSolves.length - 1,
            }]}
        >
            <ShadedBackground limit={limitIndex} />
            <LinkPoints seriesId="pb-scatter" />
            <ChartsGrid horizontal />

            <LinePlot
                slots={{ line: CustomAnimatedLine }}
                slotProps={{ line: { limit: limitIndex } as any }}
            />
            <ScatterPlot />
            {showConfidence &&
                <ForecastArea limit={limitIndex} forecast={confidences} />
            }
            {/* <MarkPlot /> */}
            <ChartsTooltip trigger="axis" />
            <ChartsXAxis />
            <ChartsYAxis />

        </ChartContainer>
    );
});

export default ImprovementChart;