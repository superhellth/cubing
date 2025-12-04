import { Discipline, inspectionlessDisciplines, Status, type ISolve } from "@cubing/shared";
import "@fontsource/dseg7-classic/700.css";
import SettingsIcon from "@mui/icons-material/Settings";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box, Stack } from "@mui/system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PercentileGauge } from "../components/graphs/PercentileGauge";
import HCButton from "../components/HCButton";
import AvgGraphs from "../components/timer/AvgGraphs";
import LimitReachedDialog from "../components/timer/dialogs/LimitReachedDialog";
import SolveDetailsScreen from "../components/timer/dialogs/SolveDetailsDialog";
import TimeDisplay from "../components/timer/TimeDisplay";
import TimerSettings from "../components/timer/TimerSettings";
import TimerDisplay, { ACTIVE_TIMER_STATUS, TimerStatus } from "../components/timer/TimerText";
import { useTimerLogic } from "../hooks/useTimerLogic";
import { useTimerSettings } from "../hooks/useTimerSettings";
import { getDisplayableTime } from "../utils/solveUtils";
import { ScrambleText, ScreenContainer, TimerPanel } from "./TimerScreen.styles";
import { useSolveManager } from "../hooks/useSolveManager";

function TimerScreen({ selectedDiscipline, updateSidebarVisibility }: { selectedDiscipline: Discipline, updateSidebarVisibility: Function }) {
    const { settings, updateSetting } = useTimerSettings();
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [openedSolveDetailsDialog, setOpenedSolveDetailsDialog] = useState<boolean>(false);
    const { solves, addSolve, deleteSolve, updateSolveStatus, currentScramble } =
        useSolveManager(selectedDiscipline, "default");
    const { timerStatus } = useTimerLogic(
        settings,
        selectedDiscipline
    );
    const hideElements: boolean = useMemo(() => {
        return ACTIVE_TIMER_STATUS.includes(timerStatus)
            && settings.hideElementsWhileSolving
            && ((timerStatus !== TimerStatus.ReadyForInspection && settings.inspection)
                || (timerStatus !== TimerStatus.Ready && !settings.inspection))
    }, [settings, timerStatus]);

    const percentile = useMemo(() => {
        if (solves.length === 0) return 100;
        if (solves[0].status === Status.DNF) return 0;
        const slowerSolvesCount = solves.filter(s => s.duration > solves[0].duration).length;
        const rawPercent = (slowerSolvesCount / solves.length) * 100;
        return Math.round(rawPercent);
    }, [solves]);
    const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
    const [selectedSolve, setSelectedSolve] = useState<ISolve | null>();

    useEffect(() => {
        updateSidebarVisibility(!hideElements);
    }, [hideElements]);

    const openSolveDetailsScreen = useCallback((solve: ISolve) => {
        setSelectedSolve(solve);
        setOpenedSolveDetailsDialog(true);
    }, []);

    return (
        <ScreenContainer>
            <TimerPanel>
                {!hideElements &&
                    <HCButton
                        sx={{
                            position: "absolute", right: 25, top: 25,
                            userSelect: "none"
                        }}
                        onClick={() => { setSettingsOpen(true); }} isSelected={true}>
                        <SettingsIcon />
                    </HCButton>
                }
                <Box sx={{ flex: 1, visibility: hideElements ? "hidden" : "visible" }}>
                    <ScrambleText charCount={currentScramble.length}>
                        {currentScramble}
                    </ScrambleText>
                </Box>
                <Box sx={{ flex: 5, visibility: hideElements ? "hidden" : "visible", alignContent: "center" }}>
                    <PercentileGauge percentile={percentile} />
                </Box>
                <Box sx={{ flex: 5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <TimerDisplay timerStatus={timerStatus} onSolveComplete={addSolve} inspectionEnabled={settings.inspection &&
                        !inspectionlessDisciplines.includes(selectedDiscipline)} />
                    {/* </Box> */}
                </Box>
                {/* <Box sx={{ flex: 5, width: "100%", visibility: hideElements ? "hidden" : "visible" }}>
                    <Typography sx={{ fontSize: "3rem", color: "info.light" }}>
                        Ao5: {solves[0]?.avg5 ? getDisplayableTime(solves[0], "avg5") : "-"}
                    </Typography>
                    <Typography sx={{ fontSize: "3rem", color: "info.dark" }}>
                        Ao12: {solves[0]?.avg12 ? getDisplayableTime(solves[0], "avg12") : "-"}
                    </Typography>
                </Box> */}
                <Box sx={{ flex: 10, visibility: hideElements ? "hidden" : "visible", width: "100%", alignContent: "flex-end"}}>
                    <AvgGraphs solves={solves} settings={settings} />
                </Box>
            </TimerPanel>
            {!hideElements &&
                <Box sx={{
                    bgcolor: "secondary.main",
                    flex: 10,
                    visibility: hideElements ? "hidden" : "visible",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    m: "16px 16px",
                }}>
                    <TimeDisplay solves={solves} openSolveDetailsScreen={openSolveDetailsScreen} />
                </Box>
            }
            {selectedSolve && (
                <SolveDetailsScreen solve={selectedSolve}
                    onDeleteSolve={(solvePk: bigint, uuid: string) => { setOpenedSolveDetailsDialog(false); deleteSolve(solvePk, uuid) }}
                    onUpdateStatus={updateSolveStatus} isOpen={openedSolveDetailsDialog}
                    onClose={() => { setOpenedSolveDetailsDialog(false) }}></SolveDetailsScreen>
            )}
            <TimerSettings isOpen={settingsOpen} onClose={() => { setSettingsOpen(false) }} settings={settings} updateSetting={updateSetting} />
            <LimitReachedDialog isOpen={isLimitDialogOpen} handleClose={() => setIsLimitDialogOpen(false)} />
        </ScreenContainer>

    );
}

export default TimerScreen;