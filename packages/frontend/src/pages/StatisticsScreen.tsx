import { Discipline, type Solve } from "@cubing/shared";
import { Box, Grid, useTheme } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import ActivityCard from "../components/statistics/ActivityCard";
import DevelopmentCard from "../components/statistics/DevelopmentCard";
import DistributionCard from "../components/statistics/DistributionCard";
import ImprovementChart from "../components/statistics/ImprovementChart";
import CalculationLoader from "../components/statistics/Loading";
import VariabilityCard from "../components/statistics/VariabilityCard";
import { useDemoSolves } from "../hooks/solves/useDemoSolves";
import { useSolveManager } from "../hooks/solves/useSolveManager";

function StatisticsScreen({ selectedDiscipline, sidebarResizing }: { selectedDiscipline: Discipline, sidebarResizing: boolean }) {
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(true);
    const [selectedSession] = useState<string>("default");

    const { solvesChrono, hasFetched } = useSolveManager(selectedDiscipline, selectedSession);
    const {demoSolves, hasFetchedDemo} = useDemoSolves(!isLoading && isLocked);
    const displayData: Solve[] = useMemo(() => {
        if (!hasFetched) return [];

        if (solvesChrono.length < 12) {
            return demoSolves;
        }
        return solvesChrono;
    }, [solvesChrono, hasFetched]);

    useEffect(() => {
        setIsLoading(!hasFetched);
        if (hasFetched) {
            const locked = solvesChrono.length < 12
            setIsLocked(locked);
            setIsLoading(locked && !hasFetchedDemo);
        }
    }, [hasFetched, solvesChrono])

    useEffect(() => {
        setIsLoading(true);
        setIsLocked(false);
    }, [selectedDiscipline])

    return (
        <Box sx={{ height: "100%", padding: 3, bgcolor: theme.palette.primary.main, display: "flex", flexDirection: "column", gap: 2 }}>
            {isLoading ? (
                <CalculationLoader />
            ) : (
                <>
                    <Box sx={{ flex: 65, minHeight: 0 }}>
                        <Grid container spacing={2} sx={{ height: '100%' }}>
                            <Grid size={{ xs: 12, md: 9.7 }} sx={{ height: '100%' }}>
                                <ImprovementChart solvesChrono={displayData} isResizing={sidebarResizing} numTrueSolves={solvesChrono.length} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 2.3 }} sx={{ height: '100%' }}>
                                <DevelopmentCard solvesChrono={displayData} numTrueSolves={solvesChrono.length} />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ flex: 35, minHeight: 0 }}>
                        <Grid container spacing={2} sx={{ height: '100%' }}>
                            <Grid size={{ xs: 12, md: 4.85 }} sx={{ height: '100%' }}>
                                <VariabilityCard solvesChrono={displayData} numTrueSolves={solvesChrono.length} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 4.85 }} sx={{ height: '100%' }}>
                                <DistributionCard solves={displayData} numTrueSolves={solvesChrono.length} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 2.3 }} sx={{ height: '100%' }}>
                                <ActivityCard />
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
        </Box>
    );
}

export default StatisticsScreen;