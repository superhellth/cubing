import TableHead from "@mui/material/TableHead";
import type Solve from "../api/solve";
import Timer from "./timer";
import Table from '@mui/material/Table';
import Box from '@mui/system/Box';
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

function TimeDisplay({ solves, deleteSolve, openSolveDetailsScreen, avg5s, avg12s }:
    { solves: Solve[], deleteSolve: Function, openSolveDetailsScreen: Function, avg5s: (number | null)[], avg12s: (number | null)[] }) {
    const filteredAvg5s: number[] = avg5s.filter((item): item is number => item !== null);
    const filteredAvg12s: number[] = avg12s.filter((item): item is number => item !== null);
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>

            <Box style={{ flex: 1 }}>
                <h1>Your Solves</h1>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Best</TableCell>
                            <TableCell>Current</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Mean of 3</TableCell>
                            <TableCell>{solves.length >= 3 ? "TBI" : ""}</TableCell>
                            <TableCell>{solves.length >= 3 ? Timer.formatTime(Timer.getAvg(solves.slice(-3))) : ""}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Avg. of 5</TableCell>
                            <TableCell>{solves.length >= 5 ? Timer.formatTime(Math.min(...filteredAvg5s)) : ""}</TableCell>
                            <TableCell>{solves.length >= 5 ? Timer.formatTime(avg5s[0]) : ""}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Avg. of 12</TableCell>
                            <TableCell>{solves.length >= 12 ? Timer.formatTime(Math.min(...filteredAvg12s)) : ""}</TableCell>
                            <TableCell>{solves.length >= 12 ? Timer.formatTime(avg12s[0]) : ""}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>

            <Box sx={{ flex: 2, overflow: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Avg5</TableCell>
                            <TableCell>Avg12</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {solves.map((solve, index) => (
                            <TableRow key={solve.id} onClick={() => openSolveDetailsScreen(solve)}>
                                <TableCell>
                                    {solves.length - index}
                                </TableCell>
                                <TableCell>
                                    {Timer.formatTime(solve.duration)}
                                </TableCell>
                                <TableCell>
                                    {Timer.formatTime(avg5s[index])}
                                </TableCell>
                                <TableCell>
                                    {Timer.formatTime(avg12s[index])}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
}

export default TimeDisplay;