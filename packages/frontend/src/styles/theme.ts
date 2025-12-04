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
            "IBM Plex Sans",
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
        MuiDialog: {
            styleOverrides: {
                paper: {
                    // backgroundColor: primary,
                    backgroundColor: "#27272A",
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                },
                root: {
                    '& .MuiBackdrop-root': {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(3px)",
                    }
                }
            }
        },
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
                    // backgroundColor: theme.palette.secondary.main,
                    // color: theme.palette.text.primary,
                    backgroundColor: "rgba(30, 30, 30, 0.90)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
                    padding: "12px",
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
                    fontSize: "1rem",
                    backgroundColor: "rgba(30, 30, 30, 0.90)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "8px",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
                    padding: "12px",
                }),
                arrow: ({ theme }) => ({
                    color: "rgba(30, 30, 30, 0.90)",
                    "&::before": {
                        // Apply the same border and backdrop properties
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        backgroundColor: "rgba(30, 30, 30, 0.90)",
                        boxSizing: "border-box",
                    },
                })
            }
        },
        MuiSlider: {
            styleOverrides: {
                valueLabel: ({ theme }) => ({
                    backgroundColor: theme.palette.primary.main,
                    fontSize: "1rem"
                }),
            }
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    backgroundColor: "#27272A",
                    border: "1px solid rgba(255, 255, 255, 0.1)",

                    borderRadius: "12px",
                    marginTop: "8px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",

                    "&::-webkit-scrollbar": {
                        width: "6px"
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(255,255,255,0.2)",
                        borderRadius: "3px"
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "transparent"
                    }
                },
                list: {
                    paddingTop: 0,
                    paddingBottom: 0,
                },

            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: "#D4D4D4",
                    fontSize: "0.95rem",
                    padding: "10px 16px",

                    "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        color: "#FFFFFF",
                    },

                    "&.Mui-selected": {
                        backgroundColor: alpha(theme.palette.info.main, 0.15),
                        color: "#FFFFFF",
                        fontWeight: 600,
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.info.main, 0.25),
                        }
                    }
                })
            }
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
                        borderWidth: '1px', // Optional: thicker border on focus
                    },
                }),
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: '6px !important',
                    border: 'none',
                    color: theme.palette.text.secondary,
                    // color: "#A0A0A0",
                    '&.Mui-selected': {
                        backgroundColor: '#333333',
                        color: '#FFFFFF',
                        boxShadow: '0px 2px 4px rgba(0,0,0,0.4)',

                        '&:hover': {
                            backgroundColor: '#383838',
                        },
                    },
                }),
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: ({ theme }) => ({
                    // Default state
                    // color: "rgba(255, 255, 255, 0.6)",
                    marginLeft: 0,

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