import { Paper, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";

export const TooltipContainer = styled(Paper)(() => ({
    backgroundColor: "rgba(30, 30, 30, 0.90)",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    borderRadius: "8px",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
    padding: "12px",
    width: "auto",
}));

export const DataLabel = styled(Typography)(() => ({
    fontWeight: 300,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
}));

export const ColorBar = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'bg'
})<{ bg: string }>(({ bg }) => ({
    width: 20,
    height: 3,
    background: bg,
}));