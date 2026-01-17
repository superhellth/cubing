import { Discipline } from '@cubing/shared';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, useTheme } from "@mui/material";
import { useState } from 'react';
import { EVENT_AND_DISCIPLINES_MAP } from '../../utils/constants';
import CCSingleSelect from '../CCSingleSelect';

function ImportDetailSelectDialog({ session, onClose, importSolves, defaultDiscipline }:
    { session: any, onClose: Function, importSolves: Function, defaultDiscipline: Discipline }) {
    if (session == null) return;
    const theme = useTheme();
    const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline>(defaultDiscipline);
    const [checkDuplicates, setCheckDuplicates] = useState<boolean>(true);

    return (
        <Dialog open={session != null}>
            <DialogTitle sx={{ color: theme.palette.info.main, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileUploadIcon /> Import Solves?
            </DialogTitle>
            <DialogContent sx={{ borderColor: "rgba(255, 255, 255, 0.06)", color: "#E4E4E7", p: 4 }} dividers>
                <DialogContentText sx={{ paddingBottom: 2 }}>
                    Import {session.solves.length} solves from Session {session.name} for:
                </DialogContentText>

                <CCSingleSelect options={[...EVENT_AND_DISCIPLINES_MAP.keys()]}
                    selected={selectedDiscipline}
                    onChange={(event: any) => setSelectedDiscipline(event.target.value)}
                    label="Event" helperText="Import solves to this event" />
                <FormControlLabel
                    control={<Checkbox checked={checkDuplicates} onChange={() => setCheckDuplicates(!checkDuplicates)} />}
                    label="Check for duplicate solves" />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => onClose()} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        importSolves(session.solves, selectedDiscipline, checkDuplicates);
                        onClose();
                    }}
                    variant="contained"
                    color="info"
                    disableElevation
                >
                    Confirm Import
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ImportDetailSelectDialog;