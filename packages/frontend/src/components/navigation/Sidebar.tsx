import SidebarDesktop from "./Sidebar.desktop";
import SidebarMobile from "./Sidebar.mobile";

export default function Sidebar({ selectedDiscipline, onDisciplineChange, isMobile, isVisible, isResizing, toggleResize }: any) {

    return (
        <>
            {isMobile ? (
                <SidebarMobile selectedDiscipline={selectedDiscipline} onDisciplineChange={onDisciplineChange} isVisible={isVisible} />
            ) : (
                <SidebarDesktop selectedDiscipline={selectedDiscipline} onDisciplineChange={onDisciplineChange} isVisible={isVisible}
                isResizing={isResizing}
                toggleResize={toggleResize} />
            )
            }
        </>
    );
}