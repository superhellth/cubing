import { Status, type Solve } from "@cubing/shared";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider, IconButton, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { Box, Stack, useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import DeleteManyDialog from "./DeleteManyDialog";
import { getDisplayableTime } from "../../utils/solveUtils";

function SolveDetailsScreen({ solve, isOpen, onClose, onDeleteSolve, onDeleteMany, onUpdateStatus }: {
    solve: Solve, isOpen: boolean, onClose: Function, onUpdateStatus: Function,
    onDeleteSolve: Function, onDeleteMany: Function
}) {
    const theme = useTheme();
    const [status, setStatus] = useState<Status>(solve.status);
    const date: Date = new Date(solve.date);
    const longFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openDeleteManyDialog, setOpenDeleteManyDialog] = useState(false);

    useEffect(() => {
        setStatus(solve.status);
    }, [solve]);

    const handleStatusChange = (_event: React.MouseEvent<HTMLElement>, newStatus: Status) => {
        if (newStatus !== null) {
            setStatus(newStatus);
            onUpdateStatus(solve, newStatus);
        }
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={() => onClose()}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0 }}>
                    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5 }}>
                        Solve {solve.id}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => onClose()}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8, color: "secondary.light",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={3} mt={1}>
                        <Box textAlign="center">
                            <Typography variant="h2" fontWeight="700" color="text.primary">
                                {getDisplayableTime(solve, "duration")}
                            </Typography>
                            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mt={1}>
                                <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                    {longFormatter.format(date)}
                                </Typography>
                            </Stack>
                        </Box>

                        {/* SCRAMBLE BOX */}
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover', borderColor: 'divider' }}>
                            <Typography
                                variant="body2"
                                fontFamily="monospace"
                                textAlign="center"
                                color={theme.palette.text.primary}
                                sx={{ wordBreak: 'break-word' }}
                            >
                                {solve.scramble}
                            </Typography>
                        </Paper>

                        {/* STATS GRID */}
                        <Stack direction="row" justifyContent="space-around" divider={<Divider orientation="vertical" flexItem />}>
                            <Box textAlign="center">
                                <Typography variant="caption" color={theme.palette.text.secondary}>Single</Typography>
                                <Typography variant="h6">{getDisplayableTime(solve, "duration")}</Typography>
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="caption" color="text.secondary">Ao5</Typography>
                                <Typography variant="h6" color={theme.palette.info.light}>{getDisplayableTime(solve, "avg5")}</Typography>
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="caption" color="text.secondary">Ao12</Typography>
                                <Typography variant="h6" color={theme.palette.info.dark}>{getDisplayableTime(solve, "avg12")}</Typography>
                            </Box>
                        </Stack>

                        <Divider />

                        {/* CONTROLS */}
                        <Box>
                            <Typography variant="subtitle2" gutterBottom>Status</Typography>
                            <ToggleButtonGroup
                                value={status}
                                exclusive
                                onChange={handleStatusChange}
                                fullWidth
                                size="small"
                                sx={{ display: 'flex', gap: 1 }}
                            >
                                <ToggleButton value={Status.Valid} color={theme.palette.success} sx={{
                                    flex: 1,
                                    '&.Mui-selected': {
                                        color: theme.palette.success.main,
                                    }
                                }}>
                                    OK
                                </ToggleButton>
                                <ToggleButton value={Status.PlusTwo} color={theme.palette.warning} sx={{
                                    flex: 1,
                                    '&.Mui-selected': {
                                        color: theme.palette.warning.main,
                                    }
                                }}>
                                    +2
                                </ToggleButton>
                                <ToggleButton value={Status.DNF} color="error" sx={{
                                    flex: 1,
                                    '&.Mui-selected': {
                                        color: theme.palette.error.main,
                                    }
                                }}>
                                    DNF
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => setOpenDeleteManyDialog(true)}
                                fullWidth
                                sx={{ borderRadius: 2, textTransform: 'none', flex: 1 }}
                            >
                                Delete Many
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => setOpenDeleteDialog(true)}
                                fullWidth
                                sx={{ borderRadius: 2, textTransform: 'none', flex: 2 }}
                            >
                                Delete Solve
                            </Button>
                        </Box>
                    </Stack>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRMATION */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                PaperProps={{ sx: { borderRadius: 3, border: `1px solid ${theme.palette.error.dark}` } }}
            >
                <DialogTitle sx={{ color: "error.main", display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeleteIcon /> Delete Solve?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will permanently remove this time from your history and recalculate your averages.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onDeleteSolve(solve.pk, solve.uuid);
                            setOpenDeleteDialog(false);
                        }}
                        variant="contained"
                        color="error"
                        disableElevation
                    >
                        Confirm Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <DeleteManyDialog isOpen={openDeleteManyDialog} handleClose={() => {setOpenDeleteManyDialog(false);}}
                deleteMany={(deleteX: number) => {onDeleteMany(solve.pk, deleteX); onClose();}} />
        </>
    );
}

export default SolveDetailsScreen;