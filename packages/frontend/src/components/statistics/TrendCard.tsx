import { keyToLabels } from '@cubing/shared';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Paper, Stack, Typography } from "@mui/material";
import { alpha } from '@mui/material/styles';
import { Box, useTheme } from "@mui/system";
import Timer from '../../utils/timer';
import { memo } from 'react';

const TrendCard = memo(({ trend, headerKey, current }: any) => {
    const theme = useTheme();
    console.log(trend)
    return (
        <Paper
            elevation={0}
            sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: theme.palette.primary.main,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
            }}
        >
            <Typography
                variant="caption"
                color={theme.palette.text.secondary}
                fontWeight={400}
                textTransform="uppercase"
                letterSpacing={0.5}
            >
                {keyToLabels[headerKey as keyof typeof keyToLabels]}
            </Typography>

            <Stack
                direction="column"
                alignItems="center"
                spacing={1.5}
            >

                <Typography
                    variant="h5"
                    fontWeight={505}
                    color={theme.palette.text.primary}
                    sx={{
                        lineHeight: 1,
                        fontVariantNumeric: 'tabular-nums',
                        letterSpacing: -1
                    }}
                >
                    {Timer.formatTime(current)}s
                </Typography>

                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                            color: trend.absoluteChange <= 0 ? 'success.main' : 'error.main',
                            fontVariantNumeric: 'tabular-nums'
                        }}
                    >
                        {/* Always show sign for clarity */}
                        {trend.absoluteChange > 0 ? "+" : ""}
                        {(trend.absoluteChange / 1000).toFixed(2)}s
                    </Typography>

                    {/* B. Relative Change (The Pill) */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{
                            bgcolor: (theme) => alpha(trend.absoluteChange <= 0 ? theme.palette.success.main : theme.palette.error.main, 0.1),
                            color: trend.absoluteChange <= 0 ? 'success.main' : 'error.main',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 99,
                            lineHeight: 1
                        }}
                    >
                        {/* Conditional Icon */}
                        {trend.absoluteChange > 0 ? (
                            <TrendingUpIcon sx={{ fontSize: '0.75rem' }} />
                        ) : (
                            <TrendingDownIcon sx={{ fontSize: '0.75rem' }} />
                        )}

                        <Typography
                            variant="caption"
                            fontWeight={700}
                            sx={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                            {Math.abs(trend.relativeChange * 100).toFixed(1)}%
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
})

export default TrendCard;