import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme } from "@mui/material";

function ConfirmationDialog({ isOpen, onClose, onConfirm, icon, title, text }: any) {
    const theme = useTheme();

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            slotProps={{ paper: { sx: { borderRadius: 3, border: `1px solid ${theme.palette.error.dark}` } } }}
        >
            <DialogTitle sx={{ color: "error.main", display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon} {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
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

export default ConfirmationDialog;