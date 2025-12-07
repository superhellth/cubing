import { Discipline } from "@cubing/shared";
import { FormControl, ListItemText, MenuItem, Select, Typography } from "@mui/material";
import { Box, display, Grid, useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import ActivityCard from "../components/statistics/ActivityCard";
import DevelopmentCard from "../components/statistics/DevelopmentCard";
import DistributionCard from "../components/statistics/DistributionCard";
import ImprovementChart from "../components/statistics/ImprovementChart";
import CalculationLoader from "../components/statistics/Loading";
import VariabilityCard from "../components/statistics/VariabilityCard";
import usePBStats from "../hooks/usePBStats";
import { useSolveManager } from "../hooks/useSolveManager";
import { EVENT_AND_DISCIPLINES_MAP } from "../utils/constants";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

function StatisticsScreen() {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(Discipline.OneHanded);
    const [selectedSession] = useState<string>("default");

    const { solves } =
        useSolveManager(selectedDiscipline, selectedSession);
    const solvesWithPbs = usePBStats(solves);

    useEffect(() => {
        setIsLoading(solves.length === 0);
    }, [solves])

    return (
        <Box sx={{ height: "100%", padding: 3, bgcolor: theme.palette.primary.main, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                <Grid container spacing={2} sx={{ flex: 6, display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
                    <Grid size={{ xs: 12, md: 9.7 }}>
                        <Typography variant="h3" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                            Analytics
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 2.3 }} sx={{paddingBottom: 2}}>
                        <FormControl fullWidth sx={{ bgcolor: "#090909", border: "1px solid #333333", p: 1, borderRadius: 2, maxHeight: "48px"}}>
                            <Select
                                value={selectedDiscipline}
                                variant="standard"
                                onChange={(event: any) => { setSelectedDiscipline(event.target.value); }}
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
            {isLoading ? (
                <CalculationLoader />
            ) : (
                <Grid container spacing={2} sx={{ flex: 6 }}>
                    <Grid size={{ xs: 12, md: 9.7 }} sx={{ minHeight: '500px', flex: 4 }}>
                        <ImprovementChart solves={solvesWithPbs} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 2.3 }}>
                        <DevelopmentCard solves={solvesWithPbs} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4.85 }}>
                        <VariabilityCard solvesChronological={solves} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4.85 }}>
                        <DistributionCard solves={solves} />
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