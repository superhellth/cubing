import { Status, type ISolve } from '@cubing/shared';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses, type SortDirection } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from '@mui/system/Box';
import { useState } from "react";
import Timer from "./timer";
import { getDisplayableAvg12, getDisplayableAvg5, getDisplayTime } from '../api/solveUtils';

function TimeDisplay({ solves, openSolveDetailsScreen }:
    { solves: ISolve[], openSolveDetailsScreen: Function }) {
    const avg5s: (number | undefined | null)[] = solves.map(solve => solve.avg5);
    const avg12s: (number | undefined | null)[] = solves.map(solve => solve.avg12);
    const solveTimes: number[] = solves.map(solve => solve.duration);
    const [order, setOrder] = useState<SortDirection>('asc');
    const [orderBy, setOrderBy] = useState('id');
    const rows = solves.map(solve => ({
        id: solve.id,
        solve: solve,
        single: solve.duration,
        avg5: solve.avg5,
        avg12: solve.avg12
    }));
    const headCells = [
        { id: 'id', label: '#', color: "text.main" },
        { id: 'single', label: 'Time', color: "text.main" },
        { id: 'avg5', label: 'Avg5', color: "info.light" },
        { id: 'avg12', label: 'Avg12', color: "info.dark" }
    ];
    const getBest = (key: keyof ISolve) => {
        const validTimes = solves
            .map(s => s[key])
            .filter((t): t is number => typeof t === 'number' && t > 0);

        return validTimes.length > 0 ? Math.min(...validTimes) : null;
    };

    const handleSortRequest = (property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    function descendingComparator(a: any, b: any, orderBy: any) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order: SortDirection | null, orderBy: string) {
        return (a: any, b: any) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];
            if (aValue == null && bValue != null) {
                return 1;
            }
            if (aValue != null && bValue == null) {
                return -1;
            }
            if (aValue == null && bValue == null) {
                return 0;
            }
            const comparison = descendingComparator(a, b, orderBy);
            return order === 'asc' ? comparison : -comparison;
        }
    }

    function stableSort(array: any, comparator: any) {
        const stabilizedThis = array.map((el: any, index: any) => [el, index]);
        stabilizedThis.sort((a: any, b: any) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
                return order;
            }
            return a[1] - b[1];
        });
        return stabilizedThis.map((el: any) => el[0]);
    }

    const bestAvg5 = getBest("avg5");
    const bestAvg12 = getBest("avg12");
    const bestSingle = getBest("duration");
    const theme = useTheme();

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", padding: "10px" }}>
            <Box style={{ flex: 1 }}>
                <h1>Your Solves</h1>
                <Paper elevation={10} sx={{ bgcolor: "secondary.main" }}>

                    <Table sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none" } }}>
                        <TableHead sx={{ '& .MuiTableCell-root': { textAlign: 'center', fontSize: '1.3rem', fontWeight: "bold" } }} >
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Best</TableCell>
                                <TableCell>Current</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ '& .MuiTableCell-root': { textAlign: 'center', fontSize: '1.1rem' } }}>
                            <TableRow>
                                <TableCell sx={{ '&.MuiTableCell-root': { fontSize: '1.3rem', fontWeight: "bold" } }}>Single</TableCell>
                                <TableCell>{solves.length >= 1 ? Timer.formatTime(getBest("duration")) : ""}</TableCell>
                                <TableCell>{solves.length >= 3 ? getDisplayTime(solves[0]) : ""}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '& .MuiTableCell-root': { color: "info.light" } }}>
                                <TableCell sx={{ '&.MuiTableCell-root': { fontSize: '1.3rem', fontWeight: "bold" } }}>Avg. of 5</TableCell>
                                <TableCell>{solves.length >= 5 ? Timer.formatTime(getBest("avg5")) : ""}</TableCell>
                                <TableCell>{solves.length >= 5 ? getDisplayableAvg5(solves[0]) : ""}</TableCell>
                            </TableRow>
                            <TableRow sx={{ '& .MuiTableCell-root': { color: "info.dark" } }}>
                                <TableCell sx={{ '&.MuiTableCell-root': { fontSize: '1.3rem', fontWeight: "bold" } }}>Avg. of 12</TableCell>
                                <TableCell>{solves.length >= 12 ? Timer.formatTime(getBest("avg12")) : ""}</TableCell>
                                <TableCell>{solves.length >= 12 ? getDisplayableAvg12(solves[0]) : ""}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            <Box sx={{ flex: 2, overflow: "auto", marginTop: "25px", scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none', }, }}>
                <Table stickyHeader >
                    <TableHead sx={{ '& .MuiTableCell-root': { textAlign: 'center', fontSize: '1.3rem', paddingLeft: 0, paddingRight: 0, fontWeight: "bold", bgcolor: theme.palette.secondary.dark } }}>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    sortDirection={orderBy === headCell.id ? order : undefined}
                                    sx={{ color: headCell.color }}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? order : 'asc'}
                                        onClick={() => handleSortRequest(headCell.id)}
                                    >
                                        {headCell.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ '& .MuiTableCell-root': { textAlign: 'center', fontSize: '1.1rem' } }}>
                        {stableSort(rows, getComparator(order, orderBy))
                            .map((row: any) => (
                                <TableRow key={row.solve.id} onClick={() => openSolveDetailsScreen(row.solve)} hover sx={{
                                    cursor: 'pointer',
                                    '&:hover .MuiTableCell-root': {
                                        bgcolor: 'secondary.light'
                                    }
                                }}>
                                    <TableCell>{row.solve.id}</TableCell>
                                    <TableCell sx={{
                                        color: row.solve.status === Status.DNF ? "error.main" : row.solve.status === Status.PlusTwo ? "warning.main" : "text.primary",
                                        fontWeight: (bestSingle !== null && row.solve.duration === bestSingle) ? "bold" : "normal"
                                    }}>
                                        {getDisplayTime(row.solve)}
                                    </TableCell>
                                    <TableCell sx={{
                                        color: row.solve.avg5 === -1 ? "error.main" : "text.primary",
                                        fontWeight: (bestAvg5 !== null && row.avg5 === bestAvg5) ? "bold" : "normal"
                                    }}>
                                        {getDisplayableAvg5(row.solve)}
                                    </TableCell>
                                    <TableCell sx={{
                                        color: row.solve.avg12 === -1 ? "error.main" : "text.primary",
                                        fontWeight: (bestAvg12 !== null && row.avg12 === bestAvg12) ? "bold" : "normal"
                                    }}>
                                        {getDisplayableAvg12(row.solve)}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
}

export default TimeDisplay;