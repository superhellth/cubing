import { type ISolve } from '@cubing/shared';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from '@mui/system/Box';
import { memo, useMemo, useState } from "react";
import { getDisplayableTime } from '../../utils/solveUtils';
import Timer from "../../utils/timer";
import SolvesTable from './SolvesTable';
import { useTheme } from '@mui/system';
import usePBStats from '../../hooks/usePBStats';
import { Collapse, IconButton, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Stats {
    [key: string]: number | null;
}

export const HEAD_CELLS = [
    { id: 'id', label: '#', color: "text.primary", minSolves: 0 },
    { id: 'duration', label: 'Time', color: "text.primary", minSolves: 0 },
    { id: 'avg5', label: 'Avg5', color: "info.light", minSolves: 0 },
    { id: 'avg12', label: 'Avg12', color: "info.dark", minSolves: 0 },
    { id: 'avg100', label: 'Avg100', color: "info.light", minSolves: 100 },
    { id: 'avg1000', label: 'Avg1000', color: "info.dark", minSolves: 1000 }
];

const TimeDisplay = memo(({ solves, openSolveDetailsScreen }: { solves: ISolve[], openSolveDetailsScreen: Function }) => {
    const theme = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const latestSolve = solves?.[0];

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
        // console.log(stats)
        return stats;
    }, [solves]);



    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", padding: "1.5rem", position: "relative" }}>
            <IconButton sx={{ position: "absolute", top: "25px", right: "25px", color: theme.palette.text.secondary }}>
                <VisibilityIcon />
            </IconButton>
            {/* Best Statistics Table */}
            <Typography variant='h4' sx={{ padding: 2, paddingTop: 0 }}>Your Solves</Typography>
            <Paper elevation={0} sx={{
                bgcolor: theme.palette.primary.main,
                border: "1px solid #333333",
                borderRadius: "8px",
                flex: 1,
                display: "flex",
                padding: "1rem"
            }}>
                <Table size='small' sx={{
                    // height: "100%",
                    [`& .${tableCellClasses.root}`]: {
                        borderBottom: "none",
                        padding: "0 0",
                        paddingTop: "1rem",
                    },
                    [`& .${tableCellClasses.head}`]: {
                        padding: 0,
                        height: "auto",
                    }
                }}>
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
                                        {Timer.formatTime(bestStats[row.id])}
                                    </TableCell>

                                    {/* Current Stat */}
                                    <TableCell sx={{ fontFamily: "IBM Plex Mono", fontSize: "1.05rem" }} align='right'>
                                        {latestSolve ? getDisplayableTime(latestSolve, row.id as keyof ISolve) : "-"}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>

            {/* Main History Table */}
            <Paper elevation={0} sx={{
                flex: 4,
                marginTop: "1.5rem",
                bgcolor: theme.palette.primary.main,
                border: "1px solid #333333",
                borderRadius: "8px",
                display: "flex",
            }}>
                <SolvesTable solves={solves} bestStats={bestStats} openSolveDetailsScreen={openSolveDetailsScreen} />
            </Paper>
        </Box>
    );
});

export default TimeDisplay;