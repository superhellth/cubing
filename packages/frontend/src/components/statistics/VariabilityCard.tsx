import type { ISolve } from "@cubing/shared";
import TimelineIcon from '@mui/icons-material/Timeline';
import { Box, Paper, Stack, Typography } from "@mui/material";
import { areaElementClasses, chartsAxisHighlightClasses, lineElementClasses, SparkLineChart } from "@mui/x-charts";
import { memo, useMemo, useState } from "react";
import theme from "../../styles/theme";
import { GraphCard } from "../GraphCard";

const windowSize: number = 50;
const longFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

const VariabilityCard = memo(({ solvesChronological }: any) => {
    const [dataIndex, setDataIndex] = useState<null | number>(null);

    const rollingStd: number[] = useMemo(() => {
        if (windowSize > solvesChronological.length) return [];
        const stds: number[] = [];
        for (let i = windowSize; i < solvesChronological.length; i++) {
            const solvesInWindow = solvesChronological.slice(i - windowSize, i);
            const meanDuration: number = solvesInWindow.reduce((accumulator: number, solve: ISolve) => accumulator + solve.duration, 0)
            const sse = solvesInWindow.reduce((accumulator: number, solve: ISolve) => accumulator + (solve.duration - meanDuration) ** 2, 0);
            stds.push(Math.sqrt((1 / (windowSize - 1)) * sse) / 1000000);
        }
        return stds;
    }, [solvesChronological]);

    return (
        <GraphCard
            title={dataIndex === null ? 'Variability over Time' : longFormatter.format(solvesChronological[windowSize + dataIndex].date)} icon={<TimelineIcon />}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    padding: "10px",
                    flexGrow: 1,
                    height: '100%',
                    minHeight: 0
                }}
            >
                <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                    <defs>
                        <linearGradient id={"fade"} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.palette.info.main} stopOpacity={0.5} />
                            <stop offset="95%" stopColor={theme.palette.info.main} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                </svg>
                <Typography sx={{ fontSize: '2rem', fontWeight: "bold", padding: ".4rem", paddingRight: "10px", paddingBottom: 0, whiteSpace: "nowrap" }}>
                    {rollingStd[dataIndex ?? rollingStd.length - 1]?.toFixed(2) + "s"}
                </Typography>

                <SparkLineChart data={rollingStd} showHighlight axisHighlight={{ x: "line" }} color={theme.palette.info.main} area
                    baseline="min"
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
            </Stack>
        </GraphCard>
    );
});

export default VariabilityCard;