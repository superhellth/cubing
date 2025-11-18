import { Discipline, DISCIPLINE_LABELS, Status, type ISolve } from "@cubing/shared";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from '@mui/material/Select';
import { Box } from "@mui/system";
import { LineChart } from "@mui/x-charts";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DBReader from "../api/db_reader";
import DBWriter from "../api/db_writer";
import Solve from "../api/solve";
import ScrambleGenerator from "../utils/scramble_generator";
import SolveDetailsScreen from "./SolveDetailsScreen";
import TimeDisplay from "./TimeDisplay";
import Timer from "./timer";
import "@fontsource/dseg7-classic/700.css";
import AvgGraphs from "./AvgGraphs";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

function TimerScreen({ selectedDiscipline }: { selectedDiscipline: Discipline }) {
    const [timerReady, setTimerReady] = useState<boolean>(false);
    const [currentScramble, setCurrentScramble] = useState<string>("");
    const [selectedSolve, setSelectedSolve] = useState<ISolve | null>();
    const [openedSolveDetailsDialog, setOpenedSolveDetailsDialog] = useState<boolean>(false);
    const [currentUUID, setCurrentUUID] = useState<string>("");
    const [time, setTime] = useState<number>(0);
    const [releasedAfterStop, setReleasedAfterStop] = useState<boolean>(true);
    const [running, setRunning] = useState<boolean>(false);
    const [solves, setSolves] = useState<ISolve[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const timerRef = useRef(0);
    const startTimeRef = useRef<number>(0);
    const dbWriter: DBWriter = new DBWriter();
    const dbReader: DBReader = new DBReader();
    const scrambleGenerator: ScrambleGenerator = new ScrambleGenerator();

    const USER_ID_KEY = "userID";

    const useSolvesWithAverages = (solves: ISolve[]) => {
        return useMemo(() => {
            return solves.map((solve, index) => {
                let ao5: number | null = null;
                if (index + 5 <= solves.length) {
                    const chunk = solves.slice(index, index + 5);
                    ao5 = Timer.getFilteredAvg(chunk);
                }

                let ao12: number | null = null;
                if (index + 12 <= solves.length) {
                    const chunk = solves.slice(index, index + 12);
                    ao12 = Timer.getFilteredAvg(chunk);
                }
                return {
                    ...solve,
                    avg5: ao5,
                    avg12: ao12
                };
            });
        }, [solves]);
    };

    const processedSolves: ISolve[] = useSolvesWithAverages(solves);

    const useCleanAverages = (averages: (number | null | undefined)[]) => {
        return useMemo(() => {

            return [...averages.filter(value => value !== null && value !== undefined)].reverse().map(value => value / 1000);
        }, [averages]);
    }

    const cleanedAvg5: number[] = useCleanAverages(solves.map(solve => solve.avg5));
    const cleanedAvg12: number[] = useCleanAverages(solves.map(solve => solve.avg12));

    useEffect(() => {
        setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));

        // Check if user has visited before
        function getOrCreateUserId(): string {
            let uID: string | null = localStorage.getItem(USER_ID_KEY);
            if (!uID) {
                uID = crypto.randomUUID();
                localStorage.setItem(USER_ID_KEY, uID);
            }
            return uID;
        }

        const uID: string = getOrCreateUserId();
        setCurrentUUID(uID);
    }, []);

    useEffect(() => {
        if (!currentUUID) {
            return;
        }
        async function fetchUserSolves() {
            try {
                setLoading(true);
                const fetchedSolves = await dbReader.getAllUserSolves(currentUUID, selectedDiscipline);
                setSolves(fetchedSolves);
            } catch (error) {
                console.error("Failed to fetch solves:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserSolves();
        setTime(0);
        setRunning(false);
        setReleasedAfterStop(true);
        setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));

    }, [currentUUID, selectedDiscipline]);


    const deleteSolve = (solveID: number) => {
        setOpenedSolveDetailsDialog(false);
        dbWriter.deleteSolve(solveID);
        setSolves(prevSolves => {
            return prevSolves.filter(solve => solve.id !== solveID);
        });
    }

    const handleKeyDown = useCallback(async (event: KeyboardEvent) => {
        // Stop timer on space down
        if (event.code === 'Space') {
            event.preventDefault();
            if (running) {
                const finalTime = Date.now() - startTimeRef.current;
                setTime(finalTime);
                setRunning(false);
                setReleasedAfterStop(false);
                const solve: ISolve = await dbWriter.insertSolve(new Solve({
                    uuid: currentUUID, duration: finalTime, date: new Date(), scramble: currentScramble,
                    discipline: selectedDiscipline, status: Status.Valid, session: "default"
                }));
                setSolves(prevSolves => [solve, ...prevSolves]);
                setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));
            } else {
                setTimerReady(true);
            }
        }

        // Cancel solve on esc
        if (event.key === 'Escape') {
            event.preventDefault();
            setRunning(false);
            setTime(0);
        }
    }, [running, dbWriter, currentScramble, selectedDiscipline]);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        // Start solve on space up
        if (!running) {
            if (event.code === "Space") {
                setTimerReady(false);
                if (releasedAfterStop) {
                    setRunning(true);
                } else {
                    setReleasedAfterStop(true);
                }
            }
        }
    }, [running, releasedAfterStop]);

    // Timer logic
    useEffect(() => {
        if (running) {
            setTime(0);
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setTime(Date.now() - startTimeRef.current);
            }, 10);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [running]);

    // Register keyboard listeners
    useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown)
        };
    }, [handleKeyDown, handleKeyUp])


    const openSolveDetailsScreen = (solve: ISolve) => {
        setSelectedSolve(solve);
        setOpenedSolveDetailsDialog(true);
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", height: "100%", width: "100%" }}>
            <Box sx={{
                flex: 1, display: "flex", flexDirection: 'column', justifyContent: "space-around", bgcolor: "primary.main",
                paddingLeft: "75px", paddingRight: "75px", paddingTop: "2rem"
            }}>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ flex: 1, fontSize: "2rem", fontFamily: "Space Mono, monospace" }}>{currentScramble}</Typography>
                </Box>
                <Box sx={{ flex: 5, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                    <Box sx={{ flex: 4, display: "grid", alignItems: "center" }}>
                        <Typography sx={{
                            fontSize: "15rem", "-webkit-user-select": "none", "-moz-user-select": "none", "-ms-user-select": "none", "user-select": "none",
                            fontFamily: "DSEG7 Classic, monospace", transform: "translateZ(0)", textAlign: "center", color: timerReady ? "info.main" : "text.main"
                        }}>
                            {Timer.formatTime(time)}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1, display: "grid", alignItems: "center", marginBottom: "3rem" }}>
                        <Typography sx={{ fontSize: "3rem", fontFamily: "Space Mono", color: "info.light" }}>
                            Ao5: {processedSolves[0]?.avg5 ? Timer.formatTime(processedSolves[0].avg5) : "-"}
                        </Typography>
                        <Typography sx={{ fontSize: "3rem", fontFamily: "Space Mono", color: "info.dark" }}>
                            Ao12: {processedSolves[0]?.avg12 ? Timer.formatTime(processedSolves[0].avg12) : "-"}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ flex: 1, }}>
                    <AvgGraphs avg5s={cleanedAvg5} avg12s={cleanedAvg12} />
                </Box>
            </Box>
            <Divider orientation="vertical" sx={{ bgcolor: "info.main" }} flexItem component="div" />
            <Box sx={{ bgcolor: "secondary.main", height: "100%", margin: 0, padding: 0 }}>
                <TimeDisplay solves={processedSolves} openSolveDetailsScreen={openSolveDetailsScreen} />
            </Box>
            {selectedSolve && (
                <SolveDetailsScreen solve={selectedSolve} onDeleteSolve={deleteSolve} isOpen={openedSolveDetailsDialog}
                    onClose={() => { setOpenedSolveDetailsDialog(false) }} dbWriter={dbWriter}></SolveDetailsScreen>
            )}
        </Box>

    );
}

export default TimerScreen;