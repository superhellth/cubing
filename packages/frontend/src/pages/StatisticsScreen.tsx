import { Discipline } from "@cubing/shared";
import { Typography } from "@mui/material";
import { Box, Grid, Stack, useTheme } from "@mui/system";
import { useState } from "react";
import ActivityCard from "../components/statistics/ActivityCard";
import DevelopmentCard from "../components/statistics/DevelopmentCard";
import DistributionCard from "../components/statistics/DistributionCard";
import ImprovementChart from "../components/statistics/ImprovementChart";
import VariabilityCard from "../components/statistics/VariabilityCard";
import { useSolveManager } from "../hooks/useSolveManager";

function StatisticsScreen() {
    const theme = useTheme();
    const [selectedDiscipline] = useState<Discipline>(Discipline.OneHanded);
    const [selectedSession] = useState<string>("default");
    const { solves } =
        useSolveManager(selectedDiscipline, selectedSession);

    return (
        <Box sx={{ height: "100%", padding: 3, bgcolor: theme.palette.primary.main }}>
            <Typography variant="h4" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                Analytics
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 10 }} sx={{ height: '500px' }}>
                    <ImprovementChart solves={solves} />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                    <Stack spacing={2} sx={{ height: '500px' }}>
                        <Box sx={{ flex: 1 }}>
                            <DevelopmentCard solves={solves} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <ActivityCard />
                        </Box>
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <VariabilityCard solvesChronological={solves} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <DistributionCard solves={solves} />
                </Grid>
            </Grid >
        </Box>
    );
}

export default StatisticsScreen;