import { Discipline, DISCIPLINE_LABELS, Status, type ISolve } from "@cubing/shared";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DBReader from "../api/db_reader";
import DBWriter from "../api/db_writer";
import Solve from "../api/solve";
import ScrambleGenerator from "../utils/scramble_generator";
import SolveDetailsScreen from "./SolveDetailsScreen";
import TimeDisplay from "./TimeDisplay";
import Timer from "./timer";
import { LineChart } from "@mui/x-charts";

function TimerScreen() {
    const [currentScramble, setCurrentScramble] = useState<string>("");
    const [selectedSolve, setSelectedSolve] = useState<ISolve | null>();
    const [openedSolveDetailsDialog, setOpenedSolveDetailsDialog] = useState<Boolean>(false);
    const [currentUUID, setCurrentUUID] = useState<string>("");
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(Discipline.ThreeByThree);
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

    const calculateAverages = (solves: ISolve[], chunkSize: number) => {
        return solves.map((solve, index) => {
            if (index + chunkSize > solves.length) {
                return null;
            }
            const chunk = solves.slice(index, index + chunkSize);
            const currentAvg = Timer.getFilteredAvg(chunk);
            return currentAvg;
        });
    }
    const useRollingAverage = (solves: ISolve[], chunkSize: number) => {
        return useMemo(() => {
            return calculateAverages(solves, chunkSize);
        }, [solves, chunkSize]);
    }
    const averagesOfFive: (number | null)[] = useRollingAverage(solves, 5);
    const averagesOfTwelve: (number | null)[] = useRollingAverage(solves, 12);

    useEffect(() => {
        setCurrentScramble(scrambleGenerator.generateScramble(20));

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
    }, [currentUUID, selectedDiscipline]);

    const deleteSolve = (solveID: number) => {
        setOpenedSolveDetailsDialog(false);
        dbWriter.deleteSolve(solveID);
        setSolves(prevSolves => {
            return prevSolves.filter(solve => solve.id !== solveID);
        });
    }

    const onDisciplineSelected = (event: any) => {
        setSelectedDiscipline(event.target.value as Discipline);
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
                const solve: ISolve = await dbWriter.insertSolve(new Solve(currentUUID, finalTime, new Date(), currentScramble, selectedDiscipline, Status.Valid));
                setSolves(prevSolves => [solve, ...prevSolves]);
                setCurrentScramble(scrambleGenerator.generateScramble(20));
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

    const divWrapper = {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "blue",
        height: "100%",
        width: "100%"
    }

    const openSolveDetailsScreen = (solve: ISolve) => {
        setSelectedSolve(solve);
        setOpenedSolveDetailsDialog(true);
    };

    return (
        <div style={divWrapper}>
            <div style={{ flex: 1, backgroundColor: "green", height: "100%", margin: 0, padding: 0 }}>
                <TimeDisplay solves={solves} deleteSolve={deleteSolve} openSolveDetailsScreen={openSolveDetailsScreen} avg5s={averagesOfFive} avg12s={averagesOfTwelve} />
            </div>
            <div style={{ flex: 3, backgroundColor: "red" }}>
                <div style={{ backgroundColor: "orange", width: "100%" }}>
                    <select id="discipline-select" value={selectedDiscipline} onChange={onDisciplineSelected}>
                        {DISCIPLINE_LABELS.map((discipline) => (
                            <option key={discipline.key} value={discipline.value}>
                                {discipline.value}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <div>
                        <p>{currentScramble}</p>
                    </div>
                    <h1>Spacebar Timer</h1>
                    <div>
                        {Timer.formatTime(time)}
                    </div>
                    <p>
                        Press <span className="font-semibold text-white">Spacebar</span> to{" "}
                        {running ? "pause" : "start"} the timer.
                    </p>
                </div>
            </div>
            {selectedSolve && (
                <SolveDetailsScreen solve={selectedSolve} onDeleteSolve={deleteSolve} isOpen={openedSolveDetailsDialog} onClose={() => { setOpenedSolveDetailsDialog(false) }}></SolveDetailsScreen>
            )}
            <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                    {
                        data: [2, 5.5, 2, 8.5, 1.5, 5],
                    },
                ]}
                height={300}
            />
        </div>

    );
}

export default TimerScreen;