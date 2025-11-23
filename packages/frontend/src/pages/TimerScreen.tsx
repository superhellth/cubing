import { Discipline, inspectionLessDisciplines, type ISolve } from "@cubing/shared";
import "@fontsource/dseg7-classic/700.css";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useCallback, useState } from "react";
import HCButton from "../components/HCButton";
import AvgGraphs from "../components/timer/AvgGraphs";
import LimitReachedDialog from "../components/timer/dialogs/LimitReachedDialog";
import SolveDetailsScreen from "../components/timer/dialogs/SolveDetailsDialog";
import TimeDisplay from "../components/timer/TimeDisplay";
import TimerSettings from "../components/timer/TimerSettings";
import TimerDisplay from "../components/timer/TimerText";
import { useSolveManager } from "../hooks/useSolveManager";
import { useTimerLogic } from "../hooks/useTimerLogic";
import { useTimerSettings } from "../hooks/useTimerSettings";
import { getDisplayableTime } from "../utils/solveUtils";
import { ScrambleText, ScreenContainer, TimerPanel } from "./TimerScreen.styles";

function TimerScreen({ selectedDiscipline }: { selectedDiscipline: Discipline }) {
    const { settings, updateSetting } = useTimerSettings();
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [openedSolveDetailsDialog, setOpenedSolveDetailsDialog] = useState<boolean>(false);
    const { solves, addSolve, deleteSolve, updateSolveStatus, currentScramble } =
        useSolveManager(selectedDiscipline);

    const { timerStatus } = useTimerLogic(
        settings,
        selectedDiscipline
    );
    const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
    const [selectedSolve, setSelectedSolve] = useState<ISolve | null>();

    const openSolveDetailsScreen = useCallback((solve: ISolve) => {
        setSelectedSolve(solve);
        setOpenedSolveDetailsDialog(true);
    }, []);

    return (
        <ScreenContainer>
            <TimerPanel>
                <HCButton
                    sx={{
                        position: "absolute", right: 25, top: 25,
                        userSelect: "none"
                    }}
                    onClick={() => { setSettingsOpen(true); }} isSelected={true}                >
                    <SettingsIcon />
                </HCButton>
                <Box sx={{ flex: 1 }}>
                    <ScrambleText charCount={currentScramble.length}>
                        {currentScramble}
                    </ScrambleText>
                </Box>
                <Box sx={{ flex: 5, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                    <Box sx={{ flex: 4, display: "grid", alignItems: "center" }}>
                        <TimerDisplay timerStatus={timerStatus} onSolveComplete={addSolve} inspectionEnabled={settings.inspection &&
                            !inspectionLessDisciplines.includes(selectedDiscipline)} />
                    </Box>
                    <Box sx={{ flex: 1, display: "grid", alignItems: "center", marginBottom: "3rem" }}>
                        <Typography sx={{ fontSize: "3rem", fontFamily: "Space Mono", color: "info.light" }}>
                            Ao5: {solves[0]?.avg5 ? getDisplayableTime(solves[0], "avg5") : "-"}
                        </Typography>
                        <Typography sx={{ fontSize: "3rem", fontFamily: "Space Mono", color: "info.dark" }}>
                            Ao12: {solves[0]?.avg12 ? getDisplayableTime(solves[0], "avg12") : "-"}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ flex: 1, }}>
                    <AvgGraphs solves={solves} xByDate={settings.averageGraphXAxis == "date"} />
                </Box>
            </TimerPanel>
            <Divider orientation="vertical" sx={{ bgcolor: "info.main" }} flexItem component="div" />
            <Box sx={{ bgcolor: "secondary.main", height: "100%", margin: 0, padding: 0 }}>
                <TimeDisplay solves={solves} openSolveDetailsScreen={openSolveDetailsScreen} />
            </Box>
            {selectedSolve && (
                <SolveDetailsScreen solve={selectedSolve} onDeleteSolve={(solveID: number) => { setOpenedSolveDetailsDialog(false); deleteSolve(solveID) }} onUpdateStatus={updateSolveStatus} isOpen={openedSolveDetailsDialog}
                    onClose={() => { setOpenedSolveDetailsDialog(false) }}></SolveDetailsScreen>
            )}
            <TimerSettings isOpen={settingsOpen} onClose={() => { setSettingsOpen(false) }} settings={settings} updateSetting={updateSetting} />
            <LimitReachedDialog isOpen={isLimitDialogOpen} handleClose={() => setIsLimitDialogOpen(false)} />
        </ScreenContainer>

    );
}

export default TimerScreen;