import Table from '@mui/material/Table';
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses, type SortDirection } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from '@mui/system/Box';
import { useState } from "react";
import type Solve from "../api/solve";
import Timer from "./timer";

function TimeDisplay({ solves, openSolveDetailsScreen, avg5s, avg12s }:
    { solves: Solve[], openSolveDetailsScreen: Function, avg5s: (number | null)[], avg12s: (number | null)[] }) {
    const filteredAvg5s: number[] = avg5s.filter((item): item is number => item !== null);
    const filteredAvg12s: number[] = avg12s.filter((item): item is number => item !== null);
    const solveTimes: number[] = solves.map(solve => solve.duration);
    const solveIDs: number[] = solves.map(solve => solve.id);
    const [order, setOrder] = useState<SortDirection>('desc');
    const [orderBy, setOrderBy] = useState('id');
    const rows = Array.from({ length: solveIDs.length }, (_, i) => {
        return { "id": solveIDs[i], "single": solveTimes[i], "avg5": avg5s[i], "avg12": avg12s[i] };
    });
    const headCells = [
        { id: 'id', label: '#' },
        { id: 'single', label: 'Time' },
        { id: 'avg5', label: 'Avg5' },
        { id: 'avg12', label: 'Avg12' }
    ];
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

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", padding: "10px" }}>
            <Box style={{ flex: 1 }}>
                <h1>Your Solves</h1>
                <Table sx={{ [`& .${tableCellClasses.root}`]: { borderBottom: "none" } }}>
                    <TableHead sx={{ '& .MuiTableCell-root': { textAlign: 'center', fontSize: '1.3rem', fontWeight: "bold" } }}>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Best</TableCell>
                            <TableCell>Current</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ '& .MuiTableCell-root': { textAlign: 'center', fontSize: '1.1rem' } }}>
                        <TableRow>
                            <TableCell sx={{ '&.MuiTableCell-root': { fontSize: '1.3rem', fontWeight: "bold" } }}>Single</TableCell>
                            <TableCell>{solves.length >= 1 ? Timer.formatTime(Math.min(...solveTimes)) : ""}</TableCell>
                            <TableCell>{solves.length >= 3 ? Timer.formatTime(solveTimes[0]) : ""}</TableCell>
                        </TableRow>
                        <TableRow sx={{ '& .MuiTableCell-root': { color: "info.light" } }}>
                            <TableCell sx={{ '&.MuiTableCell-root': { fontSize: '1.3rem', fontWeight: "bold" } }}>Avg. of 5</TableCell>
                            <TableCell>{solves.length >= 5 ? Timer.formatTime(Math.min(...filteredAvg5s)) : ""}</TableCell>
                            <TableCell>{solves.length >= 5 ? Timer.formatTime(avg5s[0]) : ""}</TableCell>
                        </TableRow>
                        <TableRow sx={{ '& .MuiTableCell-root': { color: "info.dark" } }}>
                            <TableCell sx={{ '&.MuiTableCell-root': { fontSize: '1.3rem', fontWeight: "bold" } }}>Avg. of 12</TableCell>
                            <TableCell>{solves.length >= 12 ? Timer.formatTime(Math.min(...filteredAvg12s)) : ""}</TableCell>
                            <TableCell>{solves.length >= 12 ? Timer.formatTime(avg12s[0]) : ""}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>

            <Box sx={{ flex: 2, overflow: "auto", marginTop: "25px", scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none', }, }}>
                <Table stickyHeader >
                    <TableHead sx={{ '& .MuiTableCell-root': { textAlign: 'center', fontSize: '1.3rem', paddingLeft: 0, paddingRight: 0, fontWeight: "bold", bgcolor: "secondary.main" } }}>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    sortDirection={orderBy === headCell.id ? order : undefined}
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
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{Timer.formatTime(row.single)}</TableCell>
                                    <TableCell>{Timer.formatTime(row.avg5)}</TableCell>
                                    <TableCell>{Timer.formatTime(row.avg12)}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
}

export default TimeDisplay;