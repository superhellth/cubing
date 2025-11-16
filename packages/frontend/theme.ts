import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const primary = "#222831";
const primaryLight = "#222831";
const secondary = "#393E46";
const accent = "#00ADB5"
const accentDarker = "#007980";
const accentLighter = "#00dae6";
const text = "#EEEEEE";
const background = "#000000";

const theme = createTheme({
    palette: {
        primary: {
            main: primary,
            light: primaryLight
        },
        secondary: {
            main: secondary
        },
        text: {
            primary: text,
        },
        info: {
            main: accent,
            light: accentLighter,
            dark: accentDarker
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
            "Space Mono", 
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
        }
    },
});

export default theme;