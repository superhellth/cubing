import { useEffect, useRef, useState } from "react";

function TimerScreen() {
    const [time, setTime] = useState(0);
    const [releasedAfterStop, setReleasedAfterStop] = useState(true);
    const [running, setRunning] = useState(false);
    const [solves, setSolves] = useState([]);
    const timerRef = useRef(0);

    const handleKeyDown = function (event: KeyboardEvent) {
        // Stop timer on space down
        if (event.code === 'Space') {
            event.preventDefault();
            if (running) {
                setRunning(false);
                setReleasedAfterStop(false);
                setSolves([...solves, time]);
            }
        }

        // Cancel solve on esc
        if (event.key === 'Escape') {
            event.preventDefault();
            setRunning(false);
            setTime(0);
        }
    }

    const handleKeyUp = function (event: KeyboardEvent) {
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
    }

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
    };

    useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown)
        };
    })

    useEffect(() => {
        if (running) {
            const startTime = Date.now();
            timerRef.current = setInterval(() => {
                setTime(Date.now() - startTime);
            }, 10);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [running]);

    const divWrapper = {
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "blue",
        minHeight: "100vh",
        minWidth: "100vw"
    }

    return (
        <div style={divWrapper}>
            <div style={{ flex: 1, backgroundColor: "green" }}>
                {solves.map((solve, index) => (
                    <p key={index}>{solve}</p>
                ))}
            </div>
            <div style={{ flex: 3, backgroundColor: "red" }}>
                <h1>Spacebar Timer</h1>
                <div>
                    {formatTime(time)}
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