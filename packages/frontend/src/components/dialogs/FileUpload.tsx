import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { alpha, Box, Fade, IconButton, Paper, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

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
                    <Paper
                        variant="outlined"
                        {...getRootProps()}
                        sx={{
                            textAlign: 'center',
                            cursor: 'pointer',
                            bgcolor: theme.palette.secondary.light,
                            p: 2,
                            backgroundColor: isDragActive ? theme.palette.secondary.light : theme.palette.secondary.dark,
                            borderColor: isDragActive ? 'primary.main' : 'grey.300',
                            borderStyle: 'dashed',
                            borderRadius: "10px",
                            borderWidth: 2,
                            transition: 'border .24s ease-in-out',
                            '&:hover': {
                                borderColor: 'primary.main',
                                backgroundColor: theme.palette.secondary.main
                            }
                        }}
                    >
                        <input {...getInputProps()} />
                        <CloudUploadIcon sx={{ fontSize: 60, mb: 2 }} />


                        <Typography variant="h6" color="textPrimary">
                            Drag & drop the import file here
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            or click to select
                        </Typography>

                    </Paper>
                </Box>


            ) : (
                <Box sx={{ width: '100%' }}>
                    <Fade in={true} timeout={500}>
                        <Box>
                            {/* The File Card */}
                            <Paper
                                variant="outlined"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    mb: 1.5, // Spacing between card and success text
                                    gap: 2,
                                    borderRadius: "12px",
                                    // Glassy Dark Theme Look
                                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                                    backdropFilter: "blur(10px)",
                                    // The border carries the "Success" meaning subtly
                                    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                                    transition: "border-color 0.2s, background-color 0.2s",
                                    "&:hover": {
                                        bgcolor: alpha(theme.palette.background.paper, 0.8),
                                        borderColor: theme.palette.success.main,
                                    }
                                }}
                            >
                                {/* Icon Container */}
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: "8px",
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main
                                    }}
                                >
                                    <InsertDriveFileIcon fontSize="medium" />
                                </Box>

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
                                        size="small"
                                        sx={{
                                            color: 'text.secondary',
                                            "&:hover": {
                                                color: 'error.main',
                                                bgcolor: alpha(theme.palette.error.main, 0.1)
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Paper>

                            {/* Success Status Message */}
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{
                                    pl: 1, // Slight indent to align with card content visually
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