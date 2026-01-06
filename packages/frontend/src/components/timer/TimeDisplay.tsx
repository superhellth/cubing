import type { Solve } from "@cubing/shared";
import { useMediaQuery, useTheme } from "@mui/system";
import { memo } from "react";
import TimeDisplayMobile from "./TimeDisplay.mobile";
import TimeDisplayDesktop from "./TimeDisplay.desktop";

export const HEAD_CELLS = [
    { id: 'id', label: '#', color: "text.primary", minSolves: 0 },
    { id: 'duration', label: 'Single', color: "text.primary", minSolves: 0 },
    { id: 'avg5', label: 'Avg5', color: "info.light", minSolves: 0 },
    { id: 'avg12', label: 'Avg12', color: "info.dark", minSolves: 0 },
    { id: 'avg100', label: 'Avg100', color: "info.light", minSolves: 100 },
    { id: 'avg1000', label: 'Avg1000', color: "info.dark", minSolves: 1000 }
];

const TimeDisplay = memo(({ solves, openSolveDetailsScreen, isCollapsed, onSolveTableVisibilityChange }: {
    solves: Solve[],
    openSolveDetailsScreen: Function,
    isCollapsed: boolean,
    onSolveTableVisibilityChange: Function
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <>
            {isMobile ? (
                <TimeDisplayMobile solves={solves} openSolveDetailsScreen={openSolveDetailsScreen}
                    onSolveTableVisibilityChange={onSolveTableVisibilityChange} />
            ) : (
                <TimeDisplayDesktop solves={solves} openSolveDetailsScreen={openSolveDetailsScreen} isCollapsed={isCollapsed}
                    onSolveTableVisibilityChange={onSolveTableVisibilityChange} />
            )}
        </>
    );
});

export default TimeDisplay;