import { Discipline } from '@cubing/shared';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, Paper, Select, Typography } from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { Box, Stack, useTheme } from "@mui/system";
import { useState } from 'react';
import { EVENT_AND_DISCIPLINES_MAP } from '../../utils/constants';
import FileUpload from './FileUpload';
import { extractCsTimerSession } from '../../utils/importUtils';

const IMPORT_SOURCES = ["CsTimer"]

function ImportDialog({ isOpen, onClose, selectedDiscipline }: { isOpen: boolean, onClose: Function, selectedDiscipline: Discipline }) {
    const theme = useTheme();
    const [toDiscipline, setToDiscipline] = useState<Discipline>(selectedDiscipline);
    const [importFrom, setImportFrom] = useState<string>("CsTimer");
    const [currentFile, setCurrentFile] = useState<any>(null);

    const handleDisplayChange = (event: any) => {
        setToDiscipline(event.target.value);
    };

    return (
        <Dialog open={isOpen}>
            <DialogTitle sx={{ textAlign: "center", fontSize: "3rem", fontWeight: "bold", color: "#FFFFFF" }}>Import Times
                <IconButton
                    aria-label="close"
                    onClick={() => onClose()}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8, color: "secondary.light",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{
                borderColor: "rgba(255, 255, 255, 0.06)",
                color: "#E4E4E7",
                p: 4
            }} dividers>
                <Stack spacing={2}>
                    <Typography variant="overline" display="block" gutterBottom >
                        Import
                    </Typography>
                    <Stack spacing={2} direction="row">
                        <FormControl fullWidth size="small">
                            <InputLabel>Import from</InputLabel>
                            <Select
                                value={importFrom}
                                variant="outlined"
                                label="Import from"
                                onChange={(event: any) => setImportFrom(event.target.value)}
                                renderValue={(selected) => selected}
                            >
                                {IMPORT_SOURCES.map((source: string) => (
                                    <MenuItem key={source} value={source} sx={{
                                        display: 'flex',
                                        flexDirection: "row",
                                        justifyContent: 'space-between', // Pushes text left, icon right
                                        alignItems: 'center',
                                        gap: 2 // Ensures text doesn't hit the checkmark
                                    }}>
                                        <ListItemText primary={source} />
                                        {importFrom === source && (
                                            <CheckRoundedIcon
                                                sx={{
                                                    color: theme.palette.info.main,
                                                    fontSize: '1.2rem'
                                                }}
                                            />
                                        )}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Source of import file</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth size="small">
                            <InputLabel>Event</InputLabel>
                            <Select
                                value={toDiscipline}
                                variant="outlined"
                                label="Event"
                                onChange={handleDisplayChange}
                                renderValue={(selected) => selected}
                            >
                                {[...EVENT_AND_DISCIPLINES_MAP.keys()].map((disc: Discipline) => (
                                    <MenuItem key={disc} value={disc} sx={{
                                        display: 'flex',
                                        flexDirection: "row",
                                        justifyContent: 'space-between', // Pushes text left, icon right
                                        alignItems: 'center',
                                        gap: 2 // Ensures text doesn't hit the checkmark
                                    }}>
                                        <ListItemText primary={disc} />
                                        {toDiscipline === disc && (
                                            <CheckRoundedIcon
                                                sx={{
                                                    color: theme.palette.info.main,
                                                    fontSize: '1.2rem'
                                                }}
                                            />
                                        )}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Event of imported times</FormHelperText>
                        </FormControl>
                    </Stack>
                    {currentFile === null ? (
                        <FileUpload currentFile={currentFile} uploadFile={(file: any) => { setCurrentFile(file); extractCsTimerSession(file) }}></FileUpload>
                    ) : (
                        <Box>
                            {/* File Card */}
                            <Paper
                                variant="outlined"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    borderColor: 'success.light',
                                    backgroundColor: theme.palette.secondary.light
                                }}
                            >
                                <InsertDriveFileIcon sx={{ color: 'primary.main', mr: 2, fontSize: 30 }} />

                                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                    <Typography variant="subtitle2" noWrap>
                                        {currentFile.name}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {(currentFile.size / 1024).toFixed(1)} KB
                                    </Typography>
                                </Box>

                                <IconButton onClick={() => setCurrentFile(null)} color="error" title="Delete file">
                                    <DeleteIcon />
                                </IconButton>
                            </Paper>

                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, color: 'success.main' }}>
                                <CheckCircleIcon />
                                <Typography variant="subtitle1" fontWeight="bold">
                                    File uploaded successfully!
                                </Typography>
                            </Stack>
                        </Box>
                    )
                    }
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default ImportDialog;