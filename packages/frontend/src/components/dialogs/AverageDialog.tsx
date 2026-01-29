import { type Solve } from "@cubing/shared";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, useTheme } from "@mui/material";
import { useSolves } from "../../contexts/SolveContext";
import { getDisplayableTime } from "../../utils/solveUtils";

interface AverageDialogProps {
    isOpen: boolean;
    onClose: any;
    solve: Solve;
    avgKey: any;
}

function AverageDialog({ isOpen, onClose, solve, avgKey }: AverageDialogProps) {

    const theme = useTheme();
    const { getSolvesOfAverage } = useSolves();
    const relevantSolves: Solve[] = getSolvesOfAverage(solve, avgKey)
    const grossDurations: number[] = relevantSolves.map(s => { if (!s.grossDuration) { return Infinity } return s.grossDuration }).sort();
    const slowest: number = grossDurations[grossDurations.length - 1];
    const fastest: number = grossDurations[0];

    const isExtreme = (s: Solve) => {
        if (!s.grossDuration) return true;
        return (s.grossDuration == slowest) || (s.grossDuration == fastest);
    }

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
        >
            <DialogTitle sx={{ color: theme.palette.info.main, display: 'flex', alignItems: 'center', gap: 1 }}>
                Average of {avgKey == "avg5" ? "5" : "12"}: {getDisplayableTime(solve, avgKey)}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Scramble</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {relevantSolves.map((solve: Solve, i: number) => {
                                return (
                                    <TableRow>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell sx={{ textWrap: "nowrap" }}>
                                            {isExtreme(solve) ? "(" : ""} {getDisplayableTime(solve, "duration")} {isExtreme(solve) ? ")" : ""}
                                        </TableCell>
                                        <TableCell>{solve.scramble}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="contained" disableElevation color="info">
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AverageDialog;