import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, TextField, useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

function DeleteManyDialog({ isOpen, handleClose, deleteMany }: { isOpen: boolean, handleClose: Function, deleteMany: Function }) {
    const theme = useTheme();
    const [deleteManyInput, setDeleteManyInput] = useState<string>("");
    const handleInputChange = (e: any) => {
        const inputValue = e.target.value;

        // Regex checks for empty string OR digits only (no decimals, no letters)
        if (inputValue === '' || /^\d+$/.test(inputValue)) {
            setDeleteManyInput(inputValue);
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={() => handleClose()}
            PaperProps={{ sx: { borderRadius: 3, border: `1px solid ${theme.palette.error.dark}` } }}
        >
            <DialogTitle sx={{ color: "error.main", display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeleteIcon /> Delete Solves?
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This will permanently remove the selected time and the preceeding X solves from your history and recalculate your averages.
                </DialogContentText>
                <FormControl fullWidth sx={{ alignItems: "center", justifyContent: "center", gap: 1 }}>
                    Delete preceeding X solves:
                    <TextField
                        value={deleteManyInput}
                        onChange={handleInputChange}
                        label="Enter number"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.error.main
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: theme.palette.error.main,
                            },
                        }}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => handleClose()} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        if (deleteManyInput == "" || deleteManyInput.startsWith("0")) {
                            return;
                        }
                        deleteMany(Number(deleteManyInput));
                        setDeleteManyInput("");
                        handleClose();
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

export default DeleteManyDialog;