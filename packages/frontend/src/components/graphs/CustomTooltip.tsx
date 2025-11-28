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

export function CustomItemTooltip({ displayedSolves, display, predictionStart }: any) {
    const tooltipData = useAxesTooltip();
    if (!tooltipData) {
        return null;
    }
    const solve: any = useMemo(() => {
        const axisData = tooltipData;
        const solveIndex: number = axisData[0].dataIndex;
        return displayedSolves[solveIndex];
    }, tooltipData);

    return (
        <Paper
            elevation={0}
            sx={{
                m: 1,
                p: 1.5,
                border: 'solid',
                borderWidth: 2,
                borderColor: solve.newPB ? theme.palette.info.light : theme.palette.info.dark,
            }}
        >
            <Stack direction="row" alignItems="center">
                <Grid container spacing={2}>
                    <Grid size={10}>
                        {solve.index < predictionStart ?
                            <Typography sx={{ ml: 2 }}>{longFormatter.format(solve.date)}</Typography>
                            : <Typography sx={{ ml: 2 }}>{"Prediction " + (solve.index - predictionStart + 1) + " solves into the future"}</Typography>
                        }
                    </Grid>
                    <Grid size={10}>
                        {display.map((key: keyof ISolve) => (
                            solve[key] ? (
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{
                                        width: 20,
                                        height: 3,
                                        backgroundColor: theme.palette.graphColors[key]
                                    }} />
                                    <Typography
                                        key={key}
                                        sx={{ ml: 2, fontWeight: 'light' }}
                                    >
                                        {keyToLabels[key]}: {Timer.formatTime(solve[key])}
                                    </Typography>
                                </Stack>
                            ) : null
                        ))}
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
                    </Grid>
                </Grid>
            </Stack>
        </Paper >
    );
}