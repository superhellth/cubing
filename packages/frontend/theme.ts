import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const primary = "#100d9b";
const secondary = "#1f1e61ff";
const text = "#ffffffff";
const background = "#000000ff";

const theme = createTheme({
    palette: {
        primary: {
            main: primary,
        },
        secondary: {
            main: secondary,
        },
        text: {
            primary: text,
        },
        error: {
            main: red.A400,
        },
        background: {
            default: background,
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        button: {
            textTransform: 'none',
        }
    },
    components: {
        MuiChartsTooltip: {
            styleOverrides: {
                paper: {
                    backgroundColor: secondary,
                    color: text,
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        backgroundColor: secondary,
                        "&:hover": {
                            backgroundColor: background,
                        },
                    },
                    "&:hover": {
                        backgroundColor: background,
                    }
                },
            },
        },

    },
});

export default theme;