import { IconButton, styled, type ButtonProps } from "@mui/material";

interface HCButtonProps extends ButtonProps {
    isSelected: boolean
}

const HCButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'isSelected',
})<HCButtonProps>(({ theme, isSelected }) => ({
    color: isSelected ? theme.palette.info.light : theme.palette.info.dark,
    '&:hover': {
        color: isSelected ? theme.palette.info.dark : theme.palette.info.main,
    },
}));

export default HCButton;