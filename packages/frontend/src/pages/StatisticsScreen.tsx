import { Discipline, type ISolve } from "@cubing/shared";
import { Card, Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { LTTB } from 'downsample';
import { useMemo, useState } from "react";
import ImprovementChart from "../components/graphs/ImprovementChart";
import VariabilityCard from "../components/graphs/VariabilityCard";
import { useSolveManager } from "../hooks/useSolveManager";
import ActivityCard from "../components/graphs/ActivityCard";

const samplingThreshold: number = 100;
const display: (keyof ISolve)[] = ["avg100", "avg1000"];

function StatisticsScreen() {
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
            const downsampled = LTTB(mappedData, samplingThreshold).map((point: any) => point.original);
            return [...new Set([...downsampled, ...pbs])].sort((a: any, b: any) => { return a.date - b.date });
        }
        return [...new Set([...solvesWithRelevantAverages, ...pbs])];
    }, [solves]);

    return (
        <Grid container spacing={2} sx={{ height: "100%", bgcolor: "primary.main", padding: "15px" }}>
            <Grid size={{ xs: 12, sm: 4 }}>
                <VariabilityCard solvesChronological={downsampledSolves} />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                Something else
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
                <ActivityCard />
            </Grid>
            <Grid size={12}>
                <ImprovementChart solvesChronological={downsampledSolves} pbProgression={pbs} display={display} predict={["avg100", "avg1000"]} showConfidence={true} />
            </Grid>
        </Grid >
    );
}

export default StatisticsScreen;