import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ currentFile, uploadFile }: { currentFile: any, uploadFile: Function }) => {
    const theme = useTheme();

    // 1. Handle the file drop
    const onDrop = useCallback((acceptedFiles: any) => {
        // Check if files were actually dropped
        if (acceptedFiles?.length) {
            uploadFile(acceptedFiles[0]);
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
    );
};

export default FileUpload;