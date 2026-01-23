import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { alpha, Box, Fade, IconButton, LinearProgress, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileCard, UploadZone } from './FileUpload.styles';

const FileUpload = ({ currentFile, setCurrentFile, hasError }: { currentFile: any, setCurrentFile: Function, hasError: boolean }) => {
    const theme = useTheme();
    // 1. Add local state to track uploading status
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback((acceptedFiles: any) => {
        if (acceptedFiles?.length) {
            // 2. Start loading immediately
            setUploading(true);

            // SIMULATION: Simulate a 2-second network request
            // In a real app, you would await your API call here
            setTimeout(() => {
                setCurrentFile(acceptedFiles[0]);
                setUploading(false); // Stop loading when done
            }, 2000);
        }
    }, [setCurrentFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/plain': ['.txt'] },
        maxFiles: 1,
        // Disable dropzone while uploading
        disabled: uploading
    });

    // 3. Helper to determine what to render
    const renderContent = () => {
        // CASE A: Uploading State
        if (uploading) {
            return (
                <Fade in={true}>
                    <Box sx={{ width: '100%' }}>
                        <FileCard sx={{ borderColor: theme.palette.primary.main }}>
                            {/* Spinning or pulsing icon */}
                            <InsertDriveFileIcon sx={{ color: theme.palette.primary.main, opacity: 0.5, fontSize: "3rem" }} />

                            <Box sx={{ flexGrow: 1, px: 2 }}>
                                <Typography variant="body2" fontWeight="600" gutterBottom>
                                    Uploading...
                                </Typography>
                                {/* The Progress Bar */}
                                <LinearProgress
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                                    }}
                                />
                            </Box>
                        </FileCard>
                    </Box>
                </Fade>
            );
        }

        // CASE B: Success State (File exists)
        if (currentFile) {
            return (
                <Fade in={true} timeout={500}>
                    <Box sx={{ width: '100%' }}>
                        <FileCard sx={{borderColor: hasError ? theme.palette.error.main : theme.palette.success.main}}>
                            <InsertDriveFileIcon sx={{ color: theme.palette.text.secondary, fontSize: "3rem" }} />

                            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                <Typography variant="body1" fontWeight="600" noWrap color="text.primary">
                                    {currentFile.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                    {(currentFile.size / 1024).toFixed(1)} KB
                                </Typography>
                            </Box>

                            <Tooltip title="Remove file">
                                <IconButton
                                    onClick={() => setCurrentFile(null)}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': { color: 'error.main', bgcolor: alpha(theme.palette.error.main, 0.1) }
                                    }}
                                >
                                    <DeleteIcon fontSize="large" />
                                    {/* Note: I adjusted fontSize to "large" as "3rem" on iconbutton can be messy */}
                                </IconButton>
                            </Tooltip>
                        </FileCard>

                        {/* Success Message */}
                        {!hasError ? (
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1, mt: 1, color: 'success.main', opacity: 0.9 }}>
                                <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2" fontWeight="600">Upload complete</Typography>
                            </Stack>
                        ) : (
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1, mt: 1, color: theme.palette.error.main, opacity: 0.9 }}>
                                <ErrorOutlineIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2" fontWeight="600">Error reading file</Typography>
                            </Stack>
                        )}
                    </Box>
                </Fade>
            );
        }

        // CASE C: Empty State (Default Dropzone)
        return (
            <UploadZone isDragActive={isDragActive} {...getRootProps()}>
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 60, mb: 2, color: isDragActive ? 'primary.main' : 'inherit' }} />
                <Typography variant="h6" color="textPrimary">
                    Drag & drop the import file here
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    or click to select
                </Typography>
            </UploadZone>
        );
    };

    return (
        <Box sx={{ width: '100%' }}>
            {renderContent()}
        </Box>
    );
};

export default FileUpload;