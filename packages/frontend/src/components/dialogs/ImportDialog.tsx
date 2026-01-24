import { Discipline, ImportSource, type NewSolve, type StatlessSolve } from '@cubing/shared';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Button, Chip, CircularProgress, DialogActions, Typography, Zoom } from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { alpha, Box, Stack, useTheme } from "@mui/system";
import { useEffect, useState } from 'react';
import { useSolves } from '../../contexts/SolveContext';
import { useExtractSessions } from '../../hooks/useExtractSessions';
import { useUserID } from '../../hooks/useUserID';
import DBReader from '../../services/dbReader';
import DBWriter from '../../services/dbWriter';
import CCSingleSelect from '../CCSingleSelect';
import HCButton from '../HCButton';
import FileUpload from './FileUpload';
import ImportDetailSelectDialog from './ImportDetailSelectDialog';
import { SessionCard } from './ImportDialog.styles';
import LimitReachedDialog from './LimitReachedDialog';

const IMPORT_SOURCES = [ImportSource.CsTimer, ImportSource.CubicTimer]

function ImportDialog({ isOpen, onClose, selectedDiscipline }: { isOpen: boolean, onClose: Function, selectedDiscipline: Discipline }) {
    const theme = useTheme();
    const userID = useUserID();
    const [importFrom, setImportFrom] = useState<ImportSource>(ImportSource.CsTimer);
    const [currentFile, setCurrentFile] = useState<any>(null);

    const { sessions, error } = useExtractSessions(currentFile, importFrom);
    const [selectedSession, setSelectedSession] = useState<any | null>(null);
    const [importedSessions, setImportedSessions] = useState<number[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [limitReachedDialogIsOpen, setLimitReachedDialogIsOpen] = useState<boolean>(false);
    const { insertBulk } = useSolves();

    useEffect(() => {
        if (currentFile == null) {
            setImportedSessions([]);
        }
    }, [currentFile])

    // TODO: Move to useSolveManager
    const importSolves = async (solves: any[], toDisc: Discipline, checkDuplicates: boolean) => {
        setIsUploading(true);
        const asNewSolves: NewSolve[] = [];
        // Update Discipline
        for (let solve of solves) {
            asNewSolves.push({
                ...solve,
                discipline: toDisc
            });
        }

        let toInsert: NewSolve[] = asNewSolves;
        if (checkDuplicates) {
            const solvesToCompare: StatlessSolve[] = await DBReader.instance.getSolvesByImportSource(userID, importFrom);
            const solvesFromDisc: StatlessSolve[] = await DBReader.instance.getSolvesByDisciplineAndSession(userID, toDisc, "default");
            const solvesFromDiscKeys: bigint[] = solvesFromDisc.map(s => s.pk);
            const existingImportKeys: bigint[] = solvesToCompare.filter(s => solvesFromDiscKeys.includes(s.pk)).map(s => s.importKey!);
            toInsert = toInsert.filter(s => !existingImportKeys.includes(s.importKey!));
        }

        // Register new solves if imported to current discipline, else only write to db
        try {

            if (selectedDiscipline === toDisc) {
                await insertBulk(toInsert);
            } else {
                await DBWriter.instance.insertSolvesBulk(toInsert);
            }
            setImportedSessions(prev => [...prev, selectedSession.name]);
            setIsUploading(false);
        } catch (error: any) {
            setIsUploading(false);
            setLimitReachedDialogIsOpen(true);
        }
    }

    const handleClose = () => {
        onClose();
        setCurrentFile(null);
    }

    return (
        <>
            <Dialog open={isOpen}>
                <DialogTitle sx={{ textAlign: "center", fontSize: "3rem", fontWeight: "bold", color: "#FFFFFF" }}>Import Solves
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
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
                        <FileUpload currentFile={currentFile} setCurrentFile={setCurrentFile} hasError={error != null}></FileUpload>
                        {sessions != null &&
                            <>
                                <Typography variant="overline" display="block" gutterBottom >
                                    Sessions found:
                                </Typography>
                                {sessions.map((session: any) => {
                                    return (
                                        <SessionCard
                                            key={session.name}
                                            elevation={0}
                                        >
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                <Typography variant="h6" fontWeight="700" color="text.primary">
                                                    Session {session.name}
                                                </Typography>

                                                <Box>
                                                    <Chip
                                                        label={`${session.solveCount} Solves`}
                                                        size="small"
                                                        sx={{
                                                            height: 24,
                                                            fontWeight: 500,
                                                            bgcolor: theme.palette.secondary.dark,
                                                            color: theme.palette.text.secondary,
                                                            border: '1px solid',
                                                            borderColor: alpha(theme.palette.secondary.main, 0.2)
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            {isUploading ? (
                                                <Zoom in={true} key="loading">
                                                    <CircularProgress color='info' />
                                                </Zoom>
                                            ) : (
                                                <>
                                                    {importedSessions.includes(session.name) ? (
                                                        <Zoom in={true} key="check">
                                                            <Box
                                                                sx={{
                                                                    p: 1,
                                                                    borderRadius: "50%",
                                                                    bgcolor: alpha(theme.palette.success.main, 0.1),
                                                                    display: 'flex'
                                                                }}
                                                            >
                                                                <CheckRoundedIcon color="success" sx={{ fontSize: "1.8rem" }} />
                                                            </Box>
                                                        </Zoom>
                                                    ) : (
                                                        <Zoom in={true} key="upload">
                                                            <div style={{ display: 'inline-block' }}>
                                                                <HCButton onClick={() => setSelectedSession(session)}>
                                                                    <FileUploadIcon sx={{ fontSize: "2.4rem" }} />
                                                                </HCButton>
                                                            </div>
                                                        </Zoom>
                                                    )}
                                                </>
                                            )
                                            }
                                        </SessionCard>
                                    );
                                })}
                            </>
                        }
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color="info"
                    >
                        Done
                    </Button>
                </DialogActions>
            </Dialog >
            <ImportDetailSelectDialog onClose={() => setSelectedSession(null)} session={selectedSession} defaultDiscipline={selectedDiscipline}
                importSolves={importSolves} />
            <LimitReachedDialog isOpen={limitReachedDialogIsOpen} handleClose={() => setLimitReachedDialogIsOpen(false)} />
        </>
    );
}

export default ImportDialog;