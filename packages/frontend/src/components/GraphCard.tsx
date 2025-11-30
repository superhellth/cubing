import React, { isValidElement } from 'react';
import { Box, Card, Paper, Typography, useTheme } from '@mui/material';

// If you are using TypeScript, uncomment the interface below
interface ChartWidgetProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    height?: string | number;
    sx?: any;
}

export const GraphCard = ({
    title,
    icon,
    children,
    height = "200px",
    sx = {}
}: ChartWidgetProps) => {
    const theme = useTheme();
    return (
        <Paper sx={{
            bgcolor: theme.palette.secondary.main,
            borderRadius: '16px',
            height: "100%",
            boxShadow: 'none',
            border: '1px solid #2C2C2C',
            display: "flex",
            flexDirection: "column",
            ...sx,
        }} >
            <Typography
                sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '0.9rem',
                    pt: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                {isValidElement(icon) && <Box
                    component="span"
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',

                        '& svg': {
                            fill: theme.palette.text.secondary,
                            fontSize: "1rem",
                            width: "auto",
                            height: "0.9rem",
                        }
                    }}
                >
                    {icon}
                </Box>}
                {title}
            </Typography>
            <Box sx={{ flexGrow: 1, padding: 0, margin: 0, flex: 1, minHeight: 0, }}>
                {children}
            </Box>
        </Paper>
    );
};