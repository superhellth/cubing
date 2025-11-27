import { Paper, Typography } from "@mui/material";
import { Heatmap } from "./Heatmap";
import theme from "../../styles/theme";

const ActivityCard = () => {
    const heatmapData = [
    [5, 12, 15, 8, 4, 1, 0],   // 6am
    [10, 25, 20, 15, 10, 5, 2],// 10am
    [15, 30, 45, 30, 15, 8, 4],// 12am (Lunch spike)
    [20, 25, 35, 40, 25, 10, 5]
  ];

    const days = ["M", "T", "W", "T", "F", "S", "S"];
    const weeks = ['This week', 'Last week', '2 Weeks ago', '3 Weeks ago'];

    return (
        <Paper>
            <Typography>Recent Activity</Typography>
            <Heatmap
                data={heatmapData}
                xLabels={days}
                yLabels={weeks}
                minColor={theme.palette.primary.main}
                maxColor={theme.palette.info.main}
            />
        </Paper>
    );
}

export default ActivityCard;