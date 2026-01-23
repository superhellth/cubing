import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';

export const SlideTableRow = styled(TableRow)(({ theme }) => ({
    position: 'relative', // Needed for absolute positioning of the checkbox
    transition: theme.transitions.create('transform', { duration: 200 }),
    transform: 'translateX(0)',

    // 1. Target the Checkbox Cell
    '& .select-checkbox': {
        opacity: 0,
        transition: theme.transitions.create('opacity', { duration: 200 }),
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        // bgcolor: "transparent",
        padding: 0,
        paddingLeft: "10px",
        width: '20px', // Width of the slide
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        transform: 'translateX(-20px)',
    },

    '&.Mui-selected, &:hover': {
        cursor: 'pointer',
        transform: 'translateX(20px)',

        '& .select-checkbox': {
            opacity: 1,
        },
    },

    // '&.Mui-selected': {
    //     backgroundColor: "rgba(255, 255, 255, 0.08) !important", // Force selected color
    // },
    // '&.Mui-selected:hover': {
    //     backgroundColor: "rgba(255, 255, 255, 0.12) !important", // Slightly lighter on hover
    // }
}));