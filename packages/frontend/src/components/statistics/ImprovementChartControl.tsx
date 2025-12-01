import { keyToLabels } from "@cubing/shared";
import { Box, Checkbox, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, Slider, Stack, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
import { memo } from "react";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import OutlinedContainer from "../OutlinedContainer";
import { height } from "@mui/system";

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
            alignItems: 'flex-start',
            width: "70%",
            gap: 2,
            paddingBottom: "1rem"
        }}>


            <FormControl fullWidth>
                {/* <InputLabel>Display Times</InputLabel> */}
                <FormHelperText>Display Times</FormHelperText>
                <Select
                    multiple
                    value={display}
                    variant="standard"
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
                <FormHelperText>Details</FormHelperText>
                <ToggleButtonGroup
                    value={sampleThreshold}
                    exclusive
                    onChange={handleSampleThresholdChange}
                    sx={{
                        justifyContent: 'center',
                        width: '100%',
                        // bgcolor: "blue",
                        // p: 0,
                    }}
                >
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
            </FormControl>
            <FormControl fullWidth >
                <FormHelperText>Prediction Horizon</FormHelperText>
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