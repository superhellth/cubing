import { Box, Paper, Typography } from "@mui/material";
import { Heatmap } from "../graphs/Heatmap";
import theme from "../../styles/theme";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { GraphCard } from "../GraphCard";

const ActivityCard = () => {
    const heatmapData = [
        [5, 12, 15, 8, 4, 1, 0],
        [10, 25, 20, 15, 10, 5, 2],
        [15, 20, 45, 30, 15, 8, 4],
        [20, 25, 35, 10, 5, 1, 5]
    ];

    const days = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];
    const weeks = ['This week', 'Last week', '2 Weeks ago', '3 Weeks ago'];

    return (
        <GraphCard title={"Recent Activity"} icon={<FitnessCenterIcon />}>
            <Box sx={{
                flex: 1,
                width: "100%",
                height: "100%",
                display: "grid",
                placeItems: "center"
            }}>
                <Typography>Coming Soon...</Typography>
            </Box>

        </GraphCard>
    );
}

export default ActivityCard;