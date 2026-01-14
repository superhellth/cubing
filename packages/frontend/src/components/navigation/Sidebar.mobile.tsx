import AlarmFilledIcon from '@mui/icons-material/Alarm';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import { Divider, Drawer, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVENT_AND_DISCIPLINES_MAP } from "../../utils/constants";
import HCButton from "../HCButton";
import DisciplineButton from "./DisciplineButton";
import { CenteredListItem, HamburgerButton, MobileDrawerHeader, MobileDrawerLayout, MobileFloatingWrapper, PrivacyButton, ScrollArea } from './Sidebar.styles';

export default function SidebarMobile({ selectedDiscipline, onDisciplineChange, isVisible }: any) {
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    return (
        <MobileFloatingWrapper isVisible={isVisible}>
            <HamburgerButton onClick={toggleDrawer}>
                <MenuIcon />
            </HamburgerButton>

            <Drawer
                anchor="left"
                open={openDrawer}
                onClose={toggleDrawer}
                ModalProps={{ keepMounted: true }}
            >

                <MobileDrawerLayout>
                    {/* Mobile Header: Close + Main Nav */}
                    <MobileDrawerHeader>
                        {/* Home */}
                        <HCButton onClick={() => { navigate("/"); setOpenDrawer(false); }}>
                            <AlarmFilledIcon sx={{ fontSize: 24 }} />| Timer
                        </HCButton>

                        <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </MobileDrawerHeader>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

                    {/* Scrollable Disciplines List */}
                    <ScrollArea sx={{ flex: 1 }}>
                        {[...EVENT_AND_DISCIPLINES_MAP].map(([disc, event]) => (
                            <CenteredListItem key={event}>
                                <DisciplineButton
                                    name={event}
                                    size={40}
                                    disc={disc} // Removed TypeScript cast for brevity
                                    isSelected={selectedDiscipline === disc}
                                    onClick={() => { onDisciplineChange(disc); setOpenDrawer(false) }}
                                />
                            </CenteredListItem>
                        ))}
                    </ScrollArea>

                    {/* Mobile Footer: Privacy */}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <PrivacyButton onClick={() => window.open('/privacy-policy', '_blank')}
                            sx={{
                                position: 'relative',
                                bottom: 'auto',
                                left: 'auto',
                                width: 'auto'
                            }}>
                            <PrivacyTipIcon sx={{ fontSize: '16px !important' }} />Privacy
                        </PrivacyButton>
                    </Box>
                </MobileDrawerLayout>
            </Drawer>
        </MobileFloatingWrapper>
    );
}