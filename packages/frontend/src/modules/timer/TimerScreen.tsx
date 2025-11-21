import { Discipline, inspectionLessDisciplines, Status, type ISolve } from "@cubing/shared";
import "@fontsource/dseg7-classic/700.css";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DBReader from "../api/db_reader";
import DBWriter from "../api/db_writer";
import { getDisplayableTime, solveWithUpdatedStatus } from "../api/solveUtils";
import AvgGraphs from "./AvgGraphs";
import SolveDetailsScreen from "./SolveDetails";
import TimeDisplay from "./TimeDisplay";
import TimerDisplay, { TimerStatus } from "./TimerText";
import TimerSettings from "./TimerSettings";
import { useLocalStorage, useSolvesWithAverages } from "../utils/timer_utils";
import Scrambler from "../scrambling/Scrambler";

const dbWriter: DBWriter = new DBWriter();
const dbReader: DBReader = new DBReader();
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
        setSettings(prev => ({ ...prev, [key]: value }));
    };
    const [currentUUID, setCurrentUUID] = useState<string>(() => {
        const USER_ID_KEY = "userID";
        let uID = localStorage.getItem(USER_ID_KEY);
        if (!uID) {
            uID = crypto.randomUUID();
            localStorage.setItem(USER_ID_KEY, uID);
        }
        return uID;
    });

    // Timer logic
    const [timerStatus, setTimerStatus] = useState<TimerStatus>(TimerStatus.Idle);
    const [readySince, setReadySince] = useState<number>(-1);

    // Else
    const [currentScramble, setCurrentScramble] = useState<string>("");
    const [selectedSolve, setSelectedSolve] = useState<ISolve | null>();
    const [openedSolveDetailsDialog, setOpenedSolveDetailsDialog] = useState<boolean>(false);
    const [solves, setSolves] = useState<ISolve[]>([]);
    const processedSolves: ISolve[] = useSolvesWithAverages(solves);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch user solves
    useEffect(() => {
        if (!currentUUID) {
            return;
        }
        async function fetchUserSolves() {
            try {
                setLoading(true);
                const fetchedSolves = await dbReader.getAllUserSolves(currentUUID, selectedDiscipline);
                setSolves(fetchedSolves);
            } catch (error) {
                console.error("Failed to fetch solves:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserSolves();
        setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));

    }, [currentUUID, selectedDiscipline]);

    const deleteSolve = (solveID: number) => {
        setOpenedSolveDetailsDialog(false);
        dbWriter.deleteSolve(solveID);
        setSolves(prevSolves => {
            return prevSolves.filter(solve => solve.id !== solveID);
        });
        setTimerStatus(TimerStatus.Idle);
    }

    const handleUpdateSolveStatus = (oldSolve: ISolve, newStatus: Status) => {
        const updatedSolve: ISolve = solveWithUpdatedStatus(oldSolve, newStatus);
        dbWriter.updateSolveStatus(updatedSolve);
        setSolves(prevSolves => {
            return prevSolves.map(solve => {
                if (solve.id === updatedSolve.id) {
                    return updatedSolve;
                }
                return solve;
            });
        });
    }

    const handleKeyDown = useCallback(async (event: KeyboardEvent) => {
        // Stop timer on space down
        if (event.code === 'Space') {
            event.preventDefault();
            if (timerStatus === TimerStatus.Running) {
                setTimerStatus(TimerStatus.Idle)
            } else if (timerStatus === TimerStatus.Idle || timerStatus === TimerStatus.Cancelled || timerStatus === TimerStatus.InspectionCancelled) {
                if (settings.inspection &&
                    !inspectionLessDisciplines.includes(selectedDiscipline)) {
                    setTimerStatus(TimerStatus.ReadyForInspection);
                } else {
                    setTimerStatus(TimerStatus.Ready);
                }
                setReadySince(Date.now());
            } else if (timerStatus === TimerStatus.Inspecting) {
                setTimerStatus(TimerStatus.Ready);
                setReadySince(Date.now());
            }
        }

        // Cancel solve on esc
        if (event.key === 'Escape') {
            if (timerStatus === TimerStatus.Running) {
                event.preventDefault();
                setTimerStatus(TimerStatus.Cancelled);
            } else if (timerStatus === TimerStatus.Inspecting) {
                event.preventDefault();
                setTimerStatus(TimerStatus.InspectionCancelled);
            }
        }
    }, [timerStatus, dbWriter, currentScramble, selectedDiscipline, settings]);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        // Start solve on space up
        if (event.code === "Space") {
            if (timerStatus !== TimerStatus.Running) {
                if (timerStatus === TimerStatus.Ready) {
                    event.preventDefault();
                    if (Date.now() - readySince > settings.readyAfter) {
                        setTimerStatus(TimerStatus.Running);
                    } else {
                        setTimerStatus(TimerStatus.Inspecting);
                        setReadySince(-1);
                    }
                } else if (timerStatus === TimerStatus.ReadyForInspection) {
                    event.preventDefault();
                    console.log(settings.readyAfter)
                    if (Date.now() - readySince > settings.readyAfter) {
                        setTimerStatus(TimerStatus.Inspecting);
                    } else {
                        setTimerStatus(TimerStatus.Idle);
                        setReadySince(-1);
                    }
                }
            }
        }
    }, [timerStatus, settings]);

    const handleSolveComplete = async (finalTime: number, dnf: boolean) => {
        if (dnf) {
            setTimerStatus(TimerStatus.Cancelled);
        }
        const solveStatus: Status = dnf ? Status.DNF : Status.Valid;

        const solve: ISolve = await dbWriter.insertSolve({
            uuid: currentUUID, duration: finalTime, date: new Date(), scramble: currentScramble,
            discipline: selectedDiscipline, status: solveStatus, session: "default"
        });
        setSolves(prev => [solve, ...prev]);
        setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));

        // const tempSolve: ISolve = {
        //     id: -1, uuid: currentUUID, duration: finalTime, date: new Date(), scramble: currentScramble,
        //     discipline: selectedDiscipline, status: solveStatus, session: "default"
        // };
        // setSolves(prevSolves => [tempSolve, ...prevSolves]);
        // setCurrentScramble(scrambleGenerator.generateScramble(selectedDiscipline));
        // dbWriter.insertSolve(tempSolve).then((realSolve) => {
        //     setSolves(prev => prev.map(s => s.id === -1 ? realSolve : s));
        // });
    }

    // Register keyboard listeners
    useEffect(() => {
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("keydown", handleKeyDown)
        };
    }, [handleKeyDown, handleKeyUp])


    const openSolveDetailsScreen = useCallback((solve: ISolve) => {
        setSelectedSolve(solve);
        setOpenedSolveDetailsDialog(true);
    }, []);

    const getScrambleFontSize = (scramble: string) => {
        const len = scramble.length;
        if (len < 70) return "2rem";
        if (len < 130) return "1.6rem";
        return "1.3rem";
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", height: "100%", width: "100%" }}>
            <Box sx={{
                flex: 1, display: "flex", flexDirection: 'column', justifyContent: "space-around", bgcolor: "primary.main",
                paddingLeft: "75px", paddingRight: "75px", paddingTop: "2rem", position: "relative"
            }}>
                <IconButton
                    sx={{
                        position: "absolute", right: 25, top: 25,
                        userSelect: "none"
                    }}
                    color="inherit"
                    onClick={() => { setSettingsOpen(true) }}
                >
                    <SettingsIcon sx={{
                        fontSize: "2rem", color: "info.main", '&:hover': {
                            opacity: 0.8
                        },
                    }} />
                </IconButton>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ flex: 1, fontSize: getScrambleFontSize(currentScramble), fontFamily: "Space Mono, monospace" }}>{currentScramble}</Typography>
                </Box>
                <Box sx={{ flex: 5, display: "flex", flexDirection: "column", justifyContent: "space-evenly" }}>
                    <Box sx={{ flex: 4, display: "grid", alignItems: "center" }}>
                        <TimerDisplay timerStatus={timerStatus} onSolveComplete={handleSolveComplete} inspectionEnabled={settings.inspection &&
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
            </Box>
            <Divider orientation="vertical" sx={{ bgcolor: "info.main" }} flexItem component="div" />
            <Box sx={{ bgcolor: "secondary.main", height: "100%", margin: 0, padding: 0 }}>
                <TimeDisplay solves={processedSolves} openSolveDetailsScreen={openSolveDetailsScreen} />
            </Box>
            {selectedSolve && (
                <SolveDetailsScreen solve={selectedSolve} onDeleteSolve={deleteSolve} onUpdateStatus={handleUpdateSolveStatus} isOpen={openedSolveDetailsDialog}
                    onClose={() => { setOpenedSolveDetailsDialog(false) }} dbWriter={dbWriter}></SolveDetailsScreen>
            )}
            <TimerSettings isOpen={settingsOpen} onClose={() => { setSettingsOpen(false) }} settings={settings} updateSetting={updateSetting} />
        </Box>

    );
}

export default TimerScreen;