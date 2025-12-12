import { Discipline } from '@cubing/shared';
import AlarmFilledIcon from '@mui/icons-material/Alarm';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStats';
import { Box, Fade } from '@mui/material';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EVENT_AND_DISCIPLINES_MAP } from '../../utils/constants';
import HCButton from '../HCButton';
import DisciplineButton from './DisciplineButton';
import { DrawerContainer, GradientOverlay, NavContainer, PrivacyButton, ScrollArea, SidebarContainer, ToggleButton } from './Sidebar.styles';

interface SidebarProps {
    selectedDiscipline: Discipline;
    onDisciplineChange: (d: Discipline) => void;
    isVisible: boolean;
}

export default function SidebarDesktop({ selectedDiscipline, onDisciplineChange, isVisible }: SidebarProps) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeout: any = useRef(null);

    const handleScroll = () => {
        if (!isScrolling) setIsScrolling(true);

        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
        }, 150);
    };
    const handleDisciplineClick = (disc: Discipline) => {
        setOpenDrawer(false);
        onDisciplineChange(disc);
    };


    return (
        <NavContainer component="nav" isVisible={isVisible}>
            {/* Main Vertical Bar */}
            <SidebarContainer>
                <Box>
                    <HCButton isSelected={location.pathname === "/"} onClick={() => navigate("/")}>
                        <AlarmFilledIcon sx={{ fontSize: 30 }} />
                    </HCButton>

                    <ToggleButton
                        disabled={location.pathname !== "/"}
                        onClick={() => {
                            if (location.pathname !== "/") {
                                navigate("/");
                            } else {
                                setOpenDrawer(!openDrawer);
                            }
                        }}
                    >
                        <KeyboardArrowRightIcon
                            sx={{
                                fontSize: 20,
                                transform: openDrawer ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        />
                    </ToggleButton>
                </Box>

                <HCButton onClick={() => { setOpenDrawer(false); navigate("/stats") }} isSelected={location.pathname === "/stats"}>
                    <QueryStatsOutlinedIcon sx={{ fontSize: 30 }} />
                </HCButton>

                <PrivacyButton onClick={() => window.open('/privacy-policy', '_blank')}>
                    <PrivacyTipIcon sx={{ fontSize: '16px !important' }} />
                </PrivacyButton>
            </SidebarContainer>

            {/* Slide-out Drawer */}
            <Fade in={openDrawer}>
                <DrawerContainer>
                    <ScrollArea onScroll={handleScroll}>
                        {[...EVENT_AND_DISCIPLINES_MAP].map(([disc, event]) => (
                            <DisciplineButton
                                key={event}
                                name={event}
                                size={40}
                                disc={disc as Discipline}
                                isSelected={selectedDiscipline === disc}
                                onClick={handleDisciplineClick}
                            />
                        ))}
                        <GradientOverlay />
                    </ScrollArea>
                </DrawerContainer>
            </Fade>
        </NavContainer>
    );
}