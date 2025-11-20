import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";

export enum TimerStatus {
    Idle = "IDLE",
    Ready = "READY",
    Running = "RUNNING",
    Cancelled = "CANCELLED",
    Inspecting = "INSPECTING",
    ReadyForInspection = "INSPECT_READY",
    InspectionDNF = "INSPECT_DNF"
}

interface Props {
    timerStatus: TimerStatus;
    onSolveComplete: (finalTime: number, dnf: boolean) => void;
}

// Mock formatter if you don't have one imported yet
const formatTime = (ms: number) => (ms / 1000).toFixed(2);

function TimerDisplay({ timerStatus, onSolveComplete }: Props) {
    const [time, setTime] = useState<number>(0);
    const [inInspection, setInInspection] = useState<boolean>(false);
    const startTimeRef = useRef<number>(0);
    const requestRef = useRef<number>(undefined);

    useEffect(() => {
        if (timerStatus === TimerStatus.Running || timerStatus === TimerStatus.Inspecting) {
            startTimeRef.current = Date.now();
            const tick = () => {
                setTime(Date.now() - startTimeRef.current);
                requestRef.current = requestAnimationFrame(tick);
            };
            requestRef.current = requestAnimationFrame(tick);
        } else if (timerStatus === TimerStatus.Idle || timerStatus === TimerStatus.Cancelled) {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = undefined;
            }

            if (startTimeRef.current > 0) {
                const finalTime = Date.now() - startTimeRef.current;
                setTime(finalTime);
                onSolveComplete(finalTime, timerStatus === TimerStatus.Cancelled);
                startTimeRef.current = 0;
            }
        } else if (timerStatus === TimerStatus.Ready || timerStatus === TimerStatus.ReadyForInspection) {
            setTime(0);
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [timerStatus, onSolveComplete]);

    const getColor = () => {
        if (timerStatus === TimerStatus.Ready) return "success.main";
        if (timerStatus === TimerStatus.Idle) return "text.primary";
        if (timerStatus === TimerStatus.Cancelled) return "error.main";
        if (timerStatus === TimerStatus.Running) return "text.primary";
        return "text.primary";
    };

    return (
        <Typography sx={{
            fontSize: "15rem",
            fontFamily: "DSEG7 Classic, monospace",
            textAlign: "center",
            color: getColor(),
            userSelect: "none" // Prevents highlighting text while spamming spacebar
        }}>
            {formatTime(time)}
        </Typography>
    );
};

export default TimerDisplay;