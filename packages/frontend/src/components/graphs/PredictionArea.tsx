import { useTheme, type SxProps, type Theme } from "@mui/system";
import type { AnimatedLineProps } from "@mui/x-charts";
import { AnimatedLine, useChartId, useDrawingArea, useLineSeries, useXAxis, useXScale, useYScale } from "@mui/x-charts";
import * as d3Shape from 'd3-shape';
import React from "react";

interface CustomAnimatedLineProps extends AnimatedLineProps {
    limit?: number;
    sxBefore?: SxProps<Theme>;
    sxAfter?: SxProps<Theme>;
}

export function CustomAnimatedLine(props: CustomAnimatedLineProps) {
    const { limit, sxBefore, sxAfter, ...other } = props;
    const { top, bottom, height, left, width } = useDrawingArea();
    const scale = useXScale();
    const chartId = useChartId();

    if (limit === undefined) {
        return <AnimatedLine {...other} />;
    }

    const limitPosition = scale(limit); // Convert value to x coordinate.

    if (limitPosition === undefined) {
        return <AnimatedLine {...other} />;
    }

    const clipIdleft = `${chartId}-${props.ownerState.id}-line-limit-${limit}-1`;
    const clipIdRight = `${chartId}-${props.ownerState.id}-line-limit-${limit}-2`;
    return (
        <React.Fragment>
            {/* Clip to show the line before the limit */}
            <clipPath id={clipIdleft}>
                <rect
                    x={left}
                    y={0}
                    width={limitPosition - left}
                    height={top + height + bottom}
                />
            </clipPath>
            {/* Clip to show the line after the limit */}
            <clipPath id={clipIdRight}>
                <rect
                    x={limitPosition}
                    y={0}
                    width={left + width - limitPosition}
                    height={top + height + bottom}
                />
            </clipPath>
            <g clipPath={`url(#${clipIdleft})`} className="line-before">
                <AnimatedLine {...other} />
            </g>
            <g clipPath={`url(#${clipIdRight})`} className="line-after">
                <AnimatedLine {...other} />
            </g>
        </React.Fragment>
    );
}

export function ForecastArea({
    limit,
    forecast,
}: {
    limit: number;
    forecast: { y0: number; y1: number }[];
}) {
    const lineSeries = useLineSeries();
    const xAxis = useXAxis();
    const xScale = useXScale();
    const yScale = useYScale();

    // Safety check
    if (!xAxis.data || !yScale || !xScale) return null;

    // Get the X-axis points starting from the limit
    const xAxisData: number[] = xAxis.data.slice(limit);

    return (
        <React.Fragment>
            {lineSeries.map((series) => {
                // 👇 UPDATED MAPPING LOGIC
                const data = xAxisData.map((v, i) => {
                    // We try to grab the forecast point.
                    // If the slice included an extra "connecting point" at the start,
                    // we might need to shift the index or clamp it.
                    // For now, let's just use the current index `i`.
                    const point = forecast[i]; 
                    
                    // If we run out of forecast data, return null to skip
                    if (!point) return null;

                    return {
                        x: v,
                        y0: point.y0,
                        y1: point.y1,
                    };
                }).filter((d): d is { x: number; y0: number; y1: number } => d !== null); // Remove nulls

                if (data.length === 0) return null;

                const path = d3Shape
                    .area<(typeof data)[number]>()
                    .x((d) => xScale(d.x)!)
                    .y0((d) => yScale(d.y0)!)
                    .y1((d) => yScale(d.y1)!)(data)!;

                return <path key={`forecast-area-${series.id}`} d={path} fill="#0000ff44" />;
            })}
        </React.Fragment>
    );
}

export function ShadedBackground({ limit }: { limit: number }) {
    const { top, bottom, height, left, width } = useDrawingArea();
    const scale = useXScale();
    const limitPosition = scale(limit)!;
    const theme = useTheme();
    const fill =
        theme.palette.mode === 'dark'
            ? theme.palette.grey[900]
            : theme.palette.grey[400];

    return (
        <rect
            x={limitPosition}
            y={0}
            width={left + width - limitPosition}
            height={top + height + bottom}
            fill={fill}
            opacity={0.4}
        />
    );
}