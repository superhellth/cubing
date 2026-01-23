import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

function ConfirmDeleteManyDialog({ isOpen, onClose, onConfirm }: any) {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
        >
            <DialogTitle sx={{ color: "error.main", display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeleteIcon /> Delete Solves?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This will permanently remove these times from your history and recalculate your averages.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={() => { onConfirm(); onClose(); }}
                    variant="contained"
                    color="error"
                    disableElevation
                >
                    Confirm Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDeleteManyDialog;