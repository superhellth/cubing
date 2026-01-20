import { alpha, Paper, styled } from "@mui/material";

export const UploadZone = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'isDragActive',
})<any>(({ theme, isDragActive }) => ({
    textAlign: 'center',
    cursor: 'pointer',
    padding: theme.spacing(2), // Equivalent to p: 2
    borderStyle: 'dashed',
    borderRadius: '10px',
    borderWidth: 2,
    transition: 'border .24s ease-in-out',

    // Dynamic colors based on props
    backgroundColor: theme.palette.secondary.main,
    borderColor: isDragActive ? theme.palette.text.primary : theme.palette.text.secondary,

    '&:hover': {
        borderColor: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.main,
    },
}));

export const FileCard = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    marginBottom: 0.3,
    gap: theme.spacing(2),
    borderRadius: "12px",
    backgroundColor: theme.palette.secondary.main,
    backdropFilter: "blur(10px)",
    border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
    transition: "border-color 0.2s, background-color 0.2s",
    "&:hover": {
        borderColor: theme.palette.success.main,
    }
}));