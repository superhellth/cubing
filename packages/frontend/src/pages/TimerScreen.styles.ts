import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";

export const ScreenContainer = styled(Box)<any>(({ theme, isMobile }) => ({
    display: 'flex',
    flexDirection: isMobile ? "column" : "row",
    backgroundColor: theme.palette.primary.main,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
}));

export const TimerPanel = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // backgroundColor: "red",
    backgroundColor: theme.palette.primary.main,
    alignItems: "center",
    justifyContent: 'space-between',
    padding: "16px 40px",
    position: 'relative',
}));

export const HistoryPanel = styled(Box)(({ theme }) => ({
    height: '100%',
    backgroundColor: theme.palette.secondary.main,
}));

export const ScrambleText = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'charCount',
})<{ charCount: number }>(({ charCount }) => {
    let fontSize = '2rem';
    if (charCount > 130) fontSize = '1.3rem';
    else if (charCount > 70) fontSize = '1.6rem';

    return {
        // color: theme.palette.text.secondary,
        fontSize,
        fontFamily: 'IBM Plex Mono',
        textAlign: 'center',
        width: '100%',
    };
});