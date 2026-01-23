import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
    IconButton,
    Paper,
    Snackbar,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import { Stack } from '@mui/system';
import { memo } from 'react';
import HCButton from '../HCButton';

function WelcomeSnackbar({ isOpen, onClose, onImport }: any) {
    const theme = useTheme();

    const handleImportClick = () => {
        onClose();
        onImport();
    };

    return (
        <Snackbar
            open={isOpen}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            autoHideDuration={8000}
            onClose={() => onClose(false)}
        >
            <Paper
                elevation={6}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    pr: 4,
                    bgcolor: "#1e1e1e",
                    border: `1px solid ${theme.palette.divider}`,
                    position: "relative",
                    minWidth: "350px",
                }}
            >
                <Tooltip title="Don't show again" arrow placement='top'>

                    <IconButton
                        size="small"
                        onClick={() => onClose(true)}
                        sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            color: theme.palette.text.secondary,
                            "&:hover": { color: theme.palette.text.primary },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <AutoAwesomeIcon
                    sx={{
                        color: theme.palette.info.main,
                        fontSize: "2rem",
                    }}
                />

                <Stack spacing={0.5}>
                    <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
                        New Here?
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Import your solves to get started.
                    </Typography>
                </Stack>

                <HCButton
                    onClick={handleImportClick}
                    size="small"
                    sx={{ p: 1, whiteSpace: "nowrap" }}
                >
                    <FileUploadIcon sx={{ fontSize: "1.5rem" }} />
                </HCButton>
            </Paper>
        </Snackbar>
    );
}

export default memo(WelcomeSnackbar);