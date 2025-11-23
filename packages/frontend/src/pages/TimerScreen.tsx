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
import { useSolveManager } from "../hooks/useSolvemanager";
import { useTimerLogic } from "../hooks/useTimerLogic";
import DBReader from "../services/db_reader";
import DBWriter from "../services/db_writer";
import Scrambler from "../utils/scrambling/scrambler";
import { getDisplayableTime } from "../utils/solveUtils";
import { useLocalStorage } from "../utils/timer_utils";
import { ScrambleText, ScreenContainer, TimerPanel } from "./TimerScreen.styles";

const dbWriter: DBWriter = DBWriter.instance;
const dbReader: DBReader = DBReader.instance;
const scrambleGenerator: Scrambler = new Scrambler();

const defaultSettings = {
    inspection: false,
    readyAfter: 200,
    averageGraphXAxis: 'date'
};

function TimerScreen({ selectedDiscipline }: { selectedDiscipline: Discipline }) {
    // Settings
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [settings, setSettings] = useLocalStorage('appSettings', defaultSettings);
    const updateSetting = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };
    const { solves, processedSolves, addSolve, deleteSolve, updateSolveStatus, currentScramble } =
        useSolveManager(selectedDiscipline);
    const [currentUUID] = useState<string>(() => {
        const USER_ID_KEY = "userID";
        let uID = localStorage.getItem(USER_ID_KEY);
        if (!uID) {
            uID = crypto.randomUUID();
            localStorage.setItem(USER_ID_KEY, uID);
        }
        return uID;
    });

    // Timer logic
    // const [timerStatus, setTimerStatus] = useState<TimerStatus>(TimerStatus.Idle);
    const { timerStatus, setTimerStatus } = useTimerLogic(
        settings,
        selectedDiscipline
    );

    // Else
    // const [currentScramble, setCurrentScramble] = useState<string>("");
    const [isLimitDialogOpen, setIsLimitDialogOpen] = useState(false);
    const [selectedSolve, setSelectedSolve] = useState<ISolve | null>();
    const [openedSolveDetailsDialog, setOpenedSolveDetailsDialog] = useState<boolean>(false);
    // const [solves, setSolves] = useState<ISolve[]>([]);
    // const processedSolves: ISolve[] = useSolvesWithAverages(solves);
    // const [, setLoading] = useState<boolean>(false);

    // Fetch user solves
    // useEffect(() => {
    //     if (!currentUUID) {
    //         return;
    //     }
    //     async function fetchUserSolves() {
    //         try {
    //             const fetchedSolves = await dbReader.getAllUserSolves(currentUUID, selectedDiscipline);
    //             setSolves(fetchedSolves);
    //         } catch (error) {
    //             console.error("Failed to fetch solves:", error);
    //         }
    //     }
    //     fetchUserSolves();
    //     setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));

    // }, [currentUUID, selectedDiscipline]);

    // const deleteSolve = (solveID: number) => {
    //     setOpenedSolveDetailsDialog(false);
    //     dbWriter.deleteSolve(solveID);
    //     setSolves(prevSolves => {
    //         return prevSolves.filter(solve => solve.id !== solveID);
    //     });
    //     setTimerStatus(TimerStatus.Idle);
    // }

    // const handleUpdateSolveStatus = (oldSolve: ISolve, newStatus: Status) => {
    //     const updatedSolve: ISolve = solveWithUpdatedStatus(oldSolve, newStatus);
    //     dbWriter.updateSolveStatus(updatedSolve);
    //     setSolves(prevSolves => {
    //         return prevSolves.map(solve => {
    //             if (solve.id === updatedSolve.id) {
    //                 return updatedSolve;
    //             }
    //             return solve;
    //         });
    //     });
    // }

    // const handleSolveComplete = async (finalTime: number, dnf: boolean) => {
    //     if (dnf) {
    //         setTimerStatus(TimerStatus.Cancelled);
    //     }
    //     const solveStatus: Status = dnf ? Status.DNF : Status.Valid;

    //     try {

    //         const solve: ISolve = await dbWriter.insertSolve({
    //             uuid: currentUUID, duration: finalTime, date: new Date(), scramble: currentScramble,
    //             discipline: selectedDiscipline, status: solveStatus, session: "default"
    //         });
    //         setSolves(prev => [solve, ...prev]);
    //     } catch (error: any) {
    //         if (error.message === 'LIMIT_REACHED') {
    //             setIsLimitDialogOpen(true);
    //         }
    //     }
    //     setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));

    //     // const tempSolve: ISolve = {
    //     //     id: -1, uuid: currentUUID, duration: finalTime, date: new Date(), scramble: currentScramble,
    //     //     discipline: selectedDiscipline, status: solveStatus, session: "default"
    //     // };
    //     // setSolves(prevSolves => [tempSolve, ...prevSolves]);
    //     // setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));
    //     // dbWriter.insertSolve(tempSolve).then((realSolve) => {
    //     //     setSolves(prev => prev.map(s => s.id === -1 ? realSolve : s));
    //     // });
    // }

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
                            Ao5: {processedSolves[0]?.avg5 ? getDisplayableTime(processedSolves[0], "avg5") : "-"}
                        </Typography>
                        <Typography sx={{ fontSize: "3rem", fontFamily: "Space Mono", color: "info.dark" }}>
                            Ao12: {processedSolves[0]?.avg12 ? getDisplayableTime(processedSolves[0], "avg12") : "-"}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ flex: 1, }}>
                    <AvgGraphs solves={processedSolves} xByDate={settings.averageGraphXAxis == "date"} />
                </Box>
            </TimerPanel>
            <Divider orientation="vertical" sx={{ bgcolor: "info.main" }} flexItem component="div" />
            <Box sx={{ bgcolor: "secondary.main", height: "100%", margin: 0, padding: 0 }}>
                <TimeDisplay solves={processedSolves} openSolveDetailsScreen={openSolveDetailsScreen} />
            </Box>
            {selectedSolve && (
                <SolveDetailsScreen solve={selectedSolve} onDeleteSolve={(solveID: number) => { setOpenedSolveDetailsDialog(false); deleteSolve(solveID) }} onUpdateStatus={updateSolveStatus} isOpen={openedSolveDetailsDialog}
                    onClose={() => { setOpenedSolveDetailsDialog(false) }} dbWriter={dbWriter}></SolveDetailsScreen>
            )}
            <TimerSettings isOpen={settingsOpen} onClose={() => { setSettingsOpen(false) }} settings={settings} updateSetting={updateSetting} />
            <LimitReachedDialog isOpen={isLimitDialogOpen} handleClose={() => setIsLimitDialogOpen(false)} />
        </ScreenContainer>

    );
}

export default TimerScreen;