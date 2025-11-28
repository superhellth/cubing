import type { ISolve } from '@cubing/shared';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, useTheme, type SortDirection } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { SolveRow } from './SolveRow';
import { HEAD_CELLS } from './TimeDisplay';
import { Box } from '@mui/system';

interface SolvesTableProps {
    solves: ISolve[],
    bestStats: any,
    openSolveDetailsScreen: any
}

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

export default function SolvesTable({ solves, bestStats, openSolveDetailsScreen }: SolvesTableProps) {
    const [order, setOrder] = useState<SortDirection>('asc');
    const [orderBy, setOrderBy] = useState('id');
    const theme = useTheme();

    const sortedSolves = useMemo(() => {
        return stableSort(solves, getComparator(order, orderBy));
    }, [solves, order, orderBy]);
    const handleSortRequest = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
    return (
        <Box sx={{ flex: 2, overflow: "auto", marginTop: "25px" }}>
            <TableVirtuoso
                data={sortedSolves}
                components={{
                    Scroller: React.forwardRef((props, ref) => (
                        <TableContainer component={Paper} {...props} ref={ref} sx={{
                            // 1. Hide scrollbar for Chrome, Safari, and Opera
                            '&::-webkit-scrollbar': { display: 'none' },
                            // 2. Hide scrollbar for Firefox
                            scrollbarWidth: 'none',
                            // 3. Hide scrollbar for IE and Edge
                            msOverflowStyle: 'none',
                        }} />
                    )),
                    Table: (props) => (
                        <Table
                            {...props}
                            stickyHeader
                            sx={{
                                borderCollapse: 'separate',
                                '& .MuiTableCell-root': { paddingLeft: '0px', paddingRight: '0px' },
                                userSelect: "none",
                                borderSpacing: 0
                            }}
                        />
                    ),
                    TableHead: TableHead,
                    TableBody: React.forwardRef((props, ref) => (
                        <TableBody {...props} ref={ref} sx={{ '& .MuiTableCell-root': { textAlign: 'center', fontSize: '1.1rem' } }} />
                    )),
                    TableRow: (props) => {
                        const index = props['data-item-index'];
                        const solve = solves[index];

                        return (
                            <TableRow
                                {...props}
                                hover
                                onClick={() => openSolveDetailsScreen(solve)}
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover .MuiTableCell-root': {
                                        bgcolor: theme.palette.secondary.light
                                    },
                                    '.MuiTableCell-root': {
                                        bgcolor: theme.palette.secondary.main
                                    },
                                }}
                            />
                        );
                    }
                }}

                // 2. Define the Header
                fixedHeaderContent={() => (
                    <TableRow>
                        {HEAD_CELLS.slice(0, -2).map((headCell) => {
                            if (sortedSolves.length < headCell.minSolves) return null;

                            return (
                                <TableCell
                                    key={headCell.id}
                                    sortDirection={orderBy === headCell.id ? order : undefined}
                                    sx={{
                                        textAlign: 'center',
                                        fontSize: '1.3rem',
                                        fontWeight: "bold",
                                        borderColor: theme.palette.info.main,
                                        bgcolor: theme.palette.secondary.dark,
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? (order === 'desc' ? 'desc' : 'asc') : "asc"}
                                        onClick={() => handleSortRequest(headCell.id)}
                                        sx={{
                                            color: headCell.color,
                                            '&.Mui-active': { color: headCell.color },
                                            '&:hover': { color: headCell.color, opacity: 0.3 },
                                            '&.Mui-active .MuiTableSortLabel-icon': { color: headCell.color },
                                            '&:hover .Mui-active': { color: headCell.color },
                                            '&.MuiTableSortLabel-icon': { color: `${headCell.color} !important` }
                                        }}
                                    >
                                        {headCell.label}
                                    </TableSortLabel>
                                </TableCell>
                            );
                        })}
                    </TableRow>
                )}

                // 3. Define the Row Content
                itemContent={(index, solve) => (
                    <SolveRow
                        solve={solve}
                        bestStats={bestStats}
                        openSolveDetailsScreen={openSolveDetailsScreen}
                    />
                )}
            />
        </Box>
    );
}