import { Discipline, inspectionlessDisciplines, Status, type Solve } from "@cubing/shared";
import "@fontsource/dseg7-classic/700.css";
import SettingsIcon from "@mui/icons-material/Settings";
import { Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PercentileGauge } from "../components/graphs/PercentileGauge";
import HCButton from "../components/HCButton";
import AvgGraphs from "../components/timer/AvgGraphs";
import LimitReachedDialog from "../components/timer/dialogs/LimitReachedDialog";
import SolveDetailsScreen from "../components/timer/dialogs/SolveDetailsDialog";
import TimeDisplay from "../components/timer/TimeDisplay";
import TimerSettings from "../components/timer/TimerSettings";
import TimerDisplay, { ACTIVE_TIMER_STATUS, TimerStatus } from "../components/timer/TimerText";
import { useSolveManager } from "../hooks/useSolveManager";
import { useTimerLogic } from "../hooks/useTimerLogic";
import { useTimerSettings } from "../hooks/useTimerSettings";
import { getDisplayableTime } from "../utils/solveUtils";
import { ScrambleText, ScreenContainer, TimerPanel } from "./TimerScreen.styles";

function TimerScreen({ selectedDiscipline, updateSidebarVisibility }: { selectedDiscipline: Discipline, updateSidebarVisibility: Function }) {
    const { settings, updateSetting } = useTimerSettings();
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [openedSolveDetailsDialog, setOpenedSolveDetailsDialog] = useState<boolean>(false);
    const { solvesChrono, addSolve, deleteSolve, updateSolveStatus, currentScramble, pb } =
        useSolveManager(selectedDiscipline, "default");
    const [reset, setReset] = useState(false);
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
        if (solvesChrono.length <= 1) return 100;
        if (solvesChrono[0].status === Status.DNF) return 0;
        const slowerSolvesCount = solvesChrono.filter(s => s.duration > solvesChrono[0].duration || s.status === Status.DNF).length;
        const rawPercent = (slowerSolvesCount / (solvesChrono.length - 1)) * 100;
        return Math.round(rawPercent);
    }, [solvesChrono]);
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
        <ScreenContainer>
            <TimerPanel>
                {!hideElements &&
                    <HCButton
                        sx={{
                            position: "absolute", left: "40px", top: "16px",
                            userSelect: "none"
                        }}
                        onClick={() => { setSettingsOpen(true); }} isSelected={true}>
                        <SettingsIcon />
                    </HCButton>
                }
                <Box sx={{ flex: 1, visibility: hideElements ? "hidden" : "visible", paddingLeft: "60px" }}>
                    <ScrambleText charCount={currentScramble.length}>
                        {currentScramble}
                    </ScrambleText>
                </Box>
                <Box sx={{ flex: 7, visibility: hideElements ? "hidden" : "visible", alignContent: "center" }}>
                    <PercentileGauge percentile={percentile} />
                </Box>
                <Box sx={{ flex: 5, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <TimerDisplay timerStatus={timerStatus} onSolveComplete={addSolve} inspectionEnabled={settings.inspection &&
                        !inspectionlessDisciplines.includes(selectedDiscipline)} pb={pb} reset={reset} />
                </Box>
                <Box sx={{
                    flex: 5, width: "100%",
                    visibility: hideElements ? "hidden" : "visible", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"
                }}>
                    <Typography sx={{ fontSize: "3rem", color: "info.light" }}>
                        Ao5: {solvesChrono[0]?.avg5 ? getDisplayableTime(solvesChrono[0], "avg5") : "-"}
                    </Typography>
                    <Divider orientation="vertical" sx={{ m: "1.5rem", height: "3rem" }} />
                    <Typography sx={{ fontSize: "3rem", color: "info.dark" }}>
                        Ao12: {solvesChrono[0]?.avg12 ? getDisplayableTime(solvesChrono[0], "avg12") : "-"}
                    </Typography>
                </Box>
                <Box sx={{ flex: 5, visibility: hideElements ? "hidden" : "visible", width: "100%", alignContent: "flex-end" }}>
                    <AvgGraphs solves={solvesChrono} settings={settings} />
                </Box>
            </TimerPanel>

            <Box sx={{
                visibility: !hideElements ? "visible" : "hidden",
                flex: solveTableVisible ? 10 : 0,
                minWidth: !solveTableVisible ? "87px" : 0,
                transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1), visibility 0s",
                m: "16px 16px",
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
                    onUpdateStatus={updateSolveStatus} isOpen={openedSolveDetailsDialog}
                    onClose={() => { setOpenedSolveDetailsDialog(false) }}></SolveDetailsScreen>
            )}
            <TimerSettings isOpen={settingsOpen} onClose={() => { setSettingsOpen(false) }} settings={settings} updateSetting={updateSetting} />
            <LimitReachedDialog isOpen={isLimitDialogOpen} handleClose={() => setIsLimitDialogOpen(false)} />
        </ScreenContainer>

    );
}

export default TimerScreen;