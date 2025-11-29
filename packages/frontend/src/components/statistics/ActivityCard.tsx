import { Box, Paper, Typography } from "@mui/material";
import { Heatmap } from "../graphs/Heatmap";
import theme from "../../styles/theme";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { GraphCard } from "../GraphCard";

const ActivityCard = () => {
    const heatmapData = [
        [5, 12, 15, 8, 4, 1, 0],
        [10, 25, 20, 15, 10, 5, 2],
        [15, 30, 45, 30, 15, 8, 4],
        [20, 25, 35, 40, 25, 10, 5]
    ];

    const days = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];
    const weeks = ['This week', 'Last week', '2 Weeks ago', '3 Weeks ago'];

    return (
        <GraphCard title={"Activity"} icon={<FitnessCenterIcon />}>
            <Box>
                <Heatmap
                    data={heatmapData}
                    xLabels={days}
                    yLabels={weeks}
                    minColor={theme.palette.primary.main}
                    maxColor={theme.palette.info.main}
                />
            </Box>
        </GraphCard>
    );
}

export default ActivityCard;