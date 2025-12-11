import { keyToLabels, type Solve, type SolveStats } from '@cubing/shared';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { useAxesTooltip } from '@mui/x-charts';
import { useMemo } from 'react';
import theme from '../../styles/theme';
import { getDisplayableTime } from '../../utils/solveUtils';
import { ColorBar, DataLabel, TooltipContainer } from './ImprovementChartTooltip.styles';

const longFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

export function ImprovementChartTooltip({ displayedSolves, display, predictionStart }: { displayedSolves: any, display: (keyof SolveStats)[], predictionStart: number }) {
    const tooltipData = useAxesTooltip();
    if (!tooltipData) {
        return null;
    }
    const solveIndex: number = useMemo(() => {
        return tooltipData[0].dataIndex;
    }, [tooltipData])
    const solve: Solve = useMemo(() => {
        return displayedSolves[solveIndex];
    }, [tooltipData]);

    return (
        <TooltipContainer
            elevation={0}
        >
            <Stack>
                {solveIndex < predictionStart ?
                    <Typography sx={{ p: 1 }}>{longFormatter.format(solve.date)}</Typography>
                    : <Typography sx={{ p: 1 }}>{"Prediction " + (solveIndex - predictionStart + 1) + " solves into the future"}</Typography>
                }

                {display.filter(v => v != "pb").map((key: keyof Solve) => (
                    solve[key] != null ? (
                        <Stack direction="row" spacing={2} alignItems="center" key={key}>
                            <ColorBar bg={theme.palette.graphColors[key]} />
                            <DataLabel>
                                <span style={{ color: theme.palette.text.secondary, paddingRight: 2 }}>
                                    {keyToLabels[key as keyof typeof keyToLabels]}
                                </span>
                                <span style={{ fontWeight: "bold", paddingLeft: 2 }}>
                                    {getDisplayableTime(solve, key)}
                                </span>
                            </DataLabel>
                        </Stack>
                    ) : null
                ))}
                {display.includes("pb") && solveIndex < predictionStart &&
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{
                            width: 20,
                            height: 3,
                            background: `repeating-linear-gradient(
                                    90deg, 
                                    ${theme.palette.graphColors["pb"]}, 
                                    ${theme.palette.graphColors["pb"]} 5px, 
                                    transparent 5px, 
                                    transparent 9px
                                    )`

                        }} />
                        <DataLabel>
                            <span style={{ color: theme.palette.text.secondary, paddingRight: 2 }}>
                                {solve.newPB ? "(New)" : ""} PB
                            </span>
                            <span style={{ fontWeight: "bold", paddingLeft: 2 }}>
                                {getDisplayableTime(solve, "pb")}
                            </span>
                        </DataLabel>

                    </Stack>
                }

            </Stack>
        </TooltipContainer >
    );
}