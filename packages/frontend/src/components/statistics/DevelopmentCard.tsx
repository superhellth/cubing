import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Divider, FormControl, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { Box, Grid } from "@mui/system";
import { useMemo, useState } from 'react';
import useImprovementStats from '../../hooks/useImprovementStats';
import { GraphCard } from "../GraphCard";
import TrendCard from './TrendCard';

const displayed = ["duration", "pb", "avg5", "avg12", "avg100", "avg1000"];

const DevelopmentCard = ({ solvesChrono }: any) => {
    if (solvesChrono.length <= 0) return null;
    const recentSolve = solvesChrono[0];
    const theme = useTheme();
    const [timeFrame, setTimeFrame] = useState("recent");
    const trends = useImprovementStats(solvesChrono);
    const impRate = useMemo(() => {
        return timeFrame == "all" ? -trends.all.duration.slope : -trends.recent.duration.slope
    }, [solvesChrono, timeFrame])

    return (
        <GraphCard title={"Improvement speed"} icon={<AutoAwesomeIcon />}>
            <Typography variant="h4" sx={{ color: impRate < 0 ? theme.palette.error.main : '#fff', m: 1, fontWeight: 700 }}>{impRate}
                <Box
                    component="span"
                    sx={{
                        fontSize: '0.4em',
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
                    disabled={solvesChrono.length <= 100}
                    onChange={(_event: any, v: any) => { if (v !== null) { setTimeFrame(v); } }}
                    sx={{
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
                {displayed.map((key: string, _index: number) => {
                    const trend: any = timeFrame == "all" ? trends.all[key as keyof typeof trends.all] : trends.recent[key as keyof typeof trends.all];
                    if (trend.relativeChange === 0 && trend.absoluteChange === 0 && trend.slope === 0) {
                        return null;    
                    }
                    return (
                        <Grid size={{ xs: 12, md: 6, sm: 6 }} key={key}>
                            <TrendCard trend={trend} headerKey={key} current={recentSolve[key]} />
                        </Grid>
                    );
                })}
            </Grid>
        </GraphCard>
    );
}

export default DevelopmentCard;