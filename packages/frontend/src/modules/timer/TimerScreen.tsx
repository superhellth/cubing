import { useCallback, useEffect, useRef, useState } from "react";
import TimeDisplay from "./TimeDisplay";
import Timer from "./timer";
import DBWriter from "../api/db_writer";
import User from "../api/user";
import Solve from "../api/solve";
import { Discipline, DISCIPLINE_LABELS, type ISolve, type IUser } from "@cubing/shared";
import DBReader from "../api/db_reader";
import ScrambleGenerator from "../utils/scramble_generator";

function TimerScreen() {
    const [currentScramble, setCurrentScramble] = useState<string>("");
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

    const deleteSolve = function (solveID: number) {
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
                const solve: ISolve = await dbWriter.insertSolve(new Solve("superhellth", finalTime, new Date(), currentScramble, selectedDiscipline));
                setSolves(prevSolves => [...prevSolves, solve]);
                setCurrentScramble(scrambleGenerator.generateScramble(20));
            }
        }

        // Cancel solve on esc
        if (event.key === 'Escape') {
            event.preventDefault();
            setRunning(false);
            setTime(0);
        }
    }, [running, dbWriter, currentScramble, selectedDiscipline]); // Removed time, Solve and Discipline

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

    // Load all solves on startup
    useEffect(() => {
        const fetchUserSolves = async (user: IUser) => {
            try {
                setLoading(true);
                const fetchedSolves = await dbReader.getAllUserSolves(user, selectedDiscipline);
                setSolves(fetchedSolves);
            } catch (error) {
                console.error("Failed to fetch solves:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserSolves(new User("superhellth", new Date()));
        setCurrentScramble(scrambleGenerator.generateScramble(20));
    }, []);

    const divWrapper = {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "blue",
        height: "100%",
        width: "100%"
    }

    return (
        <div style={divWrapper}>
            <div style={{ flex: 1, backgroundColor: "green", height: "100%", margin: 0, padding: 0 }}>
                <TimeDisplay solves={solves} deleteSolve={deleteSolve} />
            </div>
            <div style={{ flex: 3, backgroundColor: "red" }}>
                <div style={{backgroundColor: "orange", width: "100%"}}>
                    <select id="discipline-select" value={selectedDiscipline} onChange={(event) => {setSelectedDiscipline(event.target.value as Discipline)}}>
                        {DISCIPLINE_LABELS.map((discipline) => (
                            <option key={discipline.key} value={discipline.value}>
                                {discipline.key}
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
        </div>

    );
}

export default TimerScreen;