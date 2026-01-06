import { Paper } from "@mui/material";
import { Box, styled } from "@mui/system";

export const ImprovementChartCard = styled(Paper)(({ theme }) => ({
    height: "100%",
    width: '100%',
    overflow: 'hidden',
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.primary.main,
    borderRadius: '16px',
    padding: theme.spacing(2),
    boxShadow: 'none',
    border: '1px solid #27272a',
    position: "relative",
}));

export const LockedOverlay = styled(Box)(() => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
}));

export const BlurrableContent = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isLocked',
})<{ isLocked: boolean }>(({ isLocked }) => ({
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 0,
    filter: isLocked ? "blur(6px)" : "none",
    userSelect: isLocked ? "none" : "auto",
    opacity: isLocked ? 0.5 : 1,
}));

export const HeaderRow = styled(Box)(({  }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
}));

export const ChartContainer = styled(Box)({
    flexGrow: 1,
    minHeight: 0,
});