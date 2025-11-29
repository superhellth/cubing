import { ISolve, keyToLabels } from "@cubing/shared";
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent, Slider, Stack } from "@mui/material";
import { memo, useState } from "react";

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

const ImprovementChartControl = memo(({ display, onDisplaySelectionChanged, predict, onPredictionHorizonChanged }: any) => {
    // const [display, setDisplay] = useState<string[]>(["avg100", "avg1000", "pb"]);
    // const [predict, setPredict] = useState<number>(20);

    const handleDisplayChange = (event: SelectChangeEvent<typeof display>) => {
        const { target: { value } } = event;
        const newDisplaySelection: any = typeof value === 'string' ? value.split(',') : value;
        // setDisplay(newDisplaySelection);
        // console.log(newDisplaySelection)
        onDisplaySelectionChanged(newDisplaySelection);
    };
    const handlePredictionHorizonChange = (_event: Event, newValue: number) => {
        // setPredict(newValue);
        onPredictionHorizonChanged(newValue);
    };

    return (
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <FormControl fullWidth sx={{ bgcolor: "secondary.main" }}>
                <InputLabel>Display Times</InputLabel>
                <Select
                    multiple
                    value={display}
                    onChange={handleDisplayChange}
                    input={<OutlinedInput label="Tag" />}
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
            <FormControl fullWidth sx={{ bgcolor: "secondary.main" }}>
                {/* <InputLabel>Display Times</InputLabel> */}
                <Slider
                    value={predict}
                    onChange={handlePredictionHorizonChange}
                    valueLabelDisplay="auto"
                    shiftStep={30}
                    step={5}
                    marks
                    min={0}
                    max={100}
                />
            </FormControl>
        </Stack>
    );
})

export default ImprovementChartControl;