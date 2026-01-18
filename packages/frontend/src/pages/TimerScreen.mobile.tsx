import { Discipline, inspectionlessDisciplines, type Solve } from "@cubing/shared";
import "@fontsource/dseg7-classic/700.css";
import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useMemo, useState } from "react";
import LimitReachedDialog from "../components/dialogs/LimitReachedDialog";
import SolveDetailsScreen from "../components/dialogs/SolveDetailsDialog";
import { PercentileGauge } from "../components/graphs/PercentileGauge";
import TimeDisplay from "../components/timer/TimeDisplay";
import TimerDisplay, { ACTIVE_TIMER_STATUS, TimerStatus } from "../components/timer/TimerText";
import { useSolves } from "../contexts/SolveContext";
import { useTimerSettings } from "../contexts/TimerSettingsContext";
import usePercentile from "../hooks/solves/usePercentile";
import { useTimerLogic } from "../hooks/useTimerLogic";
import { getDisplayableTime } from "../utils/solveUtils";
import { ScrambleText, ScreenContainer, TimerPanel } from "./TimerScreen.styles";

function TimerScreenMobile({ selectedDiscipline, updateSidebarVisibility }: { selectedDiscipline: Discipline, updateSidebarVisibility: Function }) {
    const { settings } = useTimerSettings();
    const [openedSolveDetailsDialog, setOpenedSolveDetailsDialog] = useState<boolean>(false);
    const { solvesChrono, addSolve, deleteSolve, updateSolveStatus, currentScramble, pb } = useSolves();
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

    const openSolveDetailsScreen = useCallback((solve: Solve) => {
        setSelectedSolve(solve);
        setOpenedSolveDetailsDialog(true);
    }, [reset]);

    const onSolveTableVisibilityChange = (newState: boolean) => {
        setSolveTableVisible(newState);
    };

    return (
        <ScreenContainer isMobile={true}>
            <TimerPanel>
                <Box sx={{ flex: 2, visibility: hideElements ? "hidden" : "visible", paddingLeft: "20px" }}>
                    <ScrambleText sx={{ fontSize: "1rem" }} charCount={currentScramble.length}>
                        {currentScramble}
                    </ScrambleText>
                </Box>
                <Box sx={{ flex: 3, visibility: hideElements ? "hidden" : "visible", alignContent: "center" }}>
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
                    <Typography sx={{ fontSize: "2rem", color: "info.light" }}>
                        Ao5: {getDisplayableTime(solvesChrono[solvesChrono.length - 1], "avg5")}
                    </Typography>
                    <Divider orientation="vertical" sx={{ m: "1.5rem", height: "3rem" }} />
                    <Typography sx={{ fontSize: "2rem", color: "info.dark" }}>
                        Ao12: {getDisplayableTime(solvesChrono[solvesChrono.length - 1], "avg12")}
                    </Typography>
                </Box>
            </TimerPanel>

            <Box sx={{
                visibility: !hideElements ? "visible" : "hidden",
                flex: solveTableVisible ? 15 : 0,
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
                    }}
                    onUpdateStatus={updateSolveStatus} isOpen={openedSolveDetailsDialog}
                    onClose={() => { setOpenedSolveDetailsDialog(false); }} onDeleteMany={() => console.log("todo")}></SolveDetailsScreen>
            )}
            <LimitReachedDialog isOpen={isLimitDialogOpen} handleClose={() => setIsLimitDialogOpen(false)} />
        </ScreenContainer>

    );
}

export default TimerScreenMobile;