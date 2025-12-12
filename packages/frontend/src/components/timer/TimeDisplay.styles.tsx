import { Card, IconButton, Paper, Table, TableCell, tableCellClasses } from "@mui/material";
import { Box, styled } from "@mui/system";

export const SidebarCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isCollapsed'
})<{ isCollapsed: boolean }>(({ theme, isCollapsed }) => ({
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    overflow: 'hidden',
    position: "relative",
    
    width: !isCollapsed ? "100%" : '42px',
    height: !isCollapsed ? "100%" : '42px',
    transition: 'width 0.3s cubic-bezier(0.19, 1, 0.22, 1), height 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
}));

export const ToggleButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    color: theme.palette.text.secondary,
}));

export const FadeContent = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isCollapsed'
})<{ isCollapsed: boolean }>(({ isCollapsed }) => ({
    width: '100%',
    height: "100%",
    opacity: isCollapsed ? 0 : 1,
    pointerEvents: isCollapsed ? 'none' : 'auto',
    
    transition: !isCollapsed
        ? `opacity 1s cubic-bezier(0.19, 1, 0.22, 1) 0.1s`
        : `opacity 0.1s cubic-bezier(0.19, 1, 0.22, 1) 0s`,
}));

export const PanelPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    border: "1px solid #333333",
    borderRadius: "8px",
    display: "flex",
    padding: "1rem",
}));

export const CompactTable = styled(Table)(({ }) => ({
    [`& .${tableCellClasses.root}`]: {
        borderBottom: "none",
        padding: "0 0",
        paddingTop: "1rem",
    },
    [`& .${tableCellClasses.head}`]: {
        padding: 0,
        height: "auto",
    },
}));

export const LabelCell = styled(TableCell)({
    fontSize: '1.3rem',
    fontWeight: "bold"
});

export const MonoCell = styled(TableCell)({
    fontFamily: "IBM Plex Mono",
    fontSize: "1.05rem",
    textAlign: "right"
});