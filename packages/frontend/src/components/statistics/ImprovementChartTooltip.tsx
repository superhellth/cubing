import { keyToLabels, type ISolve } from '@cubing/shared';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box, Grid } from '@mui/system';
import { useAxesTooltip } from '@mui/x-charts';
import { useMemo } from 'react';
import theme from '../../styles/theme';
import Timer from '../../utils/timer';

const longFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

export function ImprovementChartTooltip({ displayedSolves, display, predictionStart }: any) {
    const tooltipData = useAxesTooltip();
    if (!tooltipData) {
        return null;
    }
    const solveIndex: number = useMemo(() => {
        return tooltipData[0].dataIndex;
    }, [tooltipData])
    const solve: ISolve = useMemo(() => {
        return displayedSolves[solveIndex];
    }, [tooltipData]);

    return (
        <Paper
            elevation={0}
            sx={{
                bgcolor: "rgba(30, 30, 30, 0.90)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "8px",
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
                padding: "12px",
            }}
        >
            <Stack direction="row" alignItems="center">
                <Grid container spacing={2}>
                    <Grid size={10}>
                        {solveIndex < predictionStart ?
                            <Typography sx={{ ml: 2 }}>{longFormatter.format(solve.date)}</Typography>
                            : <Typography sx={{ ml: 2 }}>{"Prediction " + (solveIndex - predictionStart + 1) + " solves into the future"}</Typography>
                        }
                    </Grid>
                    <Grid size={10}>
                        {display.filter((v: string) => v !== "pb").map((key: keyof ISolve) => (
                            solve[key] ? (
                                <Stack direction="row" spacing={2} alignItems="center" key={key}>
                                    <Box sx={{
                                        width: 20,
                                        height: 3,
                                        backgroundColor: theme.palette.graphColors[key]
                                    }} />
                                    <Typography
                                        key={key}
                                        sx={{ ml: 2, fontWeight: 'light' }}
                                    >
                                        {keyToLabels[key as keyof typeof keyToLabels]}: {Timer.formatTime(solve[key] as number)}
                                    </Typography>
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
                                <Typography
                                    key={"pb"}
                                    sx={{ ml: 2, fontWeight: 'light' }}
                                >
                                    {solve.newPB ? "(New)" : ""} PB: {Timer.formatTime(solve.pb)}
                                </Typography>
                            </Stack>
                        }
                    </Grid>
                </Grid>
            </Stack>
        </Paper >
    );
}