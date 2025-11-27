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
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: `auto repeat(${xLabels.length}, 1fr)`,
                    gap: 1,
                    alignItems: 'center',
                    padding: "10px"
                }}
            >
                <Box />

                {xLabels.map((label, i) => (
                    <Typography
                        key={`x-${i}`}
                        variant="caption"
                        align="center"
                        sx={{ mb: 0.5 }}
                    >
                        {label}
                    </Typography>
                ))}

                {data.map((row, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>

                        <Typography
                            variant="caption"
                            sx={{ mr: 1, whiteSpace: 'nowrap', textAlign: 'right' }}
                        >
                            {yLabels[rowIndex]}
                        </Typography>

                        {row.map((value, colIndex) => {
                            const range = maxValue - minValue;
                            const intensity = range === 0 ? 0 : (value - minValue) / range;

                            const cellColor = interpolateColor(minColor, maxColor, intensity);

                            return (
                                <Tooltip
                                    key={`cell-${rowIndex}-${colIndex}`}
                                    title={`${yLabels[rowIndex]}, ${xLabels[colIndex]}: ${value} issues`}
                                    arrow
                                    placement="top"
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            paddingTop: '100%',
                                            position: 'relative',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: cellColor,
                                                borderRadius: 1,
                                                transition: theme.transitions.create(['transform', 'box-shadow', 'z-index'], {
                                                    duration: theme.transitions.duration.shortest,
                                                }),
                                                cursor: 'pointer',
                                                zIndex: 1,
                                                '&:hover': {
                                                    transform: 'scale(1.2)',
                                                    zIndex: 10,
                                                    boxShadow: theme.shadows[4],
                                                }
                                            }}
                                        />
                                    </Box>
                                </Tooltip>
                            );
                        })}
                    </React.Fragment>
                ))}
            </Box>
        </Box>
    );
};