import { SOLVE_STATS_KEYS, type Solve, type SolveStats } from "@cubing/shared";
import { Box, Typography } from "@mui/material";
import { ChartDataProvider, ChartsAxisHighlight, ChartsGrid, ChartsSurface, ChartsTooltipContainer, ChartsXAxis, ChartsYAxis, LineChart, LineHighlightPlot, LinePlot, ScatterPlot } from "@mui/x-charts";
import { memo, useEffect, useMemo, useState } from "react";
import useDownsampling from "../../hooks/solves/useDownsampling";
import { useLinearRegression } from "../../hooks/solves/useLinearRegression";
import { useImprovementChartConfig } from "../../hooks/useImprovementChartConfig";
import { CustomAnimatedLine, ShadedBackground } from "../graphs/PredictionArea";
import { HeaderRow, ImprovementChartCard } from "./ImprovementChart.styles";
import ImprovementChartControl from "./ImprovementChartControl";
import { ImprovementChartLegend } from "./ImprovementChartLegend";
import { ImprovementChartTooltip } from "./ImprovementChartTooltip";
import CalculationLoader from "./Loading";
import { LockedOverlay } from "./LockedOverlay";

interface ImprovementChartProps {
    solvesChrono: Solve[];
    isResizing: boolean;
    numTrueSolves: number;
}

const ImprovementChart = memo(({
    solvesChrono, isResizing
}: ImprovementChartProps) => {
    // if (!solvesChrono?.length) return null;

    // Chart Controller
    const [display, setDisplay] = useState<(keyof SolveStats)[]>(SOLVE_STATS_KEYS);
    const [predictionHorizon, setPredictionHorizon] = useState<number>(10);
    const mediumSamplingLimit = Math.max(101, Math.floor(solvesChrono.length / 10));
    const [samplingLimit, setSamplingLimit] = useState<number>(mediumSamplingLimit);
    useEffect(() => {
        setSamplingLimit(mediumSamplingLimit)
    }, [solvesChrono])

    // Data cleaning
    const sampledSolves: Solve[] = useDownsampling(solvesChrono, samplingLimit, true);
    const lastIndex: number = useMemo(() => { return sampledSolves.length - 1 }, [sampledSolves]);

    // Prediction
    const predictions: any = useLinearRegression(solvesChrono, display.filter(v => v != "pb"), predictionHorizon);

    // Chart Configuration
    const { historyAndPredictions, xAxisData, seriesConfig } = useImprovementChartConfig(sampledSolves, predictions, display);
    const chartSurfaceSx = {
        '& .line-after path': { strokeDasharray: '10 5' },
        '& .MuiLineElement-series-pb-line': { strokeDasharray: '10 5' },
    };

    return (
        <ImprovementChartCard>

            <HeaderRow>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: "bold" }} noWrap>
                    Your Improvements
                </Typography>

                <ImprovementChartControl
                    numSolves={solvesChrono.length}
                    display={display}
                    onDisplaySelectionChanged={setDisplay}
                    predict={predictionHorizon}
                    onPredictionHorizonChanged={setPredictionHorizon}
                    sampleThreshold={samplingLimit}
                    onSampleThresholdChanged={setSamplingLimit}
                    mediumSamplingLimit={mediumSamplingLimit}
                />
            </HeaderRow>

            <Box sx={{ flex: 1, minHeight: 0}}>
                <LockedOverlay numSolves={solvesChrono.length} solvesToUnlock={30} fontSize={30} hint="Continue training to look at your improvements!">
                    {!(isResizing && solvesChrono.length > 12) ? (
                        <>
                            <ImprovementChartLegend series={seriesConfig} />
                            {solvesChrono.length == 0 ? (
                                <LineChart series={[]} sx={{height: "100%", width: "100%"}} />
                            ) : (

                                <ChartDataProvider
                                    dataset={historyAndPredictions as any}
                                    series={seriesConfig}
                                    skipAnimation={true}
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
                            )}
                        </>
                    ) : (
                        <CalculationLoader size="normal" />
                    )}
                </LockedOverlay>
            </Box>

        </ImprovementChartCard >
    );
});

export default ImprovementChart;