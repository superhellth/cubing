import { Discipline } from "@cubing/shared";
import LockIcon from '@mui/icons-material/Lock';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Card, FormControl, ListItemText, MenuItem, Select, Typography } from "@mui/material";
import { Box, Grid, useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import ActivityCard from "../components/statistics/ActivityCard";
import DevelopmentCard from "../components/statistics/DevelopmentCard";
import DistributionCard from "../components/statistics/DistributionCard";
import ImprovementChart from "../components/statistics/ImprovementChart";
import CalculationLoader from "../components/statistics/Loading";
import VariabilityCard from "../components/statistics/VariabilityCard";
import { useSolveManager } from "../hooks/solves/useSolveManager";
import { EVENT_AND_DISCIPLINES_MAP } from "../utils/constants";
import { useTimerSettings } from "../hooks/useTimerSettings";

function StatisticsScreen() {
    const theme = useTheme();
    const { settings, updateSetting } = useTimerSettings();
    const [isLoading, setIsLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(true);
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(settings.lastStatDiscipline);
    const [selectedSession] = useState<string>("default");

    const { solvesChrono, hasFetched } =
        useSolveManager(selectedDiscipline, selectedSession);

    useEffect(() => {
        setIsLoading(!hasFetched);
        setIsLocked(solvesChrono.length < 12);
    }, [hasFetched, solvesChrono])

    return (
        <Box sx={{ height: "100%", padding: 3, bgcolor: theme.palette.primary.main, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Grid container spacing={2} sx={{ flex: 6, display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
                    <Grid size={{ xs: 12, md: 9.7 }}>
                        <Typography variant="h3" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                            Analytics
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2.3 }} sx={{ paddingBottom: 2 }}>
                        <FormControl fullWidth sx={{ bgcolor: "#090909", border: "1px solid #333333", p: 1, borderRadius: 2, maxHeight: "48px" }}>
                            <Select
                                value={selectedDiscipline}
                                variant="standard"
                                onChange={(event: any) => { setSelectedDiscipline(event.target.value); updateSetting("lastStatDiscipline", event.target.value)}}
                                renderValue={(selected) => selected}
                                sx={{
                                    '.MuiSelect-icon': {
                                        color: 'white',
                                    },
                                }}
                            >
                                {[...EVENT_AND_DISCIPLINES_MAP.keys()].map((discipline) => (
                                    <MenuItem key={discipline} value={discipline} sx={{ bgcolor: "#090909" }}>
                                        <ListItemText primary={discipline} />
                                        {discipline === selectedDiscipline && (
                                            <CheckRoundedIcon
                                                sx={{
                                                    color: theme.palette.info.main,
                                                    fontSize: '1.2rem'
                                                }}
                                            />
                                        )}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>


            </Box>
            {isLoading || isLocked ? (
                <>
                    {isLocked ? (
                        <Card
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: "100%",
                                flex: 1,
                                bgcolor: 'transparent',
                                flexDirection: "column",
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '16px',
                                boxShadow: 'none',
                                border: '1px solid #27272a',
                            }}
                        >
                            <LockIcon sx={{ fontSize: 40, color: "grey.500", mb: 1 }} />
                            <Typography variant="h4">Cube some more to unlock your stats for this category.</Typography>
                        </Card>
                    ) : (
                        <CalculationLoader />
                    )}
                </>
            ) : (
                <Grid container spacing={2} sx={{ flex: 6 }}>
                    <Grid size={{ xs: 12, md: 9.7 }} sx={{ minHeight: '450px' }}>
                        <ImprovementChart solvesChrono={solvesChrono} isLocked={false} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2.3 }}>
                        <DevelopmentCard solvesChrono={solvesChrono} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4.85 }}>
                        <VariabilityCard solvesChrono={solvesChrono} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4.85 }}>
                        <DistributionCard solves={solvesChrono} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2.3 }}>
                        <ActivityCard />
                    </Grid>
                </Grid >
            )}
        </Box>
    );
}

export default StatisticsScreen;