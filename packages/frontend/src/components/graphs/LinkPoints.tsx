import { useScatterSeries, useXScale, useYScale } from "@mui/x-charts";
import theme from "../../styles/theme";

export function LinkPoints({ seriesId }: { seriesId: string }) {
    const scatter = useScatterSeries(seriesId);
    const xScale = useXScale();
    const yScale = useYScale();

    // Safety checks: ensure the series and axis exist
    if (!scatter || !scatter.data || !xScale || !yScale) {
        return null;
    }

    const { color, data } = scatter;

    // Generate the SVG Path command
    // M = Move to (start), L = Line to
    const dPath = `M ${data
        .map(({ x, y }) => {
            // Convert data values (ID and Duration) to pixel coordinates
            const xPx = xScale(x);
            const yPx = yScale(y);
            // Don't draw if coordinates are invalid
            if (xPx === undefined || yPx === undefined) return '';
            return `${xPx}, ${yPx}`;
        })
        .filter(Boolean) // Remove empty strings
        .join(' L ')}`;

    return (
        <path
            d={dPath}
            fill="none"
            stroke={theme.palette.info.main} // Or use {color} from the series
            strokeWidth={2}
            strokeDasharray="5 5" // Optional: make it dashed to look like a "trend"
            style={{ pointerEvents: 'none' }}
        />
    );
}