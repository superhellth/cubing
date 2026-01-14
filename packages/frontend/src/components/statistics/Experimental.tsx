import { Discipline } from "@cubing/shared";
import { LineChart } from "@mui/x-charts";
import { memo, useMemo } from "react";
import useDownsampling from "../../hooks/solves/useDownsampling";
import { useSolveManager } from "../../hooks/solves/useSolveManager";

const Experimental = memo(() => {
    const { solvesChrono } = useSolveManager(Discipline.OneHanded, "default");
    const sampledSolves = useDownsampling(solvesChrono, 500, false);
    const avgs: (number | null | undefined)[] = sampledSolves.map(s => s.avg100);
    const detrendedTimes: (number | null)[] = useMemo(() => {
        const detrended: (number | null)[] = [];
        for (let i = 0; i < sampledSolves.length; i++) {
            if (sampledSolves[i] && sampledSolves[i].avg5 && sampledSolves[i].avg100) {
                detrended.push(sampledSolves[i].avg5 - sampledSolves[i].avg100);
            } else {
                detrended.push(null);
            }
        }
        return detrended;
    }, [sampledSolves, avgs])
    const durations: (number | null)[] = sampledSolves.map(s => s.avg5);

    return (
        <LineChart series={[
            {
                data: durations,
                showMark: false,
                label: 'Solve Time',
            },
            {
                data: detrendedTimes,
                showMark: false,
                label: 'Detrended',
            },
        ]}
            width={1000}
            height={500}
        />
    );
});

export default Experimental;