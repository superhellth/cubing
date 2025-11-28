import { Box, Paper, Typography } from "@mui/material";
import { Heatmap } from "./Heatmap";
import theme from "../../styles/theme";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const ActivityCard = () => {
    const heatmapData = [
        [5, 12, 15, 8, 4, 1, 0],   // 6am
        [10, 25, 20, 15, 10, 5, 2],// 10am
        [15, 30, 45, 30, 15, 8, 4],// 12am (Lunch spike)
        [20, 25, 35, 40, 25, 10, 5]
    ];

    const days = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];
    const weeks = ['This week', 'Last week', '2 Weeks ago', '3 Weeks ago'];

    return (
        <Paper sx={{ height: "200px" }}>
            <Typography
                sx={{
                    color: 'rgb(117, 117, 117)',
                    fontSize: '0.9rem',
                    pt: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <FitnessCenterIcon
                    fill="rgb(117, 117, 117)"
                    width="8px"
                    height="0.9rem"
                />
                Activity
            </Typography>
            <Box>
                <Heatmap
                    data={heatmapData}
                    xLabels={days}
                    yLabels={weeks}
                    minColor={theme.palette.primary.main}
                    maxColor={theme.palette.info.main}
                />
            </Box>
        </Paper>
    );
}

export default ActivityCard;