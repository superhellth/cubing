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

export const HeaderRow = styled(Box)(({  }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
}));

export const ChartContainer = styled(Box)({
    flexGrow: 1,
    minHeight: 0,
});