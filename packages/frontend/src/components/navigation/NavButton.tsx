import { IconButton, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";

const NavigationButton = ({ icon, label, isCollapsed, isSelected, onClick, isVisible }: any) => {
  return (
    <NavButton isSelected={isSelected} onClick={onClick}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "24px", // Keeps icon size consistent

          // Optional: slight scale effect on active
          transform: isSelected ? "scale(1.1)" : "scale(1)",
          transition: "transform 0.2s",
        }}
      >
        {icon}
      </Box>

      {/* 2. The Text (Collapsible) */}
      <Box
        sx={{
          // Animation Logic
          maxWidth: isCollapsed ? 0 : "200px",
          opacity: isCollapsed ? 0 : 1,
          transition: isVisible ? "all 0.1s ease-in-out" : "none",

          // Layout safety
          overflow: "hidden",     // Hides content as it shrinks
          whiteSpace: "nowrap",   // Prevents text wrapping
        }}
      >
        {/* Padding is applied inside the collapsing box so it disappears too */}
        <Typography
          variant="body1"
          fontWeight={isSelected ? "bold" : "medium"}
          sx={{ marginLeft: "12px" }}
        >
          {label}
        </Typography>
      </Box>
    </NavButton>
  );
};

const NavButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  color: isSelected ? theme.palette.secondary.main : theme.palette.text.primary,
  width: "100%",
  justifyContent: "flex-start",
  borderRadius: "10px",
  backgroundColor: isSelected ? theme.palette.text.primary : theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.text.secondary : theme.palette.secondary.light,
  },
}));

export default NavigationButton;