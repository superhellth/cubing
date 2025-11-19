import { memo } from 'react';
import Typography from "@mui/material/Typography";
import Timer from './timer';

const TimerDisplay = memo(({ time, timerReady }: {time: number, timerReady: boolean}) => {
    return (
         <Typography sx={{
            fontSize: "15rem", 
            fontFamily: "DSEG7 Classic, monospace", 
            textAlign: "center", 
            color: timerReady ? "info.main" : "text.primary"
        }}>
            {Timer.formatTime(time)}
        </Typography>
    );
});

export default TimerDisplay;