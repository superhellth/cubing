import { Paper } from "@mui/material";
import { styled } from "@mui/system";

export const SessionCard = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    backdropFilter: "blur(12px)",

    border: "1px solid",
    borderColor: "transparent",
    borderRadius: "16px",

    padding: theme.spacing(2.5),
    gap: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    transition: "all 0.3s ease",
    "&:hover": {
        borderColor: theme.palette.text.secondary,
    }
}));