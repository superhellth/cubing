import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import {
    GaugeContainer,
    GaugeReferenceArc,
    GaugeValueArc,
    gaugeClasses,
} from '@mui/x-charts/Gauge';
import { getTrafficLightColor } from '../../styles/stylesUtils';
import GaugePointer from './GaugePointer';

interface PercentileGaugeProps {
    percentile: number;
}

export function PercentileGauge({ percentile }: PercentileGaugeProps) {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0, margin: 0 }}>
            <Tooltip title={"Quicker than " + percentile + "% of your solves"} arrow placement='right'>
                <GaugeContainer
                    width={70}
                    height={70}
                    startAngle={-110}
                    endAngle={110}
                    value={percentile}
                    sx={{
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: getTrafficLightColor(percentile / 100),
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: theme.palette.text.primary,
                        },
                    }}
                >
                    <GaugeReferenceArc />
                    <GaugeValueArc />
                    <GaugePointer />
                </GaugeContainer>



            </Tooltip>
            <Typography variant="body2" sx={{ mt: -2, fontWeight: 'bold', fontSize: "1rem" }}>
                {percentile}%
            </Typography>
        </Box>
    );
}