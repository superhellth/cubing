import { type ISolve } from '@cubing/shared';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses, type SortDirection } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from '@mui/system/Box';
import { memo, useMemo, useState } from "react";
import { getDisplayableTime, type TimeKey } from '../api/solveUtils';
import { SolveRow } from './SolveRow';
import Timer from "./timer";

interface Stats {
    [key: string]: number | null;
}

const HEAD_CELLS = [
    { id: 'id', label: '#', color: "text.primary", minSolves: 0 },
    { id: 'duration', label: 'Time', color: "text.primary", minSolves: 0 },
    { id: 'avg5', label: 'Avg5', color: "info.light", minSolves: 0 },
    { id: 'avg12', label: 'Avg12', color: "info.dark", minSolves: 0 },
    { id: 'avg100', label: 'Avg100', color: "info.light", minSolves: 100 },
    { id: 'avg1000', label: 'Avg1000', color: "info.dark", minSolves: 1000 }
];

function descendingComparator(a: any, b: any, orderBy: any) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order: SortDirection | null, orderBy: string) {
    return (a: any, b: any) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        if (aValue == null && bValue != null) return 1;
        if (aValue != null && bValue == null) return -1;
        if (aValue == null && bValue == null) return 0;

        const comparison = descendingComparator(a, b, orderBy);
        return order === 'asc' ? comparison : -comparison;
    }
}

function stableSort(array: any[], comparator: any) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const TimeDisplay = memo(({ solves, openSolveDetailsScreen }: { solves: ISolve[], openSolveDetailsScreen: Function }) => {
    const latestSolve = solves?.[0];
    const [order, setOrder] = useState<SortDirection>('asc');
    const [orderBy, setOrderBy] = useState('id');
    const theme = useTheme();

    const handleSortRequest = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const bestStats: any = useMemo(() => {
        const stats: Stats = { duration: null, avg5: null, avg12: null, avg100: null, avg1000: null };
        if (!solves.length) return stats;

        const updateBest = (key: keyof typeof stats, val: number | undefined | null) => {
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

    const visibleSolves = useMemo(() => {
        return stableSort(solves, getComparator(order, orderBy));
    }, [solves, order, orderBy]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", padding: "10px" }}>
            {/* Best Statistics Table */}
            <Box style={{ flex: 1 }}>
                <h1>Your Solves</h1>
                <Paper elevation={10} sx={{ bgcolor: "secondary.main" }}>
                    <Table sx={{
                        [`& .${tableCellClasses.root}`]: { borderBottom: "none", paddingTop: "6px", paddingBottom: "6px" }
                    }}>
                        <TableHead sx={{ '& .MuiTableCell-root': { textAlign: 'center', fontSize: '1.3rem', fontWeight: "bold" } }} >
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Best</TableCell>
                                <TableCell>Current</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ '& .MuiTableCell-root': { textAlign: 'center', fontSize: '1.1rem' } }}>

                            {HEAD_CELLS.slice(1).map((row) => {
                                if (solves.length < row.minSolves) return null;

                                return (
                                    <TableRow key={row.id} sx={{ '& .MuiTableCell-root': { color: row.color } }}>
                                        {/* Label */}
                                        <TableCell sx={{ '&.MuiTableCell-root': { fontSize: '1.3rem', fontWeight: "bold" } }}>
                                            {row.label}
                                        </TableCell>

                                        {/* Best Stat */}
                                        <TableCell>
                                            {Timer.formatTime(bestStats[row.id])}
                                        </TableCell>

                                        {/* Current Stat */}
                                        <TableCell>
                                            {latestSolve ? getDisplayableTime(latestSolve, row.id as TimeKey) : "-"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            {/* Main History Table */}
            <Box sx={{ flex: 2, overflow: "auto", marginTop: "25px", scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none', }, }}>
                <Table stickyHeader sx={{
                    '& .MuiTableCell-root': {
                        paddingLeft: '6px',
                        paddingRight: '6px'
                    }, userSelect: "none"
                }}>
                    <TableHead sx={{
                        '& .MuiTableCell-root': {
                            textAlign: 'center', fontSize: '1.3rem', fontWeight: "bold",
                            bgcolor: theme.palette.secondary.dark
                        }
                    }}>
                        <TableRow>
                            {HEAD_CELLS.slice(0, -2).map((headCell) => {
                                if (solves.length < headCell.minSolves) return null;

                                return (
                                    <TableCell
                                        key={headCell.id}
                                        sortDirection={orderBy === headCell.id ? order : undefined}
                                    >
                                        <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id ? order === 'desc' ? 'desc' : 'asc' : "asc"}
                                            onClick={() => handleSortRequest(headCell.id)}
                                            sx={{
                                                color: headCell.color,
                                                '&.Mui-active': {
                                                    color: headCell.color,
                                                },
                                                '&:hover': {
                                                    color: headCell.color,
                                                    opacity: 0.3
                                                },
                                                '&.Mui-active .MuiTableSortLabel-icon': {
                                                    color: headCell.color
                                                },
                                                '&:hover .Mui-active': {
                                                    color: headCell.color,
                                                },
                                                '&.MuiTableSortLabel-icon': {
                                                    color: `${headCell.color} !important`,
                                                }
                                            }}
                                        >
                                            {headCell.label}
                                        </TableSortLabel>
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ '& .MuiTableCell-root': { textAlign: 'center', fontSize: '1.1rem' } }}>
                        {visibleSolves.map((solve: ISolve) => (
                            <SolveRow
                                key={solve.id}
                                solve={solve}
                                bestStats={bestStats}
                                openSolveDetailsScreen={openSolveDetailsScreen}
                            />
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
});

export default memo(TimeDisplay); // Memoize the entire component