import { Discipline, type ISolve } from "@cubing/shared";
import { Box, Grid, useTheme } from "@mui/system";
import { LTTB } from 'downsample';
import { useMemo, useState } from "react";
import ActivityCard from "../components/statistics/ActivityCard";
import DistributionCard from "../components/statistics/DistributionCard";
import ImprovementChart from "../components/statistics/ImprovementChart";
import VariabilityCard from "../components/statistics/VariabilityCard";
import { useSolveManager } from "../hooks/useSolveManager";
import { sortChronologically } from "../utils/solveUtils";
import { Card } from "@mui/material";

const samplingThreshold: number = 500;
const display: (keyof ISolve)[] = ["avg5", "avg12", "avg100", "avg1000"];
interface LTTBPoint {
    x: number;
    y: number;
    original: ISolve;
}

function StatisticsScreen() {
    const theme = useTheme();
    const [selectedDiscipline] = useState<Discipline>(Discipline.OneHanded);
    const [selectedSession] = useState<string>("default");
    const { solves } =
        useSolveManager(selectedDiscipline, selectedSession);

    const pbs = useMemo(() => {
        const pbs: ISolve[] = [];
        for (let solve of [...solves].reverse()) {
            if (pbs.length == 0 || pbs[pbs.length - 1].duration > solve.duration) {
                pbs.push(solve);
            }
        }
        return pbs;
    }, [solves]);

    const downsampledSolves = useMemo(() => {
        const solvesWithRelevantAverages: ISolve[] = solves.filter((solve: ISolve) => display.some(key => solve[key] != null));
        if (solvesWithRelevantAverages.length > samplingThreshold) {
            const mappedData = solvesWithRelevantAverages.map((solve) => ({
                x: solve.date,
                y: solve.duration,
                original: solve
            }));
            const sampledPoints = LTTB(mappedData, samplingThreshold) as LTTBPoint[];
            const sampledSolves = sampledPoints.map((point: any) => point.original);
            return sortChronologically([...new Set([...sampledSolves, ...pbs])]);
        }
        return [...new Set([...solvesWithRelevantAverages, ...pbs])];
    }, [solves]);

    return (
        <Box sx={{height: "100%", padding: "1rem", bgcolor: theme.palette.primary.main}}>
            <Card sx={{ height: "100%", bgcolor: theme.palette.primary.main, border: "1px solid", borderColor: theme.palette.secondary.main }}>
                <Grid container spacing={2} sx={{ height: "100%", padding: "15px" }}>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <VariabilityCard solvesChronological={downsampledSolves} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <DistributionCard solves={solves} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                        <ActivityCard />
                    </Grid>
                    <Grid size={12}>
                        <ImprovementChart solves={solves} />
                    </Grid>
                </Grid >
            </Card>
        </Box>
    );
}

export default StatisticsScreen;