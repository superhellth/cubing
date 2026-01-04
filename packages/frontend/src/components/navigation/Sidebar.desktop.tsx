import { Discipline } from '@cubing/shared';
import AlarmFilledIcon from '@mui/icons-material/Alarm';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import MenuIcon from '@mui/icons-material/Menu';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStats';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Divider, Fade, FormControl, ListItemText, MenuItem, Select, Stack, Typography, useTheme } from '@mui/material';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTimerSettings } from '../../hooks/TimerSettingsContext';
import { EVENT_AND_DISCIPLINES_MAP } from '../../utils/constants';
import HCButton from '../HCButton';
import TimerSettings from '../timer/TimerSettings';
import DisciplineButton from './DisciplineButton';
import NavigationButton from './NavButton';
import { DrawerContainer, GradientOverlay, NavContainer, PrivacyButton, ScrollArea, SidebarContainer } from './Sidebar.styles';

interface SidebarProps {
    selectedDiscipline: Discipline;
    onDisciplineChange: (d: Discipline) => void;
    isVisible: boolean;
}

export default function SidebarDesktop({ selectedDiscipline, onDisciplineChange, isVisible }: SidebarProps) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const scrollTimeout: any = useRef(null);
    const theme = useTheme();
    const { updateSetting } = useTimerSettings();

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
            <SidebarContainer collapsed={isCollapsed} spacing={2}>
                {isCollapsed ? (
                    <HCButton isSelected={true} onClick={() => setIsCollapsed(!isCollapsed)}>
                        <MenuIcon />
                    </HCButton>
                ) : (
                    <Stack direction="row" alignItems="center" spacing={3}>
                        <HCButton isSelected={true} onClick={() => setIsCollapsed(!isCollapsed)}>
                            <MenuIcon />
                        </HCButton>
                        <Typography variant='h5' sx={{ fontWeight: "bold" }}>Cosmic</Typography>
                    </Stack>
                )}
                <Divider sx={{ width: "100%" }} />

                {isCollapsed ? (
                    <i className={`cubing-icon event-${EVENT_AND_DISCIPLINES_MAP.get(selectedDiscipline)}`} style={{ fontSize: "40px", color: theme.palette.info.dark }} />
                ) : (
                    <Stack direction="row" alignItems="center" spacing={2} sx={{display: "flex", flexDirection: "row", width: "100%"}}>
                        <i className={`cubing-icon event-${EVENT_AND_DISCIPLINES_MAP.get(selectedDiscipline)}`} style={{ fontSize: "40px", color: theme.palette.info.dark }} />
                        <FormControl sx={{ bgcolor: "#090909", border: "1px solid #333333", p: 1, borderRadius: 2, height: "48px", flex: 1 }}>
                            <Select
                                value={selectedDiscipline}
                                variant="standard"
                                onChange={(event: any) => { onDisciplineChange(event.target.value); updateSetting("lastStatDiscipline", event.target.value) }}
                                renderValue={(selected) => selected}
                                sx={{
                                    '.MuiSelect-icon': {
                                        color: 'white',
                                    },
                                }}
                            >
                                {[...EVENT_AND_DISCIPLINES_MAP.keys()].map((discipline) => (
                                    <MenuItem key={discipline} value={discipline} sx={{ bgcolor: "#090909" }}>
                                        <ListItemText primary={discipline} />
                                        {discipline === selectedDiscipline && (
                                            <CheckRoundedIcon
                                                sx={{
                                                    color: theme.palette.info.main,
                                                    fontSize: '1.2rem'
                                                }}
                                            />
                                        )}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                )}
                <NavigationButton isSelected={location.pathname === "/"} onClick={() => navigate("/")} icon={<AlarmFilledIcon />} label="Timer" isCollapsed={isCollapsed}>
                </NavigationButton>
                <NavigationButton isSelected={location.pathname === "/stats"} onClick={() => navigate("/stats")} icon={<QueryStatsOutlinedIcon />}
                    label="Statistics" isCollapsed={isCollapsed}>
                </NavigationButton>

                <Box sx={{ height: "100%" }}>

                </Box>
                {/* onClick={() => { setSettingsOpen(true); }} isSelected={true}> */}

                <NavigationButton isSelected={false} onClick={() => setSettingsOpen(true)} icon={<SettingsIcon />}
                    label="Settings" isCollapsed={isCollapsed}>
                </NavigationButton>

                <Box sx={{ visibility: isCollapsed ? "hidden" : "visible", width: "100%" }}>
                    <Divider sx={{ width: "100%", marginTop: 2, marginBottom: 2 }} />
                    <PrivacyButton onClick={() => window.open('/privacy-policy', '_blank')}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <PrivacyTipIcon sx={{ fontSize: '16px !important' }} />
                            <span style={{ textWrap: "nowrap" }}>Privacy Policy</span>
                        </Stack>
                    </PrivacyButton>
                </Box>
            </SidebarContainer>

            <TimerSettings isOpen={settingsOpen} onClose={() => { setSettingsOpen(false) }} />

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
        </NavContainer >
    );
}