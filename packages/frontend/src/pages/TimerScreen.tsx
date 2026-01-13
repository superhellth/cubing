import { useMediaQuery, useTheme } from "@mui/system";
import TimerScreenDesktop from "./TimerScreen.desktop";
import type { Discipline } from "@cubing/shared";
import TimerScreenMobile from "./TimerScreen.mobile";

function TimerScreen({ selectedDiscipline, updateSidebarVisibility, setSidebarIsCollapsed }:
    { selectedDiscipline: Discipline, updateSidebarVisibility: Function, setSidebarIsCollapsed: Function }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            {isMobile ? (
                <TimerScreenMobile selectedDiscipline={selectedDiscipline} updateSidebarVisibility={updateSidebarVisibility} />
            ) : (
                <TimerScreenDesktop selectedDiscipline={selectedDiscipline} updateSidebarVisibility={updateSidebarVisibility} setSidebarIsCollapsed={setSidebarIsCollapsed} />
            )}
        </>
    );
}

export default TimerScreen;