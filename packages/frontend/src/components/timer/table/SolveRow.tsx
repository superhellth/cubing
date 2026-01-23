import { Status } from "@cubing/shared";
import { Checkbox } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { memo } from "react";
import { getDisplayableTime } from "../../../utils/solveUtils";

export const SolveRow = memo(({ solve, bestStats, isSelected, updateSelectStatus }: any) => {

    const isBestSingle = bestStats.duration !== null && solve.duration === bestStats.duration;
    const isBestAvg5 = bestStats.avg5 !== null && solve.avg5 === bestStats.avg5;
    const isBestAvg12 = bestStats.avg12 !== null && solve.avg12 === bestStats.avg12;

    return (
        <>
            <TableCell className="select-checkbox" padding="none">
                {/* <Tooltip title="Hold shift to..."> */}
                    <Checkbox
                        size="small"
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                            e.stopPropagation();
                            updateSelectStatus();
                        }}
                    />
                {/* </Tooltip> */}
            </TableCell>

            <TableCell className="data-cell" size="small">{solve.id}</TableCell>

            {/* Single */}
            <TableCell className="data-cell" size="small" sx={{
                color: solve.status === Status.DNF ? "error.main" : solve.status === Status.PlusTwo ? "warning.main" : "text.primary",
                fontWeight: isBestSingle ? "bold" : "normal",
            }}>
                {getDisplayableTime(solve, "duration")}
            </TableCell>

            {/* Avg 5 */}
            <TableCell className="data-cell" size="small" sx={{
                color: solve.avg5 === -1 ? "error.main" : "text.primary",
                fontWeight: isBestAvg5 ? "bold" : "normal",
            }}>
                {getDisplayableTime(solve, 'avg5')}
            </TableCell>

            {/* Avg 12 */}
            <TableCell className="data-cell" size="small" sx={{
                color: solve.avg12 === -1 ? "error.main" : "text.primary",
                fontWeight: isBestAvg12 ? "bold" : "normal",
            }}>
                {getDisplayableTime(solve, 'avg12')}
            </TableCell>
        </>
    );
});