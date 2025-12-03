import React, { isValidElement } from 'react';
import { Box, Card, Paper, Tooltip, Typography, useTheme } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';



export const GraphCard = ({
    title,
    icon,
    children,
    hint = "",
    sx = {}
}: any) => {
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
            padding: 1,
            position: "relative",
            ...sx,
        }} >
            {hint !== "" &&
                <Tooltip
                    title={hint}
                    placement="top"
                    arrow
                >
                    <Box
                        component="span"
                        sx={{
                            display: 'inline-flex',
                            position: "absolute", right: 10, top: 10,
                            alignItems: 'center',
                            cursor: 'help',
                            verticalAlign: 'middle'
                        }}
                    >
                        <HelpOutlineIcon
                            sx={{
                                fontSize: '1rem',
                                color: 'text.secondary',
                                transition: 'color 0.2s',
                                '&:hover': {
                                    color: 'text.primary'
                                }
                            }}
                        />
                    </Box>
                </Tooltip>
            }
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