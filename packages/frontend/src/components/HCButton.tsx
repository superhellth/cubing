import { IconButton, styled, type ButtonProps } from "@mui/material";

interface HCButtonProps extends ButtonProps {
    
}

const HCButton = styled(IconButton, {
    shouldForwardProp: (prop) => prop !== 'isSelected',
})<HCButtonProps>(({ theme}) => ({
    color: theme.palette.info.light,
    border: "1px solid",
    borderRadius: "10px",
    padding: 0,
    '&:hover': {
        color: theme.palette.info.dark,
    },
}));

export default HCButton;