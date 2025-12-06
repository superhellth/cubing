import { Discipline } from '@cubing/shared';
import AlarmFilledIcon from '@mui/icons-material/Alarm';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStats';
import { Box, Divider, Fade, IconButton, Paper, useTheme } from '@mui/material';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EVENT_AND_DISCIPLINES_MAP } from '../../utils/constants';
import HCButton from '../HCButton';
import DisciplineButton from './DisciplineButton';

interface SidebarProps {
    selectedDiscipline: Discipline;
    onDisciplineChange: (d: Discipline) => void;
    isVisible: boolean;
}

export default function Sidebar({ selectedDiscipline, onDisciplineChange, isVisible }: SidebarProps) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
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
        <Box component="nav" sx={{ display: "flex", visibility: isVisible ? "visible" : "hidden", position: "relative", padding: "16px" }}>
            {/* Main Vertical Bar */}
            <Paper sx={{
                width: "75px",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                bgcolor: theme.palette.secondary.main,
                zIndex: 20,
            }}>
                <Box>
                    <HCButton isSelected={location.pathname === "/"} onClick={() => navigate("/")}>
                        <AlarmFilledIcon sx={{ fontSize: 30 }} />
                    </HCButton>
                    <IconButton sx={{ borderRadius: 0, height: 20, color: theme.palette.info.dark }} disabled={location.pathname !== "/"}
                        onClick={() => { if (location.pathname !== "/") { navigate("/") } else { setOpenDrawer(!openDrawer) } }}>
                        <KeyboardArrowRightIcon sx={{
                            fontSize: 20,
                            transform: openDrawer ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                    </IconButton>
                </Box>
                <HCButton onClick={() => { setOpenDrawer(false); navigate("/stats") }} isSelected={location.pathname === "/stats"}>
                    <QueryStatsOutlinedIcon sx={{ fontSize: 30 }} />
                </HCButton>
            </Paper>

            <Fade in={openDrawer} >
                <Box sx={{
                    position: "absolute",
                    zIndex: 10,
                    left: "103px",
                    top: "16px",
                    bottom: "16px",
                    width: "65px",
                    bgcolor: theme.palette.secondary.main,
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    overflow: "hidden"
                }}>
                    <Box onScroll={handleScroll} sx={{
                        height: "100%",
                        overflowY: "auto",
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },

                    }}>

                        {[...EVENT_AND_DISCIPLINES_MAP].map(([disc, event]) => (
                            <DisciplineButton
                                key={event}
                                name={event}
                                size={40}
                                disc={disc as Discipline}
                                isSelected={selectedDiscipline === disc}
                                tooltipDisabled={isScrolling}
                                onClick={handleDisciplineClick}
                            />
                        ))}
                        {/* </Box> */}
                        <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '50px',
                            borderRadius: "24px",
                            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))',
                            pointerEvents: 'none'
                        }} />
                    </Box>
                    <Divider orientation="vertical" sx={{ bgcolor: theme.palette.secondary.main }} flexItem component="div" />
                </Box>
            </Fade>
        </Box>
    );
}