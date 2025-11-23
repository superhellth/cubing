import { Button, styled, type ButtonProps } from "@mui/material";

interface HCButtonProps extends ButtonProps {
    isSelected: boolean
}

const HCButton = styled(Button)<HCButtonProps>(({ theme, isSelected }) => ({
    color: isSelected ? theme.palette.info.light : theme.palette.primary.main,
    '&:hover': {
        color: theme.palette.info.dark,
    },
}));

export default HCButton;