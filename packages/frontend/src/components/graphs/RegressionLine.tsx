import { useTheme } from "@mui/system";
import { ChartsClipPath, rainbowSurgePalette, useSeries, useXScale, useYScale } from "@mui/x-charts";
import React, { useId } from "react";

function RegressionLine({ seriesId }: { seriesId: string }) {
    const theme = useTheme();
    const palette = rainbowSurgePalette(theme.palette.mode);
    const stroke = palette[2];
    const allSeries = useSeries();
    const series = allSeries.scatter!.series[seriesId]!;
    const xScale = useXScale(series.xAxisId!);
    const yScale = useYScale(series.yAxisId!);
    const clipPathId = `linear-regression-clip-${useId()}`;

    const { m, b } = linearRegression(series.data ?? []);

    const xDomain = xScale.domain() as [number, number];
    const x1 = xScale(xDomain[0]);
    const x2 = xScale(xDomain[1]);
    const y1 = yScale(m * xDomain[0] + b);
    const y2 = yScale(m * xDomain[1] + b);

    return (
        <React.Fragment>
            <ChartsClipPath id={clipPathId} />
            <g clipPath={`url(#${clipPathId})`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={2} style={{color: "red"}} />
            </g>
        </React.Fragment>
    );
}

function linearRegression(points: ReadonlyArray<{ x: number; y: number }>) {
    const n = points.length;

    // Calculate sums
    let sumX = 0,
        sumY = 0,
        sumXY = 0,
        sumX2 = 0;

    for (let i = 0; i < n; i += 1) {
        const rawX: any = points[i].x;
        const x = rawX instanceof Date ? rawX.getTime() : rawX;
        const y = points[i].y;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    }

    // Calculate slope (m) and intercept (b)
    const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    return { m, b };
}

export default RegressionLine;