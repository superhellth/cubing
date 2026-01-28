import { Box, styled } from "@mui/system";

export const AverageSurface = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.dialog.surface,

    border: "1px solid",
    borderColor: "transparent",
    borderRadius: "16px",

    padding: theme.spacing(2.5),
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    justifyContent: "space-between",
    alignItems: "center",

    transition: "all 0.3s ease",
    "&:hover": {
        borderColor: theme.palette.dialog.border,
    }
}));