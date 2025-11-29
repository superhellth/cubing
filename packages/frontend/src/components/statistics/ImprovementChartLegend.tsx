// Components/ChartLegend.tsx
import { Stack, Box, Typography } from "@mui/material";

interface LegendProps {
    series: any[];
}

export const ImprovementChartLegend = ({ series }: LegendProps) => {
    // Filter out internal scatter points from legend
    const visibleSeries = series.filter(s => s.id !== "pb-scatter");

    return (
        <Stack direction="row" spacing={2} justifyContent="center" mb={1}>
            {visibleSeries.map((item) => (
                <Stack key={item.id} direction="row" alignItems="center" spacing={1}>
                    <Box sx={{
                        width: 20,
                        height: 3,
                        // Handle the dashed style logic here cleanly
                        ...(item.id === "pb-line" ? {
                            background: `repeating-linear-gradient(90deg, ${item.color}, ${item.color} 5px, transparent 5px, transparent 9px)`
                        } : {
                            backgroundColor: item.color
                        })
                    }} />
                    <Typography variant="body2">{item.label}</Typography>
                </Stack>
            ))}
        </Stack>
    );
};