import { IconButton, TableCell, TableRow, TableSortLabel, Tooltip, Typography } from "@mui/material";
import theme from "../../../styles/theme";
import ConfirmDeleteManyDialog from "../../dialogs/ConfirmDeleteManyDialog";
import { HEAD_CELLS } from "./TimeDisplay";
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import { useSolves } from "../../../contexts/SolveContext";

interface SolvesTableHeaderProps {
    numSolves: number,
    selectedSolves: bigint[],
    selectAll: Function,
    unselectAll: Function,
    handleSortRequest: Function,
    orderBy: any,
    order: any
}

function SolvesTableHeader({ numSolves, selectedSolves, selectAll, unselectAll, handleSortRequest, orderBy, order }: SolvesTableHeaderProps) {
    const [confirmDeleteDialogIsOpen, setConfirmDeleteDialogIsOpen] = useState<boolean>(false);
    const { deleteMany } = useSolves();

    if (selectedSolves.length > 0) {
        return (
            <>
                <TableRow>
                    <TableCell
                        colSpan={HEAD_CELLS.length + 1}
                        sx={{
                            padding: '0 16px',
                            height: '60px',
                            bgcolor: theme.palette.primary.main
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
                                <Tooltip title="Select All" placement='top' arrow>
                                    <IconButton sx={{ color: theme.palette.text.primary }} onClick={() => selectAll()}>
                                        <DoneAllIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Solves" placement='top' arrow>
                                    <IconButton sx={{ color: theme.palette.error.main }} onClick={() => setConfirmDeleteDialogIsOpen(true)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Unselect" placement='top' arrow>
                                    <IconButton sx={{ color: theme.palette.text.primary }} onClick={() => unselectAll()}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
                <ConfirmDeleteManyDialog isOpen={confirmDeleteDialogIsOpen} onClose={() => setConfirmDeleteDialogIsOpen(false)}
                    onConfirm={() => {
                        deleteMany(selectedSolves);
                        unselectAll();
                    }} />
            </>
        );
    }

    return (
        <TableRow>
            <>
                <TableCell sx={{ width: 0, p: 0, m: 0 }} />
                {HEAD_CELLS.slice(0, -2).map((headCell) => {
                    if (numSolves < headCell.minSolves) return null;
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
}

export default SolvesTableHeader;