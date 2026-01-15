import type { Solve } from "@cubing/shared";
import TimelineIcon from '@mui/icons-material/Timeline';
import { Box, Typography } from "@mui/material";
import { areaElementClasses, chartsAxisHighlightClasses, lineElementClasses, SparkLineChart } from "@mui/x-charts";
import { memo, useMemo, useState } from "react";
import useDownsampling from "../../hooks/solves/useDownsampling";
import theme from "../../styles/theme";
import { GraphCard } from "../GraphCard";
import { LockedOverlay } from "./LockedOverlay";

const windowSize: number = 50;
const longFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

const VariabilityCard = memo(({ solvesChrono, numTrueSolves }: any) => {
    const [dataIndex, setDataIndex] = useState<null | number>(null);
    const sampledSolves = useDownsampling(solvesChrono, 500, false);

    const rollingStd: number[] = useMemo(() => {
        if (windowSize > sampledSolves.length) return [];
        const stds: number[] = [];
        for (let i = windowSize; i < sampledSolves.length; i++) {
            const solvesInWindow = sampledSolves.slice(i - windowSize, i);
            const meanDuration: number = solvesInWindow.reduce((accumulator: number, solve: Solve) => accumulator + solve.duration, 0) / windowSize;
            const sse = solvesInWindow.reduce((accumulator: number, solve: Solve) => accumulator + (solve.duration - meanDuration) ** 2, 0);
            const variance = sse / (windowSize - 1);
            const stdDev = Math.sqrt(variance);
            const consistencyScore = stdDev === 0 ? 100 : (meanDuration / stdDev);
            stds.push(consistencyScore);
        }
        return stds;
    }, [sampledSolves]);

    return (
        <GraphCard
            hint={"This value represents how consistent you are. In the future you will be able to compare your stats to other people's. For now: Zero is bad, 3-5 good, 5-10 excellent, 10+ superhuman"}
            title={dataIndex === null ? 'Consistency' : longFormatter.format(sampledSolves[windowSize + dataIndex].date)} icon={<TimelineIcon />}>

            <LockedOverlay numSolves={numTrueSolves} solvesToUnlock={80} fontSize={20} hint="Cube some more to check your consistency!">
                <Box sx={{ display: "flex", maxHeight: "300px", flexDirection: "column", height: "100%" }}>

                    <Typography sx={{ fontSize: '2rem', fontWeight: "bold", padding: ".4rem", paddingRight: "10px", paddingBottom: 0, whiteSpace: "nowrap" }}>
                        {rollingStd[dataIndex ?? rollingStd.length - 1]?.toFixed(2)}
                    </Typography>

                    <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                        <defs>
                            <linearGradient id={"fade"} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.palette.info.main} stopOpacity={0.5} />
                                <stop offset="95%" stopColor={theme.palette.info.main} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                    </svg>

                    <SparkLineChart data={rollingStd} showHighlight axisHighlight={{ x: "line" }} color={theme.palette.info.main} area
                        baseline="min"
                        // skipAnimation={true}
                        // yAxis={{
                        //     domainLimit: (minValue: number, maxValue: number) => ({
                        //         min: minValue,
                        //         max: maxValue,
                        //     }),
                        // }}
                        margin={{ top: 5, bottom: 0, left: 5, right: 5 }}
                        onHighlightedAxisChange={(axisItems) => {
                            setDataIndex(axisItems[0]?.dataIndex ?? null);
                        }}
                        clipAreaOffset={{ top: 2, bottom: 2 }}
                        sx={{
                            [`& .${areaElementClasses.root}`]: {
                                fill: `url(#${"fade"})`,
                                opacity: 0.2
                            },
                            [`& .${lineElementClasses.root}`]: {
                                stroke: theme.palette.info.main,
                                strokeWidth: 3
                            },
                            [`& .${chartsAxisHighlightClasses.root}`]: {
                                stroke: theme.palette.info.main,
                                strokeDasharray: 'none',
                                strokeWidth: 2,
                            },
                        }} />
                </Box>
            </LockedOverlay>
        </GraphCard>
    );
});

export default VariabilityCard;