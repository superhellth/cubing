import { keyToLabels } from "@cubing/shared";
import { Box, Checkbox, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, Slider, Stack, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { memo } from "react";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const OutlinedContainer = ({ label, children, focused }: any) => {
    return (
        <Box
            component="fieldset"
            sx={{
                // 1. The Border & Shape
                border: "1px solid rgba(255, 255, 255, 0.23)", // Standard MUI Dark border
                borderRadius: "4px", // Matches default MUI radius
                margin: 0,
                padding: "8px 12px", // Matches standard input padding
                backgroundColor: "transparent",

                // 2. The Interaction (Hover & Focus)
                transition: "border-color 0.2s",
                "&:hover": {
                    borderColor: "#FFFFFF", // Brighten on hover
                },
                "&:focus-within": {
                    borderColor: "#60A5FA", // Primary Color (Sky Blue)
                    borderWidth: "1px",     // Or "2px" if you want it thick like TextField
                },

                // Optional: If you want to force the focus style via prop
                ...(focused && {
                    borderColor: "#60A5FA",
                    borderWidth: "1px",
                }),
            }}
        >
            {/* 3. The Label (The "Cut-Out" Title) */}
            <Box
                component="legend"
                sx={{
                    // Typography matching the "Shrunk" InputLabel
                    fontSize: "0.75rem", // 12px
                    color: "rgba(255, 255, 255, 0.6)", // Secondary Text
                    padding: "0 4px", // Gap size around the text
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Inherit font

                    // Color change on focus
                    "*:focus-within &": {
                        color: "#60A5FA"
                    }
                }}
            >
                {label}
            </Box>

            {/* 4. Your Toggle Buttons go here */}
            {children}
        </Box>
    );
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const AVERAGE_DISPLAY_ORDER = ["avg5", "avg12", "avg100", "avg1000", "pb"];

const ImprovementChartControl = memo(({ numSolves, display, onDisplaySelectionChanged,
    predict, onPredictionHorizonChanged,
    sampleThreshold, onSampleThresholdChanged }: any) => {
    const theme = useTheme();

    const handleDisplayChange = (event: SelectChangeEvent<typeof display>) => {
        const { target: { value } } = event;
        const newDisplaySelection: any = typeof value === 'string' ? value.split(',') : value;
        const sortedSelection = AVERAGE_DISPLAY_ORDER.filter(item => newDisplaySelection.includes(item));

        onDisplaySelectionChanged(sortedSelection);
    };
    const handlePredictionHorizonChange = (_event: Event, newValue: number) => {
        onPredictionHorizonChanged(newValue);
    };
    const handleSampleThresholdChange = (_event: any, newValue: any) => {
        onSampleThresholdChanged(newValue);
    }

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            width: "70%",
            gap: 2,
            paddingBottom: "1rem"
        }}>
            <FormControl fullWidth>
                <InputLabel>Display Times</InputLabel>
                <Select
                    multiple
                    value={display}
                    variant="outlined"
                    label="Display Times"
                    onChange={handleDisplayChange}
                    // input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.map((value: string) => keyToLabels[value as keyof typeof keyToLabels]).join(', ')}
                    MenuProps={MenuProps}
                // sx={{bgcolor: theme.palette.primary.main}}
                >
                    {["avg5", "avg12", "avg100", "avg1000", "pb"].map((key) => (
                        <MenuItem key={key} value={key}>
                            <ListItemText primary={keyToLabels[key as keyof typeof keyToLabels]} />
                            {display.includes(key) && (
                                <CheckRoundedIcon
                                    sx={{
                                        color: theme.palette.info.main,
                                        fontSize: '1.2rem'
                                    }}
                                />
                            )}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <OutlinedContainer label="Chart View">
                    <ToggleButtonGroup
                        value={sampleThreshold}
                        exclusive
                        onChange={handleSampleThresholdChange}
                        sx={{
                            justifyContent: 'center',
                            width: '100%'
                        }}
                    >
                        {/* <legend style={{
                        fontSize: '0.75rem',
                        color: '#A0A0A0',
                        padding: '0 8px', // Space around text so border doesn't strike through
                        marginLeft: '8px'
                    }}>
                        Sample Size
                    </legend> */}
                        <ToggleButton value={100} >
                            Min
                        </ToggleButton>
                        <ToggleButton value={numSolves / 100}>
                            Some
                        </ToggleButton>
                        <ToggleButton value={numSolves / 10}>
                            Medium
                        </ToggleButton>
                        <ToggleButton value={numSolves / 3}>
                            Lots
                        </ToggleButton>
                        <ToggleButton value={numSolves}>
                            Max
                        </ToggleButton>
                    </ToggleButtonGroup>
                </OutlinedContainer>
            </FormControl>
            <FormControl fullWidth >
                {/* <InputLabel>Display Times</InputLabel> */}
                <Slider
                    value={predict}
                    onChange={handlePredictionHorizonChange}
                    valueLabelDisplay="auto"
                    shiftStep={30}
                    step={5}
                    marks
                    color="info"
                    min={0}
                    max={100}
                />
            </FormControl>
        </Box>
    );
})

export default ImprovementChartControl;