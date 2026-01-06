import { Card, Paper, Table, TableCell, tableCellClasses } from "@mui/material";
import { Box, styled } from "@mui/system";

export const SidebarCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'isCollapsed'
})(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    overflow: 'visible',
    position: "relative",
    
    width: "100%",
    height: "100%",
}));

export const FadeContent = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isCollapsed'
})<{ isCollapsed: boolean }>(({ isCollapsed }) => ({
    // width: '100%',
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
        paddingTop: "0.75rem",
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