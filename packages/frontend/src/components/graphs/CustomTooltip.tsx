import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/system';
import { useAxesTooltip } from '@mui/x-charts';
import { useMemo } from 'react';
import Timer from '../../utils/timer';
import theme from '../../styles/theme';

export function CustomItemTooltip({ displayedSolves, display, predictionStart }: any) {
    const tooltipData = useAxesTooltip();
    //   console.log(tooltipData)
    if (!tooltipData) {
        return null;
    }
    const solve: any = useMemo(() => {
        const axisData = tooltipData;
        const solveIndex: number = axisData[0].dataIndex;
        return displayedSolves[solveIndex];
    }, tooltipData);
    const longFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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
                        {(display.includes("avg5") && solve["avg5"]) &&
                            <Typography sx={{ ml: 2 }} fontWeight="light">
                                {"Average of 5: " + Timer.formatTime(solve.avg5)}
                            </Typography>
                        }
                        {(display.includes("avg12") && solve["avg12"]) &&
                            <Typography sx={{ ml: 2 }} fontWeight="light">
                                {"Average of 12: " + Timer.formatTime(solve.avg12)}
                            </Typography>
                        }
                        {(display.includes("avg100") && solve["avg100"]) &&
                            <Typography sx={{ ml: 2 }} fontWeight="light">
                                {"Average of 100: " + Timer.formatTime(solve.avg100)}
                            </Typography>
                        }
                        {(display.includes("avg1000") && solve["avg1000"]) &&
                            <Typography sx={{ ml: 2 }} fontWeight="light">
                                {"Average of 1000: " + Timer.formatTime(solve.avg1000)}
                            </Typography>
                        }
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    );
}