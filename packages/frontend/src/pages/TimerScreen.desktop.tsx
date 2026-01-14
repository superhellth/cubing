import { Discipline, inspectionlessDisciplines, type Solve } from "@cubing/shared";
import "@fontsource/dseg7-classic/700.css";
import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PercentileGauge } from "../components/graphs/PercentileGauge";
import AvgGraphs from "../components/timer/AvgGraphs";
import LimitReachedDialog from "../components/timer/dialogs/LimitReachedDialog";
import SolveDetailsScreen from "../components/timer/dialogs/SolveDetailsDialog";
import TimeDisplay from "../components/timer/TimeDisplay";
import TimerDisplay, { ACTIVE_TIMER_STATUS, TimerStatus } from "../components/timer/TimerText";
import usePercentile from "../hooks/solves/usePercentile";
import { useSolveManager } from "../hooks/solves/useSolveManager";
import { useTimerSettings } from "../hooks/TimerSettingsContext";
import { useTimerLogic } from "../hooks/useTimerLogic";
import { getDisplayableTime } from "../utils/solveUtils";
import { ScrambleText, ScreenContainer, TimerPanel } from "./TimerScreen.styles";

function TimerScreenDesktop({ selectedDiscipline, updateSidebarVisibility, setSidebarIsCollapsed }:
    { selectedDiscipline: Discipline, updateSidebarVisibility: Function, setSidebarIsCollapsed: Function }) {
    const { settings } = useTimerSettings();
    const [openedSolveDetailsDialog, setOpenedSolveDetailsDialog] = useState<boolean>(false);
    const { solvesChrono, addSolve, deleteSolve, deleteMany, updateSolveStatus, currentScramble, pb } =
        useSolveManager(selectedDiscipline, "default");
    const percentile = usePercentile(solvesChrono);
    const [reset, setReset] = useState(false);
    const { timerStatus, timerHandlers } = useTimerLogic(
        selectedDiscipline
    );
    const hideElements: boolean = useMemo(() => {
        return ACTIVE_TIMER_STATUS.includes(timerStatus)
            && settings.hideElementsWhileSolving
            && ((timerStatus !== TimerStatus.ReadyForInspection && settings.inspection)
                || (timerStatus !== TimerStatus.Ready && !settings.inspection))
    }, [settings, timerStatus]);

    const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
    const [selectedSolve, setSelectedSolve] = useState<Solve | null>();
    const [solveTableVisible, setSolveTableVisible] = useState(true);

    useEffect(() => {
        updateSidebarVisibility(!hideElements);
    }, [hideElements]);
    useEffect(() => {
        if (timerStatus === TimerStatus.Ready) {
            setSidebarIsCollapsed(true);
        }
    }, [timerStatus])

    const openSolveDetailsScreen = useCallback((solve: Solve) => {
        setSelectedSolve(solve);
        setOpenedSolveDetailsDialog(true);
    }, [reset]);

    const onSolveTableVisibilityChange = (newState: boolean) => {
        setSolveTableVisible(newState);
    };

    return (
        <ScreenContainer isMobile={false}>
            <TimerPanel>
                <Box sx={{ flex: 1, visibility: hideElements ? "hidden" : "visible" }}>
                    <ScrambleText charCount={currentScramble.length}>
                        {currentScramble}
                    </ScrambleText>
                </Box>
                <Box sx={{ flex: 7, visibility: hideElements ? "hidden" : "visible", alignContent: "center" }}>
                    <PercentileGauge percentile={percentile} />
                </Box>
                <Box sx={{ flex: 5, display: "flex", flexDirection: "column", justifyContent: "center" }} {...timerHandlers}>
                    <TimerDisplay timerStatus={timerStatus} onSolveComplete={addSolve} inspectionEnabled={settings.inspection &&
                        !inspectionlessDisciplines.includes(selectedDiscipline)} pb={pb} reset={reset} />
                </Box>
                <Box sx={{
                    flex: 5, width: "100%",
                    visibility: hideElements ? "hidden" : "visible", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"
                }}>
                    <Typography sx={{ fontSize: "3rem", color: "info.light" }}>
                        Ao5: {getDisplayableTime(solvesChrono[solvesChrono.length - 1], "avg5")}
                    </Typography>
                    <Divider orientation="vertical" sx={{ m: "1.5rem", height: "3rem" }} />
                    <Typography sx={{ fontSize: "3rem", color: "info.dark" }}>
                        Ao12: {getDisplayableTime(solvesChrono[solvesChrono.length - 1], "avg12")}
                    </Typography>
                </Box>
                <Box sx={{ flex: 5, visibility: hideElements ? "hidden" : "visible", width: "100%", alignContent: "flex-end" }}>
                    <AvgGraphs solves={solvesChrono} settings={settings} />
                </Box>
            </TimerPanel>

            <Box sx={{
                visibility: !hideElements ? "visible" : "hidden",
                marginTop: "16px",
                marginRight: "16px",
                minWidth: "91px",
                p: 0
            }}>
                <TimeDisplay solves={solvesChrono} openSolveDetailsScreen={openSolveDetailsScreen} isCollapsed={!solveTableVisible}
                    onSolveTableVisibilityChange={onSolveTableVisibilityChange} />
            </Box>

            {selectedSolve && (
                <SolveDetailsScreen solve={selectedSolve}
                    onDeleteSolve={(solvePk: bigint, uuid: string) => {
                        setOpenedSolveDetailsDialog(false);
                        deleteSolve(solvePk, uuid);
                        if (solvePk === solvesChrono[0].pk) {
                            setReset(!reset);
                        }
                    }
                    }
                    onDeleteMany={(solvePk: bigint, deleteX: number) => {
                        deleteMany(solvePk, deleteX);
                    }}
                    onUpdateStatus={updateSolveStatus} isOpen={openedSolveDetailsDialog}
                    onClose={() => { setOpenedSolveDetailsDialog(false) }}></SolveDetailsScreen>
            )}
            <LimitReachedDialog isOpen={isLimitDialogOpen} handleClose={() => setIsLimitDialogOpen(false)} />
        </ScreenContainer>

    );
}

export default TimerScreenDesktop;