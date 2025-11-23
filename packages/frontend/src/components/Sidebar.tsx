import { Discipline } from '@cubing/shared';
import AlarmFilledIcon from '@mui/icons-material/Alarm';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStats';
import { Box, Divider, Slide } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HCButton from './HCButton';
import { EVENTS_AND_DISCIPLINES } from './timer/constants';
import DisciplineButton from './DisciplineButton';

interface SidebarProps {
    selectedDiscipline: Discipline;
    onDisciplineChange: (d: Discipline) => void;
}

export default function Sidebar({ selectedDiscipline, onDisciplineChange }: SidebarProps) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [mouseInArea, setMouseInArea] = useState(false);
    const ignoreMouseRef = useRef(false);
    const navigate = useNavigate();
    const location = useLocation();

    const onMouseLeave = () => {
        ignoreMouseRef.current = false;
        setMouseInArea(false);
    }

    const onMouseEnter = () => {
        if (ignoreMouseRef.current) return;
        setMouseInArea(true);
        setOpenDrawer(true);
    }

    useEffect(() => {
        if (mouseInArea) return;

        const timer = setTimeout(() => {
            setOpenDrawer(false);
        }, 200);

        return () => clearTimeout(timer);
    }, [mouseInArea]);

    const handleDisciplineClick = (disc: Discipline) => {
        ignoreMouseRef.current = true;
        navigate("/");
        setOpenDrawer(false);
        setMouseInArea(false);
        onDisciplineChange(disc);
    };

    return (
        <Box component="nav" sx={{ display: 'flex' }}> {/* Semantic Tag */}
            {/* Main Vertical Bar */}
            <Box sx={{ width: "100px", display: "flex", flexDirection: "column", justifyContent: "space-around", zIndex: 5, bgcolor: "secondary.main" }}>
                <Box onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                    <HCButton onClick={() => navigate("/")} isSelected={location.pathname === "/"}>
                        <AlarmFilledIcon sx={{ fontSize: 30 }} />
                    </HCButton>
                </Box>
                <HCButton onClick={() => navigate("/stats")} isSelected={location.pathname === "/stats"}>
                    <QueryStatsOutlinedIcon sx={{ fontSize: 30 }} />
                </HCButton>
                <HCButton onClick={() => navigate("/licenses")} isSelected={location.pathname === "/licenses"}>
                    <InfoOutlinedIcon sx={{ fontSize: 30 }} />
                </HCButton>
            </Box>

            {/* Slide out Drawer */}
            <Divider orientation="vertical" sx={{ bgcolor: "info.main" }} flexItem component="div" />
            <Slide in={openDrawer} direction='right'>
                <Box sx={{ position: "absolute", left: "100px", height: "100%", bgcolor: "primary.main", zIndex: 1, display: "flex", flexDirection: "row" }}>
                    <Box sx={{
                        overflowY: "auto", height: "100vh", width: "100px", display: "flex", flexDirection: "column",
                        scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none', }
                    }}
                        onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                        {EVENTS_AND_DISCIPLINES.map(([event, disc]) => (
                            <DisciplineButton
                                key={event}
                                name={event}
                                size={40}
                                disc={disc as Discipline}
                                isSelected={selectedDiscipline === disc}
                                onClick={handleDisciplineClick}
                            />
                        ))}
                    </Box>
                    <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '50px',
                        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))',
                        pointerEvents: 'none'
                    }} />
                    <Divider orientation="vertical" sx={{ bgcolor: "info.main" }} flexItem component="div" />
                </Box>
            </Slide>
        </Box>
    );
}