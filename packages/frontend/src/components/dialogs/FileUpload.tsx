import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box, IconButton, Paper, Stack, Typography, useTheme } from '@mui/material';
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
                <Box>
                    {/* File Card */}
                    <Paper
                        variant="outlined"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            borderColor: 'success.light',
                            backgroundColor: theme.palette.secondary.light
                        }}
                    >
                        <InsertDriveFileIcon sx={{ color: 'primary.main', mr: 2, fontSize: 30 }} />

                        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                            <Typography variant="subtitle2" noWrap>
                                {currentFile.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {(currentFile.size / 1024).toFixed(1)} KB
                            </Typography>
                        </Box>

                        <IconButton onClick={() => setCurrentFile(null)} color="error" title="Delete file">
                            <DeleteIcon />
                        </IconButton>
                    </Paper>

                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2, color: 'success.main' }}>
                        <CheckCircleIcon />
                        <Typography variant="subtitle1" fontWeight="bold">
                            File uploaded successfully!
                        </Typography>
                    </Stack>
                </Box>
            )
            }
        </>
    );
};

export default FileUpload;