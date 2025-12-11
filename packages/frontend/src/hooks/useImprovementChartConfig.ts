import { keyToLabels, type Solve, type SolveStats } from '@cubing/shared';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { formatTime } from '../utils/solveUtils';

export const useImprovementChartConfig = (sampledSolves: Solve[], predictions: SolveStats[], display: (keyof SolveStats)[]) => {
    const theme = useTheme();

    const historyAndPredictions = useMemo(() => {
        const foundIndex = sampledSolves.findIndex(solve =>
            display.some(key => solve[key as keyof Solve] != null)
        );
        const firstNonNull = foundIndex === -1 ? 0 : foundIndex;
        return [...sampledSolves.slice(firstNonNull), ...predictions];
    }, [sampledSolves, predictions, display]);

    const xAxisData = useMemo(() => {
        return historyAndPredictions.map((_, i) => i);
    }, [historyAndPredictions]);

    const pbData = useMemo(() => {
        const dataPoints: { x: number; y: number }[] = [];
        const foundIndex = sampledSolves.findIndex(solve =>
            display.some(key => solve[key as keyof Solve] != null)
        );
        const offset = foundIndex === -1 ? 0 : foundIndex;

        for (let i = 0; i < sampledSolves.length; i++) {
            const solve = sampledSolves[i];
            if (solve.newPB && i >= offset) {
                dataPoints.push({ x: i - offset, y: solve.duration });
            }
        }
        return dataPoints;
    }, [sampledSolves, display]);

    const seriesConfig: any = useMemo(() => {
        const lines = display
            .filter(value => value !== "pb")
            .map(key => ({
                type: "line",
                id: key,
                dataKey: key,
                label: keyToLabels[key as keyof typeof keyToLabels],
                color: theme.palette.graphColors[key],
                showMark: true,
                skipAnimation: true,
                valueFormatter: (v: number) => formatTime(v)
            }));

        if (!display.includes("pb")) return lines;

        const pbScatter = {
            type: "scatter",
            id: "pb-scatter",
            label: "Personal Best",
            data: pbData,
            color: theme.palette.info.main,
            markerSize: 5,
            valueFormatter: () => ""
        };

        const pbLine = {
            type: "line",
            id: "pb-line",
            label: "PB",
            color: theme.palette.info.main,
            dataKey: "pb",
            disableHighlight: true,
        };

        return [...lines, pbScatter, pbLine];
    }, [display, theme, keyToLabels, formatTime, pbData]);

    return {
        historyAndPredictions,
        xAxisData,
        seriesConfig
    };
};