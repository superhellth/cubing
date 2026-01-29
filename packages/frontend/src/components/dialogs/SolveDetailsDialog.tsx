import { Status, type Solve } from "@cubing/shared";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Divider, IconButton, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { Box, Stack, useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import { useSolves } from "../../contexts/SolveContext";
import { getDisplayableTime } from "../../utils/solveUtils";
import AverageDialog from "./AverageDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import { AverageSurface } from "./SolveDetailsDialog.styles";
import { getDisplayableDate } from "../../utils/formatUtils";

function SolveDetailsScreen({ solve, isOpen, onClose, onUpdateStatus, onDeleteSolve }: {
    solve: Solve, isOpen: boolean, onClose: Function, onUpdateStatus: Function, onDeleteSolve: Function
}) {
    const theme = useTheme();
    const [status, setStatus] = useState<Status>(solve.status);
    const date: Date = new Date(solve.date);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [avgDialogIsOpen, setAvgDialogIsOpen] = useState<boolean>(false);
    const [averageDialogKey, setAverageDialogKey] = useState<"avg5" | "avg12" | null>(null);
    const { deleteSolve } = useSolves();

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
                                    {getDisplayableDate(date)}
                                </Typography>
                            </Stack>
                            {solve.importKey &&
                                <Typography variant="caption" color="text.secondary">
                                    Imported from {solve.importSource}
                                </Typography>
                            }
                        </Box>

                        {/* SCRAMBLE BOX */}
                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover', borderColor: 'divider', borderRadius: "10px" }}>
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
                        <Stack direction="row" justifyContent="space-around">
                            <AverageSurface>
                                <Typography variant="caption" color={theme.palette.text.secondary}>Single</Typography>
                                <Typography variant="h6">{getDisplayableTime(solve, "duration")}</Typography>
                            </AverageSurface>
                            <AverageSurface onClick={() => {setAverageDialogKey("avg5"); setAvgDialogIsOpen(true)}}>
                                <Typography variant="caption" color="text.secondary">Ao5</Typography>
                                <Typography variant="h6" color={theme.palette.info.light}>{getDisplayableTime(solve, "avg5")}</Typography>
                            </AverageSurface>
                            <AverageSurface onClick={() => {setAverageDialogKey("avg12"); setAvgDialogIsOpen(true)}}>
                                <Typography variant="caption" color="text.secondary">Ao12</Typography>
                                <Typography variant="h6" color={theme.palette.info.dark}>{getDisplayableTime(solve, "avg12")}</Typography>
                            </AverageSurface>
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
                    </Stack>
                </DialogContent>
            </Dialog>

            {/* DELETE CONFIRMATION */}
            <ConfirmationDialog
                isOpen={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={() => { deleteSolve(solve.pk, solve.uuid); onDeleteSolve(solve.pk); onClose() }}
                icon={<DeleteIcon />}
                title="Delete Solve?"
                text="This will permanently remove this time from your history and recalculate your averages."
            />

            <AverageDialog isOpen={avgDialogIsOpen}
                avgKey={averageDialogKey}
                onClose={() => setAvgDialogIsOpen(false)}
                solve={solve} />
        </>
    );
}

export default SolveDetailsScreen;