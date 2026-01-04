import { Discipline } from "@cubing/shared";
import LockIcon from '@mui/icons-material/Lock';
import { Card, Typography } from "@mui/material";
import { Box, Grid, useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import ActivityCard from "../components/statistics/ActivityCard";
import DevelopmentCard from "../components/statistics/DevelopmentCard";
import DistributionCard from "../components/statistics/DistributionCard";
import ImprovementChart from "../components/statistics/ImprovementChart";
import CalculationLoader from "../components/statistics/Loading";
import VariabilityCard from "../components/statistics/VariabilityCard";
import { useSolveManager } from "../hooks/solves/useSolveManager";

function StatisticsScreen({ selectedDiscipline }: { selectedDiscipline: Discipline }) {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(true);
    const [selectedSession] = useState<string>("default");

    const { solvesChrono, hasFetched } =
        useSolveManager(selectedDiscipline, selectedSession);

    useEffect(() => {
        setIsLoading(!hasFetched);
        setIsLocked(solvesChrono.length < 12);
    }, [hasFetched, solvesChrono])

    return (
        <Box sx={{ height: "100%", padding: 3, bgcolor: theme.palette.primary.main, display: "flex", flexDirection: "column" }}>
            {isLoading || isLocked ? (
                <>
                    {isLoading ? (
                        <CalculationLoader />
                    ) : (
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
                    {/* <Grid>
                        <Experimental />
                    </Grid> */}
                </Grid >
            )}
        </Box>
    );
}

export default StatisticsScreen;