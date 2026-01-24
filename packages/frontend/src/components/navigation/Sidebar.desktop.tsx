import { Discipline } from '@cubing/shared';
import AlarmFilledIcon from '@mui/icons-material/Alarm';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStats';
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Divider, Menu, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { EVENT_AND_DISCIPLINES_MAP } from '../../utils/constants';
import HCButton from '../HCButton';
import ImportDialog from '../dialogs/ImportDialog';
import TimerSettings from '../dialogs/TimerSettings';
import WelcomeSnackbar from '../snackbars/WelcomeSnackbar';
import NavigationButton from './NavButton';
import { NavContainer, PrivacyButton, SidebarContainer } from './Sidebar.styles';

interface SidebarProps {
    selectedDiscipline: Discipline;
    onDisciplineChange: (d: Discipline) => void;
    toggleResize: (b: boolean) => void;
    isCollapsed: boolean;
    isVisible: boolean;
    setIsCollapsed: (b: boolean) => void;
}

export default function SidebarDesktop({ selectedDiscipline, onDisciplineChange, isCollapsed, setIsCollapsed,
    isVisible, toggleResize: setIsResizing }: SidebarProps) {
    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
    const [hasClosedSnackbar, setHasClosedSnackbar] = useLocalStorage("hasClosedSnackbar", false);
    const [snackbarIsOpen, setSnackbarIsOpen] = useState<boolean>(!hasClosedSnackbar);
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const anchorRef = useRef(null);
    const resizeRef = useRef<any>(null);
    const open = Boolean(anchorEl);

    const onMouseEvent = (isEntering: boolean) => {
        if (resizeRef.current) {
            clearTimeout(resizeRef.current);
        }
        setIsCollapsed(!isEntering);
        setIsResizing(true);
        resizeRef.current = setTimeout(() => {
            setIsResizing(false);
        }, theme.transitions.duration.standard);
    }

    const handleSnackbarClose = (userClose: boolean) => {
        if (userClose) {
            setHasClosedSnackbar(true);
        }
        setSnackbarIsOpen(false);
    };

    return (
        <NavContainer component="nav" isVisible={isVisible}>
            {/* Main Vertical Bar */}
            <SidebarContainer collapsed={isCollapsed} spacing={2} onMouseEnter={() => onMouseEvent(true)} onMouseLeave={() => { if (!isCollapsed) onMouseEvent(false) }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    ref={anchorRef}
                    sx={{ width: "100%", borderRadius: "10px" }}
                >

                    <i
                        onMouseEnter={() => onMouseEvent(true)}
                        className={`cubing-icon event-${EVENT_AND_DISCIPLINES_MAP.get(selectedDiscipline)}`}
                        style={{
                            color: theme.palette.info.main,
                            padding: 0,
                            borderRadius: "10px",
                            fontSize: "40px", transition: "transform 0.3s ease-in-out",
                            transform: isCollapsed ? "rotate(0deg)" : "rotate(45deg)"
                        }}
                    />

                    {/* 2. The Dropdown (Only renders when expanded) */}
                    {!isCollapsed && (
                        <>

                            <HCButton onClick={() => setAnchorEl(anchorRef.current)}
                                sx={{
                                    flex: 1, backgroundColor: theme.palette.primary.main, height: "100%", '&:hover': {
                                        backgroundColor: theme.palette.primary.main
                                    },
                                }}>
                                <Typography noWrap sx={{ flex: 1, }}>{selectedDiscipline}</Typography>
                                <ExpandMoreIcon sx={{
                                    fontSize: "40px", transition: "transform 0.3s ease-in-out",
                                    transform: open ? "rotate(180deg)" : "rotate(0deg)", zIndex: 10
                                }} />
                            </HCButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={() => setAnchorEl(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                slotProps={{
                                    paper: {
                                        sx: {
                                            bgcolor: theme.palette.primary.main,
                                            border: "1px solid rgba(255, 255, 255, 0.1)",
                                            borderRadius: "10px",
                                            marginTop: 1,
                                            width: "236px",
                                        }
                                    }
                                }}
                            >
                                <MenuItem
                                    disableRipple
                                    sx={{
                                        cursor: "default",
                                        padding: 0
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(3, 1fr)", // Force 3 columns
                                            padding: 0,
                                            width: "100%"
                                        }}
                                    >
                                        {[...EVENT_AND_DISCIPLINES_MAP.keys()].map((discipline) => (
                                            <Box
                                                key={discipline}
                                                onClick={() => {
                                                    onDisciplineChange(discipline);
                                                    setAnchorEl(null);
                                                    onMouseEvent(false);
                                                }}
                                                sx={{
                                                    backgroundColor: discipline === selectedDiscipline ? theme.palette.primary.main : theme.palette.secondary.main,
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    display: "flex",
                                                    width: "100%",
                                                    aspectRatio: "1 / 1",
                                                    border: "1px solid",
                                                    "&:hover": {
                                                        backgroundColor: discipline === selectedDiscipline ? "rgba(255, 255, 255, 0.01)" : "rgba(255, 255, 255, 0.1)",
                                                        cursor: "pointer"
                                                    },
                                                    borderColor: "rgba(255, 255, 255, 0.1)"
                                                    // borderRadius: "10px"
                                                }}>
                                                <i

                                                    className={`cubing-icon event-${EVENT_AND_DISCIPLINES_MAP.get(discipline)}`}
                                                    style={{ fontSize: "40px", color: theme.palette.info.main }} // Slightly smaller icon for grid
                                                />
                                                {/* <Typography>{discipline}</Typography> */}
                                            </Box>
                                        ))}
                                    </Box>
                                </MenuItem>
                            </Menu>
                        </>
                    )}
                </Stack>
                <Divider sx={{ width: "100%" }} />

                <NavigationButton isSelected={location.pathname === "/"} onClick={() => navigate("/")} icon={<AlarmFilledIcon />}
                    label="Timer"
                    isCollapsed={isCollapsed}
                    isVisible={isVisible}>
                </NavigationButton>
                <NavigationButton isSelected={location.pathname === "/stats"} onClick={() => navigate("/stats")} icon={<QueryStatsOutlinedIcon />}
                    label="Statistics" isCollapsed={isCollapsed}>
                </NavigationButton>

                <Box sx={{ height: "100%" }}>

                </Box>

                <NavigationButton isSelected={false} onClick={() => { setImportDialogOpen(true); onMouseEvent(false) }} icon={<FileUploadIcon />}
                    label="Import Solves" isCollapsed={isCollapsed}>
                </NavigationButton>

                <NavigationButton isSelected={false} onClick={() => { setSettingsOpen(true); onMouseEvent(false) }} icon={<SettingsIcon />}
                    label="Settings" isCollapsed={isCollapsed}>
                </NavigationButton>

                <Box
                    // Keep the key if you want to force a re-render on visibility change, 
                    // effectively double-ensuring the "instant" effect.
                    key={isVisible ? "shown" : "hidden"}
                    sx={{
                        width: "100%",
                        opacity: isCollapsed ? 0 : 1,
                        // transition: isVisible ? "all 0.1s ease-in-out 0.11s" : "none",
                        transition: isCollapsed
                            ? "opacity 0.1s ease-out, maxWidth 0.1s ease-out"   // COLLAPSING (Fast)
                            : "opacity 0.3s ease-in 0s, maxWidth 0.3s ease-in",
                        // overflow: "hidden",
                        whiteSpace: "nowrap",
                        pointerEvents: isCollapsed ? 'none' : 'auto',
                    }}
                >
                    <Divider sx={{ width: "100%", marginTop: 2, marginBottom: 2 }} />
                    <PrivacyButton onClick={() => window.open('/privacy-policy', '_blank')}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <PrivacyTipIcon sx={{ fontSize: '16px !important' }} />
                            <span style={{ textWrap: "nowrap" }}>Privacy Policy</span>
                        </Stack>
                    </PrivacyButton>
                </Box>
            </SidebarContainer>

            <WelcomeSnackbar isOpen={snackbarIsOpen} onClose={(userClose: boolean) => { handleSnackbarClose(userClose) }} onImport={() => setImportDialogOpen(true)} />
            <TimerSettings isOpen={settingsOpen} onClose={() => { setSettingsOpen(false) }} />
            <ImportDialog isOpen={importDialogOpen} onClose={() => setImportDialogOpen(false)} selectedDiscipline={selectedDiscipline} />
        </NavContainer >
    );
}