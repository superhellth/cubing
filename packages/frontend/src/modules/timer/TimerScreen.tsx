import { useCallback, useEffect, useRef, useState } from "react";
import TimeDisplay from "./TimeDisplay";
import Timer from "./timer";
import DBWriter from "../api/db_writer";
import User from "../api/user";
import Solve from "../api/solve";
import { Discipline, type ISolve, type IUser } from "@cubing/shared";
import DBReader from "../api/db_reader";

function TimerScreen() {
    const [time, setTime] = useState<number>(0);
    const [releasedAfterStop, setReleasedAfterStop] = useState<boolean>(true);
    const [running, setRunning] = useState<boolean> (false);
    const [solves, setSolves] = useState<ISolve[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const timerRef = useRef(0);
    const startTimeRef = useRef<number>(0);
    const dbWriter = new DBWriter();
    const dbReader = new DBReader();

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
                console.log(time);
                const solve: ISolve = await dbWriter.insertSolve(new Solve("superhellth", finalTime, new Date(), "", Discipline.ThreeByThree));
                setSolves(prevSolves => [...prevSolves, solve]);
            }
        }

        // Cancel solve on esc
        if (event.key === 'Escape') {
            event.preventDefault();
            setRunning(false);
            setTime(0);
        }
    }, [running, time, dbWriter, Solve, Discipline]);

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

    // Register keyboard listeners
    useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown)
        };
    }, [handleKeyDown, handleKeyUp])

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

    // Load all solves on startup
    useEffect(() => {
        const fetchUserSolves = async (user: IUser) => {
            try {
                setLoading(true);
                const fetchedSolves = await dbReader.getAllUserSolves(user);
                setSolves(fetchedSolves);
            } catch (error) {
                console.error("Failed to fetch solves:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserSolves(new User("superhellth", new Date()));
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

    );
}

export default TimerScreen;