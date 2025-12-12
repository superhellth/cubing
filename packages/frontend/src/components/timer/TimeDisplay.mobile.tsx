import { type Solve } from '@cubing/shared';
import { CardContent } from '@mui/material';
import Box from '@mui/system/Box';
import { memo, useMemo } from "react";
import SolvesTable from './SolvesTable';
import { FadeContent, PanelPaper, SidebarCard } from './TimeDisplay.styles';

interface Stats {
    [key: string]: number | null;
}

const TimeDisplayMobile = memo(({ solves, openSolveDetailsScreen, isCollapsed }: {
    solves: Solve[],
    openSolveDetailsScreen: Function,
    isCollapsed: boolean,
    onSolveTableVisibilityChange: Function
}) => {

    const bestStats: any = useMemo(() => {
        const stats: Stats = { duration: null, avg5: null, avg12: null, avg100: null, avg1000: null };
        if (!solves.length) return stats;

        const updateBest = (key: keyof Stats, val: number | undefined | null) => {
            if (typeof val === 'number' && val > 0 && (stats[key] === null || val < stats[key])) {
                stats[key] = val;
            }
        };

        for (const s of solves) {
            updateBest('duration', s.duration);
            updateBest('avg5', s.avg5);
            updateBest('avg12', s.avg12);
            updateBest('avg100', s.avg100);
            updateBest('avg1000', s.avg1000);
        }
        return stats;
    }, [solves]);



    return (
        <Box sx={{ flex: 20, height: "100%" }}>
                <CardContent sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    // Less padding on mobile
                    padding: 1,
                    m: 0
                }}>

                    {/* History Table Panel */}
                    <PanelPaper elevation={0} sx={{ height: "100%", p: 0 }}>
                        <SolvesTable
                            solves={solves}
                            bestStats={bestStats}
                            openSolveDetailsScreen={openSolveDetailsScreen}
                        />
                    </PanelPaper>

                </CardContent>
        </Box>
    );
});

export default TimeDisplayMobile;