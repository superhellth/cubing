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

function SolveDetailsScreen({ solve, isOpen, onClose, onDeleteSolve, dbWriter }: {
    solve: ISolve, isOpen: boolean, onClose: Function,
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

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStatus = event.target.value as Status;
        setStatus(newStatus);
        solve.setStatus(newStatus);
        dbWriter.updateSolveStatus(solve);
    };

    return (
        <Dialog open={isOpen} sx={{ color: "red" }}>
            <DialogTitle sx={{ bgcolor: "primary.main", textAlign: "center", fontSize: "3rem", fontWeight: "bold" }}>Solve {solve.id}</DialogTitle>
            <DialogContent sx={{ bgcolor: "primary.main", textAlign: "center" }}>

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
                    <Typography sx={{color: "info.light"}}>Avg5: {}</Typography>
                    <Typography sx={{color: "info.dark"}}>Avg12: {}</Typography>
                </Box>
                <FormControl>
                    <FormLabel sx={{color: "text.primary"}}>Solve Status</FormLabel>
                    <RadioGroup
                        row
                        name="position"
                        value={status}
                        onChange={handleStatusChange}
                    >
                        <FormControlLabel
                            value={Status.Valid}
                            control={<Radio sx={{
                                color: "green",
                                '&.Mui-checked': {
                                    color: "green",
                                },
                            }} />}
                            label="Valid"
                        />
                        <FormControlLabel value={Status.PlusTwo} control={<Radio sx={{
                            color: "yellow",
                            '&.Mui-checked': {
                                color: "yellow",
                            },
                        }} />} label="+2" />
                        <FormControlLabel value={Status.DNF} control={<Radio sx={{
                            color: "red",
                            '&.Mui-checked': {
                                color: "red",
                            },
                        }} />} label="DNF" />
                    </RadioGroup>
                </FormControl>
                <button onClick={() => onDeleteSolve(solve.id)}>Delete</button>
            </DialogContent>
        </Dialog>
    );
}

export default SolveDetailsScreen;