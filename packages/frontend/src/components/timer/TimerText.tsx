import Typography from "@mui/material/Typography";
import { Box, keyframes } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { formatTime } from "../../utils/solveUtils";

export enum TimerStatus {
    Idle = "IDLE",
    Ready = "READY",
    Running = "RUNNING",
    Cancelled = "CANCELLED",
    Inspecting = "INSPECTING",
    ReadyForInspection = "INSPECT_READY",
    InspectionCancelled = "INSPECT_DNF",
}

export const ACTIVE_TIMER_STATUS = [TimerStatus.Ready, TimerStatus.ReadyForInspection, TimerStatus.Inspecting, TimerStatus.Running];

const shimmerAnimation = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

interface Props {
    timerStatus: TimerStatus;
    onSolveComplete: (finalTime: number, dnf: boolean) => void;
    inspectionEnabled: boolean;
    pb: number;
    reset: boolean;
}

const inspectionTime: number = 15000;

function TimerDisplay({ timerStatus, onSolveComplete, inspectionEnabled, pb, reset }: Props) {
    const [time, setTime] = useState<number>(0);
    const startTimeRef = useRef<number>(0);
    const requestRef = useRef<number>(undefined);
    const checkerRef = useRef<number>(undefined);
    const [pbTrigger, setPbTrigger] = useState<boolean>(false);

    useEffect(() => {
        startTimeRef.current = 0;
        setTime(0);
        setPbTrigger(false);
    }, [reset])

    useEffect(() => {

        const stopTicker = () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
                requestRef.current = undefined;
            }
        };

        const stopInspectionCheck = () => {
            if (checkerRef.current) {
                clearTimeout(checkerRef.current);
                checkerRef.current = undefined;
            }
        };

        switch (timerStatus) {
            case TimerStatus.Running:
                stopInspectionCheck();
                startTimeRef.current = Date.now();

                const runTick = () => {
                    setTime(Date.now() - startTimeRef.current);
                    requestRef.current = requestAnimationFrame(runTick);
                };
                runTick();
                break;

            case TimerStatus.Inspecting:
                if (!startTimeRef.current) {
                    startTimeRef.current = Date.now();
                }

                const inspectionTick = () => {
                    const elapsed = Date.now() - startTimeRef.current;
                    const remaining = inspectionTime - elapsed;
                    const displayTime = Math.max(0, remaining);
                    setTime(displayTime);

                    if (displayTime <= 0) {
                        stopTicker();
                        stopInspectionCheck();
                        startTimeRef.current = 0;
                        onSolveComplete(0, true);
                    } else {
                        requestRef.current = requestAnimationFrame(inspectionTick);
                    }
                };
                inspectionTick();
                break;

            case TimerStatus.InspectionCancelled:
                stopTicker();
                stopInspectionCheck();
                setTime(0);
                startTimeRef.current = 0;
                break;

            case TimerStatus.Idle:
            case TimerStatus.Cancelled:

                if (startTimeRef.current > 0) {
                    const finalTime = Date.now() - startTimeRef.current;
                    if (timerStatus === TimerStatus.Idle && finalTime < pb) {
                        setPbTrigger(true);
                    }
                    setTime(finalTime);
                    onSolveComplete(finalTime, timerStatus !== TimerStatus.Idle);
                    startTimeRef.current = 0;
                }
                break;

            case TimerStatus.Ready:
                stopTicker();
                setPbTrigger(false);

                if (inspectionEnabled) {
                    const readyTick = () => {
                        const elapsed = Date.now() - startTimeRef.current;
                        const remaining = Math.max(0, inspectionTime - elapsed);
                        setTime(remaining);
                        requestRef.current = requestAnimationFrame(readyTick);
                    };
                    readyTick();
                } else {
                    setTime(0);
                }
                break;

            case TimerStatus.ReadyForInspection:
                setPbTrigger(false);
                break;

            default:
                break;
        }
        return () => {
            stopTicker();
            stopInspectionCheck();
        };
    }, [timerStatus]);

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
        <Box sx={{ transform: "translateZ(0)", willChange: "transform", padding: 0, margin: 0 }}>
            {/* <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) translateZ(0)',
                    width: '120%',
                    height: '120%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.text.primary, 0.1)} 0%, transparent 70%)`,
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                    backfaceVisibility: 'hidden',
                    zIndex: -1,
                }}
            /> */}
            <Typography sx={{
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "none",
                fontSmooth: "antialiased",
                fontSize: "15rem",
                fontFamily: "'DSEG7 Classic', monospace",
                width: "100%",
                display: "block",
                lineHeight: 1,
                textAlign: "center",
                color: pbTrigger ? "transparent" : getColor(),
                userSelect: "none",
                ...(pbTrigger && {
                    background: "linear-gradient(110deg, #009aa3 30%, #ffffff 50%, #009aa3 70%)", // Widened stops (30-70 instead of 40-60)
                    backgroundSize: "200% auto",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    textFillColor: "transparent",
                    WebkitTextFillColor: "transparent",
                    animation: `${shimmerAnimation} 3s linear infinite`,
                })
            }}>
                {timerStatus === TimerStatus.Inspecting || (timerStatus === TimerStatus.Ready && inspectionEnabled) ? Math.floor((time % 60000) / 1000) : formatTime(time)}
            </Typography>
        </Box>
    );
};

export default TimerDisplay;