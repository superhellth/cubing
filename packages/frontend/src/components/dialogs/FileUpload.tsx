import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { alpha, Box, Fade, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileCard, UploadZone } from './FileUpload.styles';

const FileUpload = ({ currentFile, setCurrentFile }: { currentFile: any, setCurrentFile: Function }) => {
    const theme = useTheme();

    // 1. Handle the file drop
    const onDrop = useCallback((acceptedFiles: any) => {
        // Check if files were actually dropped
        if (acceptedFiles?.length) {
            setCurrentFile(acceptedFiles[0]);
        }
    }, []);

    // 2. Configure the dropzone hook
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt']
        },
        maxFiles: 1,
    });

    return (
        <>
            {currentFile === null ? (
                <Box>
                    {/* Drop Zone Area */}
                    <UploadZone isDragActive={isDragActive} {...getRootProps()}>
                        <input {...getInputProps()} />
                        <CloudUploadIcon sx={{ fontSize: 60, mb: 2 }} />


                        <Typography variant="h6" color="textPrimary">
                            Drag & drop the import file here
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            or click to select
                        </Typography>

                    </UploadZone>
                </Box>


            ) : (
                <Box sx={{ width: '100%' }}>
                    <Fade in={true} timeout={500}>
                        <Box>
                            <FileCard>

                                <InsertDriveFileIcon sx={{ color: theme.palette.text.secondary, fontSize: "3rem" }} />

                                {/* File Details */}
                                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                    <Typography
                                        variant="body1"
                                        fontWeight="600"
                                        noWrap
                                        color="text.primary"
                                    >
                                        {currentFile.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontFamily: 'monospace', letterSpacing: 0.5 }}
                                    >
                                        {(currentFile.size / 1024).toFixed(1)} KB
                                    </Typography>
                                </Box>

                                {/* Delete Action */}
                                <Tooltip title="Remove file">
                                    <IconButton
                                        onClick={() => setCurrentFile(null)}
                                        sx={{
                                            fontSize: "3rem",
                                            color: 'text.secondary',
                                            "&:hover": {
                                                color: 'error.main',
                                                bgcolor: alpha(theme.palette.error.main, 0.1)
                                            }
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </FileCard>

                            {/* Success Status Message */}
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{
                                    pl: 1,
                                    color: 'success.main',
                                    opacity: 0.9
                                }}
                            >
                                <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
                                <Typography variant="body2" fontWeight="600">
                                    Upload complete
                                </Typography>
                            </Stack>
                        </Box>
                    </Fade>
                </Box>
            )
            }
        </>
    );
};

export default FileUpload;