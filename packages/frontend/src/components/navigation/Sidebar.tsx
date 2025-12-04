import { Discipline } from '@cubing/shared';
import AlarmFilledIcon from '@mui/icons-material/Alarm';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStats';
import { Box, Divider, Paper, Slide, useTheme } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HCButton from '../HCButton';
import { EVENTS_AND_DISCIPLINES } from '../../utils/constants';
import DisciplineButton from './DisciplineButton';

interface SidebarProps {
    selectedDiscipline: Discipline;
    onDisciplineChange: (d: Discipline) => void;
}

export default function Sidebar({ selectedDiscipline, onDisciplineChange }: SidebarProps) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const handleDisciplineClick = (disc: Discipline) => {
        if (!openDrawer) {
            navigate("/");
        }
        setOpenDrawer(false);
        onDisciplineChange(disc);
    };

    return (
        <Box component="nav" sx={{ display: 'flex' }}>
            {/* Main Vertical Bar */}
            <Paper sx={{
                width: "75px",
                marginLeft: "16px",
                marginTop: "16px",
                marginBottom: "16px",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                zIndex: 5,
                bgcolor: theme.palette.secondary.main
            }}>
                <Box>
                    <HCButton onClick={() => { if(location.pathname !== "/") navigate("/"); setOpenDrawer(!openDrawer) }} isSelected={location.pathname === "/"}>
                        <AlarmFilledIcon sx={{ fontSize: 30 }} />
                    </HCButton>
                </Box>
                <HCButton onClick={() => {setOpenDrawer(false); navigate("/stats")}} isSelected={location.pathname === "/stats"}>
                    <QueryStatsOutlinedIcon sx={{ fontSize: 30 }} />
                </HCButton>
                {/* <HCButton onClick={() => navigate("/licenses")} isSelected={location.pathname === "/licenses"}>
                    <InfoOutlinedIcon sx={{ fontSize: 30 }} />
                </HCButton> */}
            </Paper>

            {/* Slide out Drawer */}
            {openDrawer &&
                <Box sx={{
                    position: "relative",
                    // left: "100px",
                    borderRadius: "24px",
                    marginTop: "16px",
                    marginBottom: "16px",
                    marginLeft: "12px",
                    maxHeight: "100%",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    bgcolor: theme.palette.secondary.main,
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <Box sx={{
                        overflowY: "auto", width: "65px", display: "flex", flexDirection: "column",
                        scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none', }
                    }}>
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
                        borderRadius: "24px",
                        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))',
                        pointerEvents: 'none'
                    }} />
                    <Divider orientation="vertical" sx={{ bgcolor: theme.palette.secondary.main }} flexItem component="div" />
                </Box>
            }
        </Box>
    );
}