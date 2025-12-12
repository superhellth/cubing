import { type Solve } from '@cubing/shared';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { CardContent, Typography } from '@mui/material';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from '@mui/system/Box';
import { memo, useMemo } from "react";
import { formatTime, getDisplayableTime } from '../../utils/solveUtils';
import SolvesTable from './SolvesTable';
import { CompactTable, FadeContent, PanelPaper, SidebarCard, ToggleButton } from './TimeDisplay.styles';
import { HEAD_CELLS } from './TimeDisplay';

interface Stats {
    [key: string]: number | null;
}

const TimeDisplayDesktop = memo(({ solves, openSolveDetailsScreen, isCollapsed, onSolveTableVisibilityChange }: {
    solves: Solve[],
    openSolveDetailsScreen: Function,
    isCollapsed: boolean,
    onSolveTableVisibilityChange: Function
}) => {
    const latestSolve = solves?.[solves.length - 1];

    const bestStats: any = useMemo(() => {
        const stats: Stats = { duration: null, avg5: null, avg12: null, avg100: null, avg1000: null };
        if (!solves.length) return stats;

        const updateBest = (key: keyof Stats, val: number | undefined | null) => {
            if (typeof val === 'number' && val > 0 && (stats[key] === null || val < stats[key])) {
                stats[key] = val;
            }
        };

        for (const s of solves) {
            updateBest('duration', s.duration);
            updateBest('avg5', s.avg5);
            updateBest('avg12', s.avg12);
            updateBest('avg100', s.avg100);
            updateBest('avg1000', s.avg1000);
        }
        return stats;
    }, [solves]);



    return (
        <Box sx={{ display: "flex", justifyContent: 'flex-end', alignItems: 'flex-start', height: "100%" }}>
            <SidebarCard isCollapsed={isCollapsed}>

                <ToggleButton onClick={() => onSolveTableVisibilityChange(isCollapsed)}>
                    {!isCollapsed ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
                </ToggleButton>

                <FadeContent isCollapsed={isCollapsed}>
                    <CardContent sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                        <Typography variant='h4' sx={{ padding: 2, paddingTop: 0, userSelect: "none" }}>Your Solves</Typography>
                        <PanelPaper elevation={0} sx={{ flex: 1, padding: "1rem" }}>
                            <CompactTable size='small'>
                                <TableHead sx={{ '& .MuiTableCell-root': { fontSize: '1.3rem', fontWeight: "bold" } }} >
                                    <TableRow sx={{ height: "100%" }}>
                                        <TableCell></TableCell>
                                        <TableCell align='right'>Best</TableCell>
                                        <TableCell align='right'>Current</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ height: "100%" }}>

                                    {HEAD_CELLS.slice(1).map((row) => {
                                        if (solves.length < row.minSolves) return null;

                                        return (
                                            <TableRow key={row.id} sx={{ '& .MuiTableCell-root': { color: row.color } }}>
                                                {/* Label */}
                                                <TableCell sx={{ fontSize: '1.3rem', fontWeight: "bold" }}>
                                                    {row.label}
                                                </TableCell>

                                                {/* Best Stat */}
                                                <TableCell sx={{ fontFamily: "IBM Plex Mono", fontSize: "1.05rem" }} align='right'>
                                                    {formatTime(bestStats[row.id])}
                                                </TableCell>

                                                {/* Current Stat */}
                                                <TableCell sx={{ fontFamily: "IBM Plex Mono", fontSize: "1.05rem" }} align='right'>
                                                    {latestSolve ? getDisplayableTime(latestSolve, row.id as keyof Solve) : "-"}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </CompactTable>
                        </PanelPaper>

                        {/* Main History Table */}
                        <PanelPaper elevation={0} sx={{ p: 0, m: 0, marginTop: "1.5rem", flex: 4 }}>
                            <SolvesTable
                                solves={solves}
                                bestStats={bestStats}
                                openSolveDetailsScreen={openSolveDetailsScreen}
                            />
                        </PanelPaper>
                    </CardContent>
                </FadeContent>
            </SidebarCard>
        </Box>
    );
});

export default TimeDisplayDesktop;