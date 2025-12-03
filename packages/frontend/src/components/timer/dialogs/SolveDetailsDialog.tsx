import { Status, type ISolve } from "@cubing/shared";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { getDisplayableTime, getDisplayTime } from "../../../utils/solveUtils";

function SolveDetailsScreen({ solve, isOpen, onClose, onDeleteSolve, onUpdateStatus }: {
    solve: ISolve, isOpen: boolean, onClose: Function, onUpdateStatus: Function,
    onDeleteSolve: Function
}) {
    const [status, setStatus] = useState<Status>(solve.status);
    const date: Date = new Date(solve.date);
    const longFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    useEffect(() => {
        setStatus(solve.status);
    }, [solve]);

    const handleStatusChange = (_event: React.MouseEvent<HTMLElement>, newStatus: Status) => {
        setStatus(newStatus);
        onUpdateStatus(solve, newStatus);
    };

    return (
        <Dialog open={isOpen} sx={{ color: "red" }}>
            <DialogTitle sx={{ textAlign: "center", fontSize: "3rem", fontWeight: "bold" }}>Solve {solve.id}</DialogTitle>
            <DialogContent sx={{ textAlign: "center", display: "flex", flexDirection: "column" }}>

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
                <p>Scramble: {solve.scramble}</p>
                <p>Date: {longFormatter.format(date)}</p>
                <Box>
                    <Typography sx={{ color: "text.primary" }}>Single: {getDisplayTime(solve)}</Typography>
                    <Typography sx={{ color: "info.light" }}>Avg5: {getDisplayableTime(solve, "avg5")}</Typography>
                    <Typography sx={{ color: "info.dark" }}>Avg12: {getDisplayableTime(solve, "avg12")}</Typography>
                </Box>
                <FormControl sx={{
                    width: '100%',
                    alignItems: 'center',
                    marginTop: "1rem"
                }}>
                    <FormLabel sx={{ color: "text.primary", fontWeight: 'bold' }}>Solve Status</FormLabel>
                    <ToggleButtonGroup
                        value={status}
                        exclusive
                        onChange={handleStatusChange}
                        sx={{
                            justifyContent: 'center',
                            width: '100%'
                        }}
                    >
                        <ToggleButton value={Status.Valid} sx={{
                            '&.Mui-selected': {
                                backgroundColor: '#e8f5e9', color: 'green', '&:hover': {
                                    backgroundColor: '#e8f5e9',
                                }
                            }
                        }}>
                            Valid
                        </ToggleButton>
                        <ToggleButton value={Status.PlusTwo} sx={{
                            '&.Mui-selected': {
                                backgroundColor: '#fffde7', color: 'warning.main', '&:hover': {
                                    backgroundColor: '#e8f5e9',
                                }
                            }
                        }}>
                            +2
                        </ToggleButton>
                        <ToggleButton value={Status.DNF} sx={{
                            '&.Mui-selected': {
                                backgroundColor: '#ffebee', color: 'error.main', '&:hover': {
                                    backgroundColor: '#e8f5e9',
                                }
                            }
                        }}>
                            DNF
                        </ToggleButton>
                    </ToggleButtonGroup>
                </FormControl>
                <Button
                    sx={{ marginTop: "1rem" }}
                    onClick={() => setOpenDeleteDialog(true)}
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                >
                    Delete
                </Button>
            </DialogContent>
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle sx={{color: "error.main"}}>
                    Delete this solve?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this solve? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary" autoFocus>
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        onDeleteSolve(solve.pk, solve.uuid);
                        setOpenDeleteDialog(false)
                    }} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
}

export default SolveDetailsScreen;