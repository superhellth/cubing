import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Dialog from '@mui/material/Dialog';

function LimitReachedDialog({ isOpen, handleClose }: { isOpen: boolean, handleClose: Function }) {
    return (
        <Dialog
            open={isOpen}
            onClose={() => handleClose()}
        >
            <DialogTitle>
                {"Limit Reached"}
            </DialogTitle>

            <DialogContent>
                <DialogContentText sx={{color: "text.primary"}}>
                    You have reached the maximum number of solves (5000).
                    Please delete some older solves before adding new ones.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => handleClose()} autoFocus sx={{color: "info.main"}}>
                    Okay
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LimitReachedDialog;