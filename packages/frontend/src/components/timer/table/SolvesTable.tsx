import type { Solve } from '@cubing/shared';
import { Paper, Table, TableBody, TableContainer, TableHead, type SortDirection } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { TableVirtuoso } from 'react-virtuoso';
import { SlideTableRow } from './SlideTableRow';
import { SolveRow } from './SolveRow';
import SolvesTableHeader from './SolvesTableHeader';

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
    const [selectedSolves, setSelectedSolves] = useState<bigint[]>([]);
    const [shiftIsHeld, setShiftIsHeld] = useState<boolean>(false);

    const sortedSolves = useMemo(() => {
        return stableSort(solves, getComparator(order, orderBy));
    }, [solves, order, orderBy]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                event.preventDefault();
                setShiftIsHeld(true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
                event.preventDefault();
                setShiftIsHeld(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

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
                return (
                    <SolvesTableHeader numSolves={sortedSolves.length} selectedSolves={selectedSolves}
                        selectAll={() => setSelectedSolves(solves.map(s => s.pk))} unselectAll={() => setSelectedSolves([])}
                        handleSortRequest={handleSortRequest} orderBy={orderBy} order={order} />
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
                        // Select all from last selected
                        if (shiftIsHeld) {
                            const lastSelectedIndex: number = sortedSolves.length - [...sortedSolves].reverse().findIndex(s => selectedSolves.includes(s.pk)) - 1;
                            const currentIndex: number = sortedSolves.findIndex(s => s.pk == solve.pk);
                            const pksBetween: bigint[] = sortedSolves.slice(lastSelectedIndex + 1, currentIndex).map(s => s.pk);
                            setSelectedSolves(prev => [...prev, ...pksBetween]);
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