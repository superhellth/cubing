import { ISolve } from '@cubing/shared';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Divider, FormControl, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { Box, Grid } from "@mui/system";
import { LTTB } from 'downsample';
import { useMemo, useState } from 'react';
import useImprovementStats from '../../hooks/useImprovementStats';
import { GraphCard } from "../GraphCard";
import TrendCard from './TrendCard';

const displayed = ["duration", "pb", "avg5", "avg12", "avg100", "avg1000"];

function calculateDerivative(data: number[], window: number = 1): (number | null)[] {
    const results: (number | null)[] = [];
    let sumX = 0;
    let sumXSq = 0;
    for (let i = 0; i < window; i++) {
        sumX += i;
        sumXSq += i * i;
    }
    const denominator = (window * sumXSq) - (sumX * sumX);

    for (let i = 0; i < data.length; i++) {
        if (i < window - 1) {
            results.push(null);
            continue;
        }
        const windowY = data.slice(i - window + 1, i + 1);

        let sumY = 0;
        let sumXY = 0;
        for (let j = 0; j < window; j++) {
            const y = windowY[j];
            sumY += y;
            sumXY += j * y;
        }
        const slope = ((window * sumXY) - (sumX * sumY)) / denominator;

        results.push(slope);
    }

    return results;
}

const DevelopmentCard = ({ solves }: any) => {
    if (solves.length <= 0) return null;
    const recentSolve = solves[solves.length - 1];
    const theme = useTheme();
    const [timeFrame, setTimeFrame] = useState("recent");
    const trends = useImprovementStats(solves);
    const impRate = useMemo(() => {
        return timeFrame == "all" ? -trends.all.duration.slope : -trends.recent.duration.slope
    }, [solves, timeFrame])
    const impRateSeries = useMemo(() => {
        const rawSeries = calculateDerivative(solves.map((solve: ISolve) => solve.duration), 500).filter(Boolean);
        if (rawSeries.length > 200) {
            const mappedData = rawSeries.map((v: any, index: number) => ({
                x: index,
                y: -v
            }));
            const sampledPoints: any = LTTB(mappedData, 100);
            const sampledValues = sampledPoints.map((point: any) => point.y);
            return sampledValues;
        }
        return rawSeries;
    }, [solves]);
    const xLabels = impRateSeries.map((_: any, i: any) => i + 1);

    return (
        <GraphCard title={"Improvement speed"} icon={<AutoAwesomeIcon />}>
            <Typography variant="h4" sx={{ color: impRate < 0 ? theme.palette.error.main : '#fff', m: 1, fontWeight: 700 }}>{impRate}
                <Box
                    component="span"
                    sx={{
                        fontSize: '0.4em',
                        // verticalAlign: 'top',
                        ml: 0.5,
                        color: theme.palette.text.secondary,
                        fontWeight: 'medium'
                    }}
                >
                    ms/solve
                </Box>
            </Typography>
            <Divider />
            <FormControl sx={{ p: 2 }}>
                <ToggleButtonGroup
                    value={timeFrame}
                    exclusive
                    onChange={(_event: any, v: any) => { if (v !== null) { setTimeFrame(v); } }}
                    sx={{
                        // justifyContent: 'center',
                        borderRadius: 2,
                        maxHeight: "25px",
                        bgcolor: "#090909",
                        border: "1px solid #333333"
                    }}
                >
                    <ToggleButton value={"recent"}>
                        Recent
                    </ToggleButton>
                    <ToggleButton value={"all"} >
                        All
                    </ToggleButton>

                </ToggleButtonGroup>
            </FormControl>
            <Grid container spacing={1.5}>
                {displayed.map((key: string, index: number) => {
                    const trend: any = timeFrame == "all" ? trends.all[key as keyof typeof trends.all] : trends.recent[key as keyof typeof trends.all];
                    const left: boolean = index % 2 == 0;
                    return (
                        <Grid size={{ xs: 12, md: 6, sm: 6 }}>
                            <TrendCard trend={trend} headerKey={key} current={recentSolve[key]} />
                        </Grid>
                    );
                })}
            </Grid>
            {/* <LineChart
                // 1. The Data
                series={[
                    {
                        data: impRateSeries,
                        label: 'Improvement Rate',
                        color: theme.palette.info.main,
                        showMark: false,
                        curve: "catmullRom",
                        area: true,
                    },
                ]}
                yAxis={[{ position: 'none' }]}
                xAxis={[{ data: xLabels, scaleType: 'point', hideTooltip: true }]}
                hideLegend={true}

                sx={{
                    maxHeight: "30%",
                    [`.${axisClasses.root}`]: {
                        [`.${axisClasses.line}, .${axisClasses.tick}`]: { stroke: 'transparent' },
                    },
                }}
                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            >

                <ChartsReferenceLine
                    y={0}
                    lineStyle={{
                        stroke: theme.palette.text.secondary,
                        strokeWidth: 2,
                        opacity: 0.5
                    }}
                />
            </LineChart> */}
        </GraphCard>
    );
}

export default DevelopmentCard;