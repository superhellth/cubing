import type { Solve } from '@cubing/shared';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography, useTheme, type SortDirection } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { SolveRow } from './SolveRow';
import { HEAD_CELLS } from './TimeDisplay';
import { SlideTableRow } from './SlideTableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

interface SolvesTableProps {
    solves: Solve[],
    bestStats: any,
    openSolveDetailsScreen: any
}

function descendingComparator(a: any, b: any, orderBy: any) {
    let valA = a[orderBy];
    let valB = b[orderBy];

    if (!isNaN(Number(valA)) && !isNaN(Number(valB))) {
        valA = Number(valA);
        valB = Number(valB);
    } else if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
    }

    if (valB < valA) return -1;
    if (valB > valA) return 1;
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
    const [selectedSolves, setSelectedSolves] = useState<BigInt[]>([]);

    const sortedSolves = useMemo(() => {
        return stableSort(solves, getComparator(order, orderBy));
    }, [solves, order, orderBy]);

    const handleSortRequest = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <TableVirtuoso
            data={sortedSolves}
            components={{
                Scroller: React.forwardRef((props, ref) => (
                    <TableContainer component={Paper} {...props} ref={ref} sx={{
                        '&::-webkit-scrollbar': { display: 'none' },
                        scrollbarWidth: 'none',
                        width: "max-content",
                        minWidth: "100%",
                        borderRadius: "8px",
                        bgcolor: "transparent",
                    }} />
                )),
                Table: (props) => (

                    <Table
                        {...props}
                        stickyHeader
                    />
                ),
                TableHead: TableHead,
                TableBody: React.forwardRef((props, ref) => (
                    <TableBody {...props} ref={ref} sx={{
                        '& .MuiTableCell-root': {
                            textAlign: 'right',
                            fontSize: '1.05rem',
                            fontFamily: "IBM Plex Mono",
                            overflow: 'visible',
                        },
                    }} />
                )),
                TableRow: (props) => {
                    const solve = props.item;

                    return (
                        <SlideTableRow
                            selected={selectedSolves.length > 0}
                            {...props}
                            onClick={() => openSolveDetailsScreen(solve)}
                            sx={{
                                cursor: 'pointer',
                                '&:hover .MuiTableCell-root': {
                                    bgcolor: "rgba(255, 255, 255, 0.04)"
                                },
                                '.MuiTableCell-root': {
                                    bgcolor: "transparent"
                                },
                                height: "50px",
                                overflow: 'visible',
                            }}
                        />
                    );
                }
            }}

            // 2. Define the Header
            fixedHeaderContent={() => {
                // 1. CONDITIONAL CHECK: Are items selected?
                if (selectedSolves.length > 0) {
                    return (
                        <TableRow sx={{ bgcolor: (theme) => theme.palette.primary.light }}> {/* Or any highlight color */}
                            <TableCell
                                // Span all columns: The ghost column + your data columns
                                colSpan={HEAD_CELLS.length + 1}
                                sx={{
                                    padding: '0 16px',
                                    height: '60px'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%'
                                }}>
                                    {/* LEFT: Selection Count */}
                                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                                        {selectedSolves.length} selected
                                    </Typography>

                                    {/* RIGHT: Actions */}
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {/* Example Action: Delete */}
                                        <IconButton onClick={() => console.log("delete")}>
                                            <DeleteIcon />
                                        </IconButton>

                                        {/* Example Action: Clear Selection */}
                                        <IconButton onClick={() => setSelectedSolves([])}>
                                            <CloseIcon />
                                        </IconButton>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                }

                // 2. DEFAULT HEADER (Your existing code)
                return (
                    <TableRow>
                        <>
                            <TableCell sx={{ width: 0, p: 0, m: 0 }} />
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
                                            fontSize: '1.3rem',
                                            paddingLeft: 0,
                                            paddingTop: "16px",
                                            overflow: 'visible',
                                            height: '60px',
                                            // width: "10%",
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

                        </>

                    </TableRow>
                );
            }}

            itemContent={(_index, solve) => (
                <SolveRow
                    updateSelectStatus={() => {
                        if (selectedSolves.includes(solve.pk)) {
                            setSelectedSolves(prev => prev.filter(id => id !== solve.pk));
                        } else {
                            setSelectedSolves(prev => [...prev, solve.pk]);
                        }
                    }}
                    isSelected={selectedSolves.includes(solve.pk)}
                    solve={solve}
                    bestStats={bestStats}
                    openSolveDetailsScreen={openSolveDetailsScreen}
                />
            )}
        />
    );
}