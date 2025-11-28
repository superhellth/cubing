import { red } from '@mui/material/colors';
import { createTheme, duration } from '@mui/material/styles';
import tinycolor from 'tinycolor2';

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

function generateDoubleTriad(baseColor: string): string[] {
    const start = tinycolor(baseColor);
    const colors: string[] = [];

    // 0, 60, 120, 180, 240, 300
    for (let i = 0; i < 6; i++) {
        colors.push(start.clone().spin(i * 60).toHexString());
    }

    return [...colors].reverse();
}

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
        warning: {
            main: "#ffff00"
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
            paper: primary
        },
        graphColors: {
            pb: accent,
            avg5: "#0072B2",
            avg12: "#D55E00",
            avg100: "#009E73",
            avg1000: "#CC79A7",
            duration: "#F0E442",
        }
    },
    // lineGraphColorList: ["#0072B2", "#D55E00", "#009E73", "#CC79A7", "#F0E442"],
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
                paper: ({ theme }) => ({
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.text.primary,
                }),
            },
        },
        MuiBarChart: {
            defaultProps: {
                colors: [accentDarker, primary],
            },
        },
        MuiScatterChart: {
            defaultProps: {
                colors: [accentDarker, primary],
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: ({ theme }) => ({
                    backgroundColor: theme.palette.secondary.main,
                    fontSize: "1rem"
                }),
                arrow: ({ theme }) => ({
                    color: theme.palette.secondary.main
                })
            }
        }
    },
});

export default theme;