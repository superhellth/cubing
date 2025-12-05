import { Discipline } from "@cubing/shared";
import { Skeleton, Typography } from "@mui/material";
import { Box, Grid, Stack, useTheme } from "@mui/system";
import { useDeferredValue, useEffect, useState } from "react";
import ActivityCard from "../components/statistics/ActivityCard";
import DevelopmentCard from "../components/statistics/DevelopmentCard";
import DistributionCard from "../components/statistics/DistributionCard";
import ImprovementChart from "../components/statistics/ImprovementChart";
import VariabilityCard from "../components/statistics/VariabilityCard";
import { useSolveManager } from "../hooks/useSolveManager";
import usePBStats from "../hooks/usePBStats";

function StatisticsScreen() {
    const theme = useTheme();
    const [selectedDiscipline] = useState<Discipline>(Discipline.OneHanded);
    const [selectedSession] = useState<string>("default");

    const { solves } =
        useSolveManager(selectedDiscipline, selectedSession);
    const solvesWithPbs = usePBStats(solves);

    return (
        <Box sx={{ height: "100%", padding: 3, bgcolor: theme.palette.primary.main }}>
            <Typography variant="h3" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                Analytics
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 9.7 }} sx={{ height: '500px' }}>
                    {/* <Skeleton variant="rectangular" width="100%" height={500} sx={{ borderRadius: "16px" }} /> */}
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
        </Box>
    );
}

export default StatisticsScreen;