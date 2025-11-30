import { keyToLabels } from "@cubing/shared";
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, SelectChangeEvent, Slider, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { memo } from "react";

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
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
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
                >
                    {["avg5", "avg12", "avg100", "avg1000", "pb"].map((key) => (
                        <MenuItem key={key} value={key}>
                            <Checkbox checked={display.includes(key)} />
                            <ListItemText primary={keyToLabels[key as keyof typeof keyToLabels]} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <ToggleButtonGroup
                value={sampleThreshold}
                exclusive
                onChange={handleSampleThresholdChange}
                sx={{
                    justifyContent: 'center',
                    width: '100%'
                }}
            >
                <ToggleButton value={100} >
                    Max
                </ToggleButton>
                <ToggleButton value={numSolves / 100}>
                    Heavy
                </ToggleButton>
                <ToggleButton value={numSolves / 10}>
                    Medium
                </ToggleButton>
                <ToggleButton value={numSolves / 3}>
                    Slight
                </ToggleButton>
                <ToggleButton value={numSolves}>
                    None
                </ToggleButton>
            </ToggleButtonGroup>
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
        </Stack>
    );
})

export default ImprovementChartControl;