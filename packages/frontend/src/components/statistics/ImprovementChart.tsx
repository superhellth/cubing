import { SOLVE_STATS_KEYS, type Solve, type SolveStats } from "@cubing/shared";
import { Box, Typography } from "@mui/material";
import { ChartDataProvider, ChartsAxisHighlight, ChartsGrid, ChartsSurface, ChartsTooltipContainer, ChartsXAxis, ChartsYAxis, LineHighlightPlot, LinePlot, ScatterPlot } from "@mui/x-charts";
import { memo, useEffect, useMemo, useState } from "react";
import useDownsampling from "../../hooks/solves/useDownsampling";
import { useLinearRegression } from "../../hooks/solves/useLinearRegression";
import { useImprovementChartConfig } from "../../hooks/useImprovementChartConfig";
import { CustomAnimatedLine, ShadedBackground } from "../graphs/PredictionArea";
import { BlurrableContent, HeaderRow, ImprovementChartCard, LockedOverlay } from "./ImprovementChart.styles";
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

    // Chart Controller
    const [display, setDisplay] = useState<(keyof SolveStats)[]>(SOLVE_STATS_KEYS);
    const [predictionHorizon, setPredictionHorizon] = useState<number>(20);
    const mediumSamplingLimit = Math.max(101, Math.floor(solvesChrono.length / 10));
    const [samplingLimit, setSamplingLimit] = useState<number>(mediumSamplingLimit);
    useEffect(() => {
        setSamplingLimit(mediumSamplingLimit)
    }, [solvesChrono])

    // Data cleaning
    const sampledSolves: Solve[] = useDownsampling(solvesChrono, samplingLimit, true);
    const lastIndex: number = useMemo(() => { return sampledSolves.length - 1 }, [sampledSolves]);

    // Prediction
    const predictions = useLinearRegression(solvesChrono, display.filter(v => v != "pb"), predictionHorizon);

    // Chart Configuration
    const { historyAndPredictions, xAxisData, seriesConfig } = useImprovementChartConfig(sampledSolves, predictions, display);
     const chartSurfaceSx = {
        '& .line-after path': { strokeDasharray: '10 5' },
        '& .MuiLineElement-series-pb-line': { strokeDasharray: '10 5' },
    };

    return (
        <ImprovementChartCard>
            {isLocked && (
                <LockedOverlay>
                    <Typography variant="h4">
                        Keep cubing to unlock
                    </Typography>
                </LockedOverlay>
            )}

            <BlurrableContent isLocked={isLocked}>
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
            </BlurrableContent>
        </ImprovementChartCard>
    );
});

export default ImprovementChart;