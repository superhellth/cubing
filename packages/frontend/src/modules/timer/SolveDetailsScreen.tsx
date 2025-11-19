import { Status, type ISolve } from "@cubing/shared";
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useEffect, useState } from "react";
import type DBWriter from "../api/db_writer";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { getDisplayableAvg12, getDisplayableAvg5, solveWithUpdatedStatus } from "../api/solveUtils";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

function SolveDetailsScreen({ solve, isOpen, onClose, onDeleteSolve, dbWriter, onUpdateStatus }: {
    solve: ISolve, isOpen: boolean, onClose: Function, onUpdateStatus: Function,
    onDeleteSolve: Function, dbWriter: DBWriter
}) {
    const [status, setStatus] = useState<Status>(solve.status);
    const date: Date = new Date(solve.date);
    const longFormatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    useEffect(() => {
        setStatus(solve.status);
    }, [solve]);

    const handleStatusChange = (event: React.MouseEvent<HTMLElement>, newStatus: Status) => {
        setStatus(newStatus);
        onUpdateStatus(solve, newStatus);
    };

    return (
        <Dialog open={isOpen} sx={{ color: "red" }}>
            <DialogTitle sx={{ bgcolor: "primary.main", textAlign: "center", fontSize: "3rem", fontWeight: "bold" }}>Solve {solve.id}</DialogTitle>
            <DialogContent sx={{ bgcolor: "primary.main", textAlign: "center", display: "flex", flexDirection: "column" }}>

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
                    <Typography sx={{ color: "info.light" }}>Avg5: {getDisplayableAvg5(solve)}</Typography>
                    <Typography sx={{ color: "info.dark" }}>Avg12: {getDisplayableAvg12(solve)}</Typography>
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
                        <ToggleButton value={Status.Valid} sx={{ '&.Mui-selected': { backgroundColor: '#e8f5e9', color: 'green' } }}>
                            Valid
                        </ToggleButton>
                        <ToggleButton value={Status.PlusTwo} sx={{ '&.Mui-selected': { backgroundColor: '#fffde7', color: '#fbc02d' } }}>
                            +2
                        </ToggleButton>
                        <ToggleButton value={Status.DNF} sx={{ '&.Mui-selected': { backgroundColor: '#ffebee', color: 'red' } }}>
                            DNF
                        </ToggleButton>
                    </ToggleButtonGroup>
                </FormControl>
                <Button
                    sx={{ marginTop: "1rem" }}
                    onClick={() => onDeleteSolve(solve.id)}
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                >
                    Delete
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default SolveDetailsScreen;