import { alpha, useTheme, type SxProps, type Theme } from "@mui/system";
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

    const limitPosition = scale(limit);

    if (limitPosition === undefined) {
        return <AnimatedLine {...other} />;
    }

    const clipIdleft = `${chartId}-${props.ownerState.id}-line-limit-${limit}-1`;
    const clipIdRight = `${chartId}-${props.ownerState.id}-line-limit-${limit}-2`;
    const chartRightEdge = left + width;
    const leftRectWidth = Math.max(0, Math.min(limitPosition, chartRightEdge) - left);
    const rightRectWidth = Math.max(0, chartRightEdge - Math.max(limitPosition, left));

    return (
        <React.Fragment>
            <clipPath id={clipIdleft}>
                <rect
                    x={left}
                    y={0}
                    width={leftRectWidth}
                    height={top + height + bottom}
                />
            </clipPath>
            <clipPath id={clipIdRight}>
                <rect
                    x={Math.max(left, limitPosition)}
                    y={0}
                    width={rightRectWidth}
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

export function ForecastArea({ limit, forecast }: { limit: number; forecast: { y0: number; y1: number }[]; }) {
    const theme = useTheme();
    const lineSeries = useLineSeries();
    const xAxis = useXAxis();
    const xScale = useXScale();
    const yScale = useYScale();

    if (!xAxis.data || !yScale || !xScale) return null;

    const xAxisData: number[] = xAxis.data.slice(limit);

    return (
        <React.Fragment>
            {lineSeries.map((series) => {
                const data = xAxisData.map((v, i) => {
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
                    .x((d: any) => xScale(d.x)!)
                    .y0((d: any) => yScale(d.y0)!)
                    .y1((d: any) => yScale(d.y1)!)(data)!;

                return <path key={`forecast-area-${series.id}`} d={path} fill={alpha(theme.palette.secondary.light, 0.1)} />;
            })}
        </React.Fragment>
    );
}

export function ShadedBackground({ limit }: { limit: number }) {
    const { top, bottom, height, left, width } = useDrawingArea();
    const scale = useXScale();
    const theme = useTheme();

    const limitPosition = scale(limit) ?? 0;
    const chartRight = left + width;
    const startX = Math.max(left, limitPosition);
    const rectWidth = Math.max(0, chartRight - startX);

    if (rectWidth <= 0) return null;

    return (
        <rect
            x={limitPosition}
            y={0}
            width={rectWidth}
            height={top + height + bottom}
            fill={theme.palette.secondary.light}
            opacity={0.4}
        />
    );
}