import { Discipline } from "@cubing/shared";
import { Typography } from "@mui/material";
import { Box, Grid, useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import ActivityCard from "../components/statistics/ActivityCard";
import DevelopmentCard from "../components/statistics/DevelopmentCard";
import DistributionCard from "../components/statistics/DistributionCard";
import ImprovementChart from "../components/statistics/ImprovementChart";
import CalculationLoader from "../components/statistics/Loading";
import VariabilityCard from "../components/statistics/VariabilityCard";
import usePBStats from "../hooks/usePBStats";
import { useSolveManager } from "../hooks/useSolveManager";

function StatisticsScreen() {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDiscipline] = useState<Discipline>(Discipline.OneHanded);
    const [selectedSession] = useState<string>("default");

    const { solves } =
        useSolveManager(selectedDiscipline, selectedSession);
    const solvesWithPbs = usePBStats(solves);

    useEffect(() => {
        setIsLoading(solves.length === 0);
    }, [solves])

    return (
        <Box sx={{ height: "100%", padding: 3, bgcolor: theme.palette.primary.main, display: "flex", flexDirection: "column" }}>
            <Typography variant="h3" sx={{ color: '#fff', mb: 3, fontWeight: 600}}>
                Analytics
            </Typography>
            {isLoading ? (
                <CalculationLoader />
            ) : (
                <Grid container spacing={2} sx={{ flex: 6}}>
                    <Grid size={{ xs: 12, md: 9.7 }} sx={{ minHeight: '500px', flex: 4}}>
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