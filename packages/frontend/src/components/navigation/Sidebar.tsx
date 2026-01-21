import SidebarDesktop from "./Sidebar.desktop";
import SidebarMobile from "./Sidebar.mobile";

export default function Sidebar({ selectedDiscipline, onDisciplineChange, isMobile, isCollapsed, setIsCollapsed, isVisible, toggleResize }: any) {

    return (
        <>
            {isMobile ? (
                <SidebarMobile selectedDiscipline={selectedDiscipline} onDisciplineChange={onDisciplineChange} isVisible={isVisible} />
            ) : (
                <SidebarDesktop selectedDiscipline={selectedDiscipline} onDisciplineChange={onDisciplineChange} isVisible={isVisible}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    toggleResize={toggleResize} />
            )
            }
        </>
    );
}