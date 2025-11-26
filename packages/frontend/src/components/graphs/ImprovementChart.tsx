import type { ISolve } from "@cubing/shared";
import { ChartContainer, ChartsGrid, ChartsTooltip, ChartsXAxis, ChartsYAxis, LinePlot, ScatterPlot } from "@mui/x-charts";
import { memo, useMemo } from "react";
import { LinkPoints } from "./LinkPoints";
import { CustomAnimatedLine, ShadedBackground } from "./PredictionArea";

const ImprovementChart = memo(({ solves, pbProgression }: any) => {
    if (!solves || solves.length < 1) return;
    const forecastData = [
        { y0: 20000, y1: 30000 },
        { y0: 20000, y1: 30000 },
        { y0: 20000, y1: 30000 },
        { y0: 20000, y1: 30000 },
        { y0: 20000, y1: 30000 },
        { y0: 20000, y1: 30000 },
        { y0: 20000, y1: 30000 },
        { y0: 20000, y1: 30000 },
        { y0: 20000, y1: 30000 },
        { y0: 20000, y1: 30000 },
        { y0: 20000, y1: 30000 },
        { y0: 20000, y1: 30000 }
    ];
    const lastSolve = solves[0];

    const { extendedSolves, limitIndex } = useMemo(() => {
        if (!solves || solves.length === 0) return { extendedSolves: [], limitIndex: 0, limitValue: 0 };
        const lastSolve = solves[0];
        console.log(lastSolve)
        const lastID = lastSolve.id;

        const futureSolves = forecastData.map((_, i) => ({
            id: lastID + (10 * i) + 1,
            avg12: 25000,
            avg100: 25000
        }));
        console.log(solves.length)
        console.log([...futureSolves.reverse(), ...solves])

        return {
            extendedSolves: [...futureSolves, ...solves],
            limitIndex: lastID
        };
    }, [solves, forecastData]);


    const pbs: any = useMemo(() => {
        return pbProgression.map((solve: ISolve) => {
            return { x: solve.id, y: solve.duration }
        });
    }, [solves]);

    return (
        <ChartContainer
            dataset={extendedSolves}
            series={[
                {
                    type: "line",
                    dataKey: "avg12",
                    label: "Average of 12"
                },
                // {
                //     type: "line",
                //     dataKey: "avg100",
                //     label: "Average of 100"
                // },
                // {
                //     type: "scatter",
                //     id: "pb-scatter",
                //     data: pbs,
                // }
            ]}
            sx={{ '& .line-after path': { strokeDasharray: '10 5' } }}
            xAxis={[{ scaleType: 'linear', dataKey: "id" }]}
        >
            {/* <ScatterPlot /> */}
            {/* <LinkPoints seriesId="pb-scatter" /> */}
            <ChartsGrid horizontal />

            <ShadedBackground limit={limitIndex} />
            <LinePlot
                slots={{ line: CustomAnimatedLine }}
                slotProps={{ line: { limit: 0 } as any }}
            />
            {/* <ForecastArea limit={limitIndex} forecast={[{ y0: lastSolve.avg12, y1: lastSolve.avg12 }, ...forecastData]} /> */}

            {/* <ChartsTooltip trigger="axis" /> */}
            <ChartsXAxis />
            <ChartsYAxis />

        </ChartContainer>
    );
});

export default ImprovementChart;