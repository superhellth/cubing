import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface AverageDialogProps {
    isOpen: boolean;
    onClose: any;
}

function AverageDialog({ isOpen, onClose }: AverageDialogProps) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
        >
            <DialogTitle sx={{ color: "error.main", display: 'flex', alignItems: 'center', gap: 1 }}>
                Average
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    sjflksjflj
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="contained" disableElevation color="info">
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AverageDialog;