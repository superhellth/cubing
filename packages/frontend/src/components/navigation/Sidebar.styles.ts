import { Box, IconButton, Stack } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

// 1. The Main Wrapper (Desktop)
export const NavContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isVisible',
})<any>(({ isVisible }) => ({
    display: "flex",
    visibility: isVisible ? "visible" : "hidden",
    position: "relative",
    padding: "16px",
}));

// 2. The Fixed Sidebar (Left Bar)
export const SidebarContainer = styled(Stack, {
    shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed: boolean }>(({ theme, collapsed }) => ({
    width: collapsed ? "75px" : "14vw",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "1rem",
    alignItems: "flex-start",
    backgroundColor: theme.palette.secondary.main,
    zIndex: 20,
    position: "relative",
    overflow: "hidden",
    transition: 'width 0.3s cubic-bezier(0.19, 1, 0.22, 1)'
}));

// 3. The Toggle Arrow Button Wrapper
export const ToggleButton = styled(IconButton)(({ theme }) => ({
    borderRadius: 0,
    height: 20,
    color: theme.palette.info.dark,
}));

// 4. The Privacy Policy Button
export const PrivacyButton = styled(IconButton)(({ theme }) => ({
    textTransform: 'none',
    width: "100%",
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
    borderRadius: '20px',
    padding: 0,
    border: '1px solid transparent',

    '&:hover': {
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(4px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },

    '&:active': {
        transform: 'translateY(0px)',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
}));

// 5. The Slide-out Drawer Container
export const DrawerContainer = styled(Box)(({ theme }) => ({
    position: "absolute",
    zIndex: 10,
    left: "103px",
    top: "16px",
    bottom: "16px",
    width: "65px",
    borderRadius: "24px",
    overflow: "hidden",
    background: `linear-gradient(180deg, ${alpha(theme.palette.secondary.main, 0.3)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0px 5px 20px -5px rgba(60,60,60,0.1)",
}));

// 6. The Scrollable Area (Hides Scrollbars) - REUSED IN MOBILE
export const ScrollArea = styled(Box)({
    height: "100%",
    overflowY: "auto",
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
});

// 7. Gradient Overlay
export const GradientOverlay = styled(Box)({
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50px',
    borderRadius: "24px",
    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))',
    pointerEvents: 'none',
});

// ==========================================
// NEW: MOBILE SPECIFIC COMPONENTS
// ==========================================

// 8. Wrapper for the Floating Hamburger Button
export const MobileFloatingWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isVisible',
})<any>(({ isVisible }) => ({
    visibility: isVisible ? "visible" : "hidden",
    position: "fixed",
    top: 16,
    left: 16,
    zIndex: 1200,
}));

// 9. The Hamburger Button Itself
export const HamburgerButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    boxShadow: theme.shadows[3],
    '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
    },
}));

// 10. The Content Inside the Mobile Drawer
export const MobileDrawerLayout = styled(Box)(({ theme }) => ({
    width: 200,
    height: '100%',
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
}));

// 11. The Header inside the Mobile Drawer (Close btn + Nav)
export const MobileDrawerHeader = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px', // theme.spacing(2)
});

// 12. Helper to center items in the list
export const CenteredListItem = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
}));