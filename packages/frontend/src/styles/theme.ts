import { red } from '@mui/material/colors';
import '@mui/material/styles';
import { alpha, createTheme } from '@mui/material/styles';
import type { } from '@mui/x-charts/themeAugmentation';

declare module '@mui/material/styles' {
    interface Palette {
        graphColors: Record<string, string>;
    }

    interface PaletteOptions {
        graphColors?: Record<string, string>;
    }
}

// const primary = "#222831";
const primary = "#121212";
const primaryLight = "#343d4b";
const primaryDark = "#15191e";
// const secondary = "#393E46";
const secondary = "#1E1E1E";
const secondaryLight = "#505762";
const secondaryDark = "#22252a";
const accent = "#00ADB5"
const accentDarker = "#007980";
const accentLighter = "#00dae6";
// const text = "#EEEEEE";
const text = "#F2F2F2";
const secondaryText = "#A1A1AA";
// const text = "#EDEDED";
const background = "#2C2C2C";

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
            secondary: secondaryText
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
            avg12: "#009E73",
            avg100: "#D55E00",
            avg1000: "#CC79A7",
            duration: "#F0E442",
        }
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
        MuiDivider: {
            styleOverrides: {
                root: ({ theme }) => ({
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    // left: "24px"
                })
            }
        },
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
        },
        // MuiSlider: {
        //     styleOverrides: {

        //     }
        // },
        MuiMenuItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    // 1. Hover state
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.info.main, 0.3),
                    },
                    // 2. Selected state
                    '&.Mui-selected': {
                        backgroundColor: theme.palette.info.dark,
                        // 3. Hover state WHILE selected
                        '&:hover': {
                            backgroundColor: theme.palette.info.light,
                        },
                    },
                    // Optional: You might want to unset the focus visible opacity if it conflicts
                    '&.Mui-focusVisible': {
                        backgroundColor: theme.palette.info.main,
                    }
                }),
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    // Default state (matches :not(.Mui-focused))
                    color: "rgba(255, 255, 255, 0.6)",

                    // Focused state
                    '&.Mui-focused': {
                        color: theme.palette.info.main,
                    },
                }),
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    // 1. Target the focused state
                    '&.Mui-focused': {
                        // 2. Target the distinct border element (fieldset)
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.info.main, // Change to your desired color
                            borderWidth: '2px', // Optional: thicker border on focus
                        },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: "rgba(255, 255, 255, 0.6)", // Change to your desired color
                        borderWidth: '2px', // Optional: thicker border on focus
                    },
                }),
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: ({ theme }) => ({
                    // Default state
                    color: "rgba(255, 255, 255, 0.6)",

                    // Focused state
                    '&.Mui-focused': {
                        color: theme.palette.info.main,
                    },
                }),
            },
        },
    },
});

export default theme;