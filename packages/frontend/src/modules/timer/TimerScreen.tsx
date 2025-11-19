import { Discipline, Status, type ISolve } from "@cubing/shared";
import "@fontsource/dseg7-classic/700.css";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DBReader from "../api/db_reader";
import DBWriter from "../api/db_writer";
import ScrambleGenerator from "../utils/scramble_generator";
import AvgGraphs from "./AvgGraphs";
import SolveDetailsScreen from "./SolveDetailsScreen";
import TimeDisplay from "./TimeDisplay";
import Timer from "./timer";
import TimerDisplay from "./TimerDisplay";
import { getDisplayableAvg12, getDisplayableAvg5, solveWithUpdatedStatus } from "../api/solveUtils";

const dbWriter: DBWriter = new DBWriter();
const dbReader: DBReader = new DBReader();
const scrambleGenerator: ScrambleGenerator = new ScrambleGenerator();

function TimerScreen({ selectedDiscipline }: { selectedDiscipline: Discipline }) {
    const [timerReady, setTimerReady] = useState<boolean>(false);
    const [currentScramble, setCurrentScramble] = useState<string>("");
    const [selectedSolve, setSelectedSolve] = useState<ISolve | null>();
    const [openedSolveDetailsDialog, setOpenedSolveDetailsDialog] = useState<boolean>(false);
    const [currentUUID, setCurrentUUID] = useState<string>(() => {
        const USER_ID_KEY = "userID";
        let uID = localStorage.getItem(USER_ID_KEY);
        if (!uID) {
            uID = crypto.randomUUID();
            localStorage.setItem(USER_ID_KEY, uID);
        }
        return uID;
    });
    const [time, setTime] = useState<number>(0);
    const [releasedAfterStop, setReleasedAfterStop] = useState<boolean>(true);
    const [running, setRunning] = useState<boolean>(false);
    const [solves, setSolves] = useState<ISolve[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const startTimeRef = useRef<number>(0);

    const useSolvesWithAverages = (solves: ISolve[]) => {
        return useMemo(() => {
            // 1. Pre-allocate the array size. This prevents the array from 
            // resizing dynamically as we push to it, which is faster.
            const processed = new Array(solves.length);

            // 2. Define a lightweight helper specifically for this loop
            // This avoids creating a new array like .slice() does.
            const calcAvg = (startIndex: number, length: number): number | null => {
                // Boundary check: Do we have enough solves remaining?
                if (startIndex + length > solves.length) return null;

                let sum = 0;
                let min = Infinity;
                let max = -Infinity;
                let dnfCount = 0;

                for (let i = 0; i < length; i++) {
                    const s = solves[startIndex + i];
                    if (s.status === Status.DNF) {
                        dnfCount++;
                        continue;
                    }

                    let time = s.duration;
                    if (s.status === Status.PlusTwo) {
                        time += 2000;
                    }

                    if (time < min) min = time;
                    if (time > max) max = time;
                    sum += time;
                }

                if (dnfCount > 1) {
                    return -1;
                }
                if (dnfCount === 1) {
                    return (sum - min) / (length - 2);
                }

                return (sum - min - max) / (length - 2);
            };

            // 4. The Main Loop (Single Pass)
            for (let i = 0; i < solves.length; i++) {
                processed[i] = {
                    ...solves[i],
                    // Calculate both in the same pass without creating temp arrays
                    avg5: calcAvg(i, 5),
                    avg12: calcAvg(i, 12),
                    avg100: calcAvg(i, 100),
                    avg1000: calcAvg(i, 1000)
                };
            }

            return processed;
        }, [solves]);
    };

    const processedSolves: ISolve[] = useSolvesWithAverages(solves);

    // Fetch user solves
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

    const handleUpdateSolveStatus = (oldSolve: ISolve, newStatus: Status) => {
        const updatedSolve: ISolve = solveWithUpdatedStatus(oldSolve, newStatus);
        dbWriter.updateSolveStatus(updatedSolve);
        setSolves(prevSolves => {
            return prevSolves.map(solve => {
                if (solve.id === updatedSolve.id) {
                    return updatedSolve;
                }
                return solve;
            });
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
                const solve: ISolve = await dbWriter.insertSolve({
                    uuid: currentUUID, duration: finalTime, date: new Date(), scramble: currentScramble,
                    discipline: selectedDiscipline, status: Status.Valid, session: "default"
                });
                setSolves(prevSolves => [solve, ...prevSolves]);
                setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));
            } else {
                setTimerReady(true);
            }
        }

        // Cancel solve on esc
        if (event.key === 'Escape') {
            if (running) {
                event.preventDefault();
                const finalTime = Date.now() - startTimeRef.current;
                setTime(finalTime);
                setRunning(false);
                setReleasedAfterStop(false);
                const solve: ISolve = await dbWriter.insertSolve({
                    uuid: currentUUID, duration: finalTime, date: new Date(), scramble: currentScramble,
                    discipline: selectedDiscipline, status: Status.DNF, session: "default"
                });
                setSolves(prevSolves => [solve, ...prevSolves]);
                setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));
            }
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
        let animationFrameId: number;

        if (running) {
            startTimeRef.current = Date.now();
            const tick = () => {
                setTime(Date.now() - startTimeRef.current);
                animationFrameId = requestAnimationFrame(tick);
            }
            tick();
        }

        return () => cancelAnimationFrame(animationFrameId);
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
    const getScrambleFontSize = (scramble: string) => {
        const len = scramble.split(" ").length;
        // 2x2, 3x3, Skewb, Pyraminx (Short)
        if (len < 40) return "2rem";

        // 4x4, 5x5 (Medium)
        if (len < 80) return "1.6rem";

        // 6x6, 7x7, Megaminx (Long)
        // These are massive text blocks, so we need small text
        return "1.3rem";
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", height: "100%", width: "100%" }}>
            <Box sx={{
                flex: 1, display: "flex", flexDirection: 'column', justifyContent: "space-around", bgcolor: "primary.main",
                paddingLeft: "75px", paddingRight: "75px", paddingTop: "2rem"
            }}>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ flex: 1, fontSize: getScrambleFontSize(currentScramble), fontFamily: "Space Mono, monospace" }}>{currentScramble}</Typography>
                </Box>
                <Box sx={{ flex: 5, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                    <Box sx={{ flex: 4, display: "grid", alignItems: "center" }}>
                        <TimerDisplay time={time} timerReady={timerReady} />
                    </Box>
                    <Box sx={{ flex: 1, display: "grid", alignItems: "center", marginBottom: "3rem" }}>
                        <Typography sx={{ fontSize: "3rem", fontFamily: "Space Mono", color: "info.light" }}>
                            Ao5: {processedSolves[0]?.avg5 ? getDisplayableAvg5(processedSolves[0]) : "-"}
                        </Typography>
                        <Typography sx={{ fontSize: "3rem", fontFamily: "Space Mono", color: "info.dark" }}>
                            Ao12: {processedSolves[0]?.avg12 ? getDisplayableAvg12(processedSolves[0]) : "-"}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ flex: 1, }}>
                    <AvgGraphs solves={processedSolves} />
                </Box>
            </Box>
            <Divider orientation="vertical" sx={{ bgcolor: "info.main" }} flexItem component="div" />
            <Box sx={{ bgcolor: "secondary.main", height: "100%", margin: 0, padding: 0 }}>
                <TimeDisplay solves={processedSolves} openSolveDetailsScreen={openSolveDetailsScreen} />
            </Box>
            {selectedSolve && (
                <SolveDetailsScreen solve={selectedSolve} onDeleteSolve={deleteSolve} onUpdateStatus={handleUpdateSolveStatus} isOpen={openedSolveDetailsDialog}
                    onClose={() => { setOpenedSolveDetailsDialog(false) }} dbWriter={dbWriter}></SolveDetailsScreen>
            )}
        </Box>

    );
}

export default TimerScreen;