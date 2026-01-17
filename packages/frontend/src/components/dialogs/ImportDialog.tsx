import { Discipline, type NewSolve } from '@cubing/shared';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Paper, Typography } from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { Box, Stack, useTheme } from "@mui/system";
import { useEffect, useState } from 'react';
import { useUserID } from '../../hooks/useUserID';
import DBWriter from '../../services/dbWriter';
import { csTimerFileToObject, csTimerSolveArrayToSolves } from '../../utils/importUtils';
import CCSingleSelect from '../CCSingleSelect';
import HCButton from '../HCButton';
import FileUpload from './FileUpload';
import ImportDetailSelectDialog from './ImportDetailSelectDialog';

const IMPORT_SOURCES = ["CsTimer"]

function ImportDialog({ isOpen, onClose, selectedDiscipline }: { isOpen: boolean, onClose: Function, selectedDiscipline: Discipline }) {
    const theme = useTheme();
    const userID = useUserID();
    const [importFrom, setImportFrom] = useState<string>("CsTimer");
    const [currentFile, setCurrentFile] = useState<any>(null);
    const [csData, setCsData] = useState<any>(null);
    const [relevantCsTimerSessions, setRelevantCsTimerSessions] = useState<any>(null);
    const [selectedSession, setSelectedSession] = useState<number | null>(null);

    useEffect(() => {
        if (currentFile == null) {
            setCsData(null);
            return;
        }
        if (importFrom == "CsTimer") {
            let data;
            const convertToObject = async () => {
                data = await csTimerFileToObject(currentFile);
                setCsData(data);
            }
            convertToObject();
        }
    }, [currentFile])

    useEffect(() => {
        if (csData == null) {
            setRelevantCsTimerSessions(null);
        } else {
            const sessionData = csData.properties.sessionData;
            const relevantSessions: any[] = [];
            Object.entries(sessionData).forEach(([key, value]: any) => {
                if (value.stat && value.stat[0] > 0) {
                    relevantSessions.push({ name: value.name, count: value.stat[0], solves: csData["session" + key] });
                }
            })
            if (relevantSessions.length > 0) {
                setRelevantCsTimerSessions(relevantSessions);
            }
            console.log(relevantSessions);
        }
    }, [csData]);

    const importSolves = (solves: any[], toDisc: Discipline) => {
        const asNewSolves: NewSolve[] = csTimerSolveArrayToSolves(solves, toDisc, userID, "default");
        DBWriter.instance.insertSolvesBulk(asNewSolves);
        // onClose();
    }

    return (
        <>
            <Dialog open={isOpen}>
                <DialogTitle sx={{ textAlign: "center", fontSize: "3rem", fontWeight: "bold", color: "#FFFFFF" }}>Import Solves
                    <IconButton
                        aria-label="close"
                        onClick={() => { onClose(); setCurrentFile(null); }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8, color: "secondary.light",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ borderColor: "rgba(255, 255, 255, 0.06)", color: "#E4E4E7", p: 4 }} dividers>
                    <Stack spacing={2}>
                        <Typography variant="overline" display="block" gutterBottom >
                            Import
                        </Typography>
                        <Stack spacing={2} direction="row">
                            <CCSingleSelect options={IMPORT_SOURCES}
                                selected={importFrom}
                                onChange={(event: any) => setImportFrom(event.target.value)}
                                label="Import from" helperText="Source of import file" />

                        </Stack>
                        <FileUpload currentFile={currentFile} setCurrentFile={setCurrentFile}></FileUpload>
                        {relevantCsTimerSessions != null && importFrom == "CsTimer" &&
                            <>
                                {relevantCsTimerSessions.map((session: any) => {
                                    return (
                                        <Box>
                                            <Paper sx={{
                                                bgcolor: theme.palette.secondary.main,
                                                borderRadius: "10px", p: 2, gap: 2, display: "flex", justifyContent: "space-between", alignItems: "center"
                                            }}>
                                                <Box>
                                                    <Typography>Session {session.name}</Typography>
                                                    <Typography>Solve Count: {session.count}</Typography>

                                                </Box>

                                                <HCButton onClick={() => setSelectedSession(session)}>
                                                    <FileUploadIcon sx={{ fontSize: "2rem" }} />
                                                </HCButton>
                                            </Paper>
                                        </Box>
                                    );
                                })}
                            </>
                        }
                    </Stack>
                </DialogContent>
            </Dialog>
            <ImportDetailSelectDialog onClose={() => setSelectedSession(null)} session={selectedSession} defaultDiscipline={selectedDiscipline}
                importSolves={importSolves} />
        </>
    );
}

export default ImportDialog;