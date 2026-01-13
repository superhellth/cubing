import { IconButton, styled, type ButtonProps } from "@mui/material";

interface HCButtonProps extends ButtonProps {
    isSelected: boolean;
    drawBorder: boolean;
}

const HCButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'isSelected',
})<HCButtonProps>(({ theme, isSelected, drawBorder }) => ({
    color: isSelected ? theme.palette.info.light : theme.palette.info.dark,
    border: drawBorder ? "1px solid" : "none",
    borderRadius: drawBorder ? "10px" : "0px",
    padding: 0,
    '&:hover': {
        color: isSelected ? theme.palette.info.dark : theme.palette.info.main,
    },
}));

export default HCButton;