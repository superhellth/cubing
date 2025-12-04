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
        <Paper elevation={0} sx={{
            flex: 4,
            marginTop: "1.5rem",
            bgcolor: theme.palette.primary.main,
            border: "1px solid #333333",
            borderRadius: "8px",
            display: "flex"
        }}>
            <TableVirtuoso
                data={sortedSolves}
                components={{
                    Scroller: React.forwardRef((props, ref) => (
                        <TableContainer component={Paper} {...props} ref={ref} sx={{
                            flex: 1,
                            '&::-webkit-scrollbar': { display: 'none' },
                            scrollbarWidth: 'none',
                            overflow: 'visible',
                            width: 'fit-content',
                            borderRadius: "8px",
                            bgcolor: "transparent",
                        }} />
                    )),
                    Table: (props) => (

                        <Table
                            {...props}
                            stickyHeader
                        // sx={{
                        //     tableLayout: 'fixed',
                        //     userSelect: "none",
                        // }}
                        />
                    ),
                    TableHead: TableHead,
                    TableBody: React.forwardRef((props, ref) => (
                        <TableBody {...props} ref={ref} sx={{
                            '& .MuiTableCell-root': {
                                textAlign: 'right',
                                fontSize: '1.05rem',
                                // p: 0,
                                fontFamily: '"JetBrains Mono", monospace',
                            },
                            // '&:last-child': { paddingRight: '16px', },
                        }} />
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
                                        bgcolor: "rgba(255, 255, 255, 0.04)"
                                    },
                                    '.MuiTableCell-root': {
                                        bgcolor: "transparent"
                                    },
                                    height: "50px"
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
                                    size='small'
                                    key={headCell.id}
                                    sortDirection={orderBy === headCell.id ? order : undefined}
                                    align={"right"}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        fontSize: '1.2rem',
                                        paddingLeft: 0,
                                        paddingTop: "16px",
                                        width: "10%",
                                        paddingBottom: "16px",
                                        fontWeight: "bold",
                                        bgcolor: theme.palette.primary.main,
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === headCell.id}
                                        direction={orderBy === headCell.id ? (order === 'desc' ? 'desc' : 'asc') : "asc"}
                                        onClick={() => handleSortRequest(headCell.id)}
                                        sx={{
                                            // flexDirection: "row-reverse",
                                            margin: 0,
                                            padding: 0,
                                            maxWidth: "60px",
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
        </Paper>
    );
}