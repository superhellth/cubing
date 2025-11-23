import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const primary = "#222831";
const primaryLight = "#343d4b";
const primaryDark = "#15191e";
const secondary = "#393E46";
const secondaryLight = "#505762";
const secondaryDark = "#22252a";
const accent = "#00ADB5"
const accentDarker = "#007980";
const accentLighter = "#00dae6";
const text = "#EEEEEE";
const background = "#000000";

const theme = createTheme({
    palette: {
        primary: {
            main: primary,
            light: primaryLight,
            dark: primaryDark
        },
        secondary: {
            main: secondary,
            light: secondaryLight,
            dark: secondaryDark
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
            paper: primaryDark
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
                paper: ({theme}) => ({
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.text.primary,
                }),
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: ({theme}) => ({
                    backgroundColor: theme.palette.secondary.main,
                    fontSize: "1rem"
                }),
                arrow: ({theme}) => ({
                    color: theme.palette.secondary.main
                })
            }
        }
    },
});

export default theme;