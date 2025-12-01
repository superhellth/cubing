import {
    Box,
    Tooltip,
    Typography,
    useTheme
} from '@mui/material';
import React from 'react';

// --- Types ---
interface HeatmapProps {
    data: number[][];
    xLabels: string[];
    yLabels: string[];
    minColor?: string;
    maxColor?: string;
}

const interpolateColor = (color1: string, color2: string, factor: number) => {
    if (factor === 0) return color1;
    if (factor >= 1) return color2;

    const result = color1.slice(1).match(/.{2}/g)!.map((hex, i) => {
        const v1 = parseInt(hex, 16);
        const v2 = parseInt(color2.slice(1).match(/.{2}/g)![i], 16);
        const val = Math.round(v1 + factor * (v2 - v1));
        return val.toString(16).padStart(2, '0');
    });
    return `#${result.join('')}`;
};

export const Heatmap: React.FC<HeatmapProps> = ({
    data,
    xLabels,
    yLabels,
    minColor = "white",
    maxColor = "black",
}) => {
    const theme = useTheme();

    const allValues = data.flat();
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);

    return (
        // 1. Ensure the container takes full size
        <Box sx={{ width: '100%', height: "100%", overflow: 'hidden' }}>
            <Box
                sx={{
                    display: 'grid',
                    width: '100%',
                    height: '100%',
                    padding: "10px",
                    boxSizing: 'border-box',
                    // Defines: 1st Col = Labels (auto width), Rest = Data (equal width)
                    gridTemplateColumns: `auto repeat(${xLabels.length}, 1fr)`,
                    // Defines: 1st Row = Labels (auto height), Rest = Data (equal height)
                    gridTemplateRows: `auto repeat(${yLabels.length}, 1fr)`,
                    gap: 1,
                }}
            >

                {/* 2. TOP ROW HEADERS (X-AXIS) */}
                {xLabels.map((label, i) => (
                    <Box key={`x-${i}`} sx={{ display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
                        <Typography variant="caption" align="center" sx={{ mb: 0.5 }}>
                            {label}
                        </Typography>
                    </Box>
                ))}

                {/* 3. DATA ROWS */}
                {data.map((row, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>

                        {/* === MISSING PIECE: THE Y-AXIS LABEL === */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', p: 0, m: 0, width: 0 }}>
                            {/* <Typography variant="caption" align="right">
                                {yLabels[rowIndex]}
                            </Typography> */}
                        </Box>

                        {row.map((value, colIndex) => {
                            const range = maxValue - minValue;
                            const intensity = range === 0 ? 0 : (value - minValue) / range;
                            const cellColor = interpolateColor(minColor, maxColor, intensity);

                            return (
                                <Box
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    sx={{
                                        width: '100%',
                                        aspectRatio: '1 / 1',
                                        display: 'flex',
                                    }}
                                >
                                    <Tooltip
                                        title={`${yLabels[rowIndex]}, ${xLabels[colIndex]}: ${value}`}
                                        arrow
                                        placement="top"
                                    >
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: cellColor,
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                transition: (theme) => theme.transitions.create(
                                                    ['transform', 'box-shadow', 'z-index'],
                                                    { duration: theme.transitions.duration.shortest }
                                                ),
                                                '&:hover': {
                                                    transform: 'scale(1.15)',
                                                    boxShadow: (theme) => theme.shadows[6],
                                                    zIndex: 10,
                                                    position: 'relative',
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                </Box>
                            );
                        })}
                    </React.Fragment>
                ))}
            </Box>
        </Box>
    );
};