import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';

export const SlideTableRow = styled(TableRow)(({ theme }) => ({
    position: 'relative', // Needed for absolute positioning of the checkbox
    
    // 1. Target the Checkbox Cell
    '& .select-checkbox': {
        opacity: 0,
        transition: theme.transitions.create('opacity', { duration: 200 }),
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '40px', // Width of the slide
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: 'none', // Remove border to avoid double lines
        zIndex: 1,
    },

    // 2. Target the Data Cells (Everything except the checkbox)
    '& .data-cell': {
        transition: theme.transitions.create('transform', { duration: 200 }),
        transform: 'translateX(0)',
    },

    // 3. Hover State
    '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.action.hover, // Optional: highlight row
        
        '& .select-checkbox': {
            opacity: 1,
        },
        '& .data-cell': {
            transform: 'translateX(40px)', // Move text right to make room
        },
    },
}));