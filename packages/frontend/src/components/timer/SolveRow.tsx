import { Status } from "@cubing/shared";
import TableCell from "@mui/material/TableCell";
import { memo } from "react";
import { getDisplayableTime, getDisplayTime } from "../../utils/solveUtils";

export const SolveRow = memo(({ solve, bestStats }: any) => {
    const isBestSingle = bestStats.single !== null && solve.duration === bestStats.single;
    const isBestAvg5 = bestStats.avg5 !== null && solve.avg5 === bestStats.avg5;
    const isBestAvg12 = bestStats.avg12 !== null && solve.avg12 === bestStats.avg12;

    return (
        <>
            <TableCell>{solve.id}</TableCell>

            {/* Single */}
            <TableCell sx={{
                color: solve.status === Status.DNF ? "error.main" : solve.status === Status.PlusTwo ? "warning.main" : "text.primary",
                fontWeight: isBestSingle ? "bold" : "normal"
            }}>
                {getDisplayTime(solve)}
            </TableCell>

            {/* Avg 5 */}
            <TableCell sx={{
                color: solve.avg5 === -1 ? "error.main" : "text.primary",
                fontWeight: isBestAvg5 ? "bold" : "normal"
            }}>
                {getDisplayableTime(solve, 'avg5')}
            </TableCell>

            {/* Avg 12 */}
            <TableCell sx={{
                color: solve.avg12 === -1 ? "error.main" : "text.primary",
                fontWeight: isBestAvg12 ? "bold" : "normal"
            }}>
                {getDisplayableTime(solve, 'avg12')}
            </TableCell>
        </>
    );
});