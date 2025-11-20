import Typography from "@mui/material/Typography";
import { useEffect, useRef, useState } from "react";
import Timer from "./timer";
import { Box } from "@mui/system";

export enum TimerStatus {
    Idle = "IDLE",
    Ready = "READY",
    Running = "RUNNING",
    Cancelled = "CANCELLED",
    Inspecting = "INSPECTING",
    ReadyForInspection = "INSPECT_READY",
    InspectionCancelled = "INSPECT_DNF"
}

interface Props {
    timerStatus: TimerStatus;
    onSolveComplete: (finalTime: number, dnf: boolean) => void;
    inspectionEnabled: boolean;
}

const inspectionTimer: number = 15000;

function TimerDisplay({ timerStatus, onSolveComplete, inspectionEnabled }: Props) {
    const [time, setTime] = useState<number>(0);
    const startTimeRef = useRef<number>(0);
    const requestRef = useRef<number>(undefined);

    useEffect(() => {
        switch (timerStatus) {
            case TimerStatus.Running:
                startTimeRef.current = Date.now();
                const tick1 = () => {
                    setTime(Date.now() - startTimeRef.current);
                    requestRef.current = requestAnimationFrame(tick1);
                };
                requestRef.current = requestAnimationFrame(tick1);
                break;
            case TimerStatus.Inspecting:
                if (!startTimeRef.current) {
                    startTimeRef.current = Date.now();
                }
                const tick = () => {
                    setTime(inspectionTimer - (Date.now() - startTimeRef.current));
                    requestRef.current = requestAnimationFrame(tick);
                };
                requestRef.current = requestAnimationFrame(tick);
                break;
            case TimerStatus.InspectionCancelled:
                if (requestRef.current) {
                    cancelAnimationFrame(requestRef.current);
                    requestRef.current = undefined;
                }
                setTime(0);
                startTimeRef.current = 0;
                break;
            case TimerStatus.Idle:
            case TimerStatus.Cancelled:
                if (requestRef.current) {
                    cancelAnimationFrame(requestRef.current);
                    requestRef.current = undefined;
                }

                if (startTimeRef.current > 0) {
                    const finalTime = Date.now() - startTimeRef.current;
                    setTime(finalTime);
                    onSolveComplete(finalTime, timerStatus !== TimerStatus.Idle);
                    startTimeRef.current = 0;
                }
                break;
            case TimerStatus.Ready:
                if (inspectionEnabled) {
                    const tick = () => {
                        setTime(inspectionTimer - (Date.now() - startTimeRef.current));
                        requestRef.current = requestAnimationFrame(tick);
                    };
                    requestRef.current = requestAnimationFrame(tick);
                } else {
                    setTime(0);
                }
                break;
            default:
                break;
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [timerStatus, onSolveComplete]);

    const getColor = () => {
        if (timerStatus === TimerStatus.Ready) return "success.main";
        if (timerStatus === TimerStatus.ReadyForInspection) return "success.main";
        if (timerStatus === TimerStatus.Idle) return "text.primary";
        if (timerStatus === TimerStatus.Cancelled) return "error.main";
        if (timerStatus === TimerStatus.Inspecting) return "warning.main";
        if (timerStatus === TimerStatus.Running) return "text.primary";
        return "text.primary";
    };

    return (
        <Box sx={{ transform: "translateZ(0)", willChange: "transform" }}>
            <Typography sx={{
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "none",
                fontSmooth: "antialiased",
                fontSize: "15rem",
                fontFamily: "DSEG7 Modern, monospaced",
                width: "100%",
                display: "block",
                textAlign: "center",
                color: getColor(),
                userSelect: "none"
            }}>
                {timerStatus === TimerStatus.Inspecting || (timerStatus === TimerStatus.Ready && inspectionEnabled) ? Math.floor((time % 60000) / 1000) : Timer.formatTime(time)}
            </Typography>
        </Box>
    );
};

export default TimerDisplay;