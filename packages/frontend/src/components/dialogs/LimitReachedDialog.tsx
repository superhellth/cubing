import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Dialog from '@mui/material/Dialog';

function LimitReachedDialog({ isOpen, handleClose }: { isOpen: boolean, handleClose: Function }) {
    return (
        <Dialog
            open={isOpen}
            onClose={() => handleClose()}
            
        >
            <DialogTitle sx={{color: "error.main"}}>
                {"Limit Reached!"}
            </DialogTitle>

            <DialogContent>
                <DialogContentText sx={{color: "text.primary"}}>
                    You have reached the maximum number of solves (10,000).
                    Please delete some older solves before adding new ones.
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => handleClose()} autoFocus color='info' variant="contained" disableElevation>
                    Okay
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LimitReachedDialog;