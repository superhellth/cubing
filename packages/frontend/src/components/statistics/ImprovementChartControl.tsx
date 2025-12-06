import { keyToLabels } from "@cubing/shared";
import { Box, Checkbox, FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, Paper, Select, SelectChangeEvent, Slider, Stack, Table, TableBody, TableCell, tableCellClasses, TableRow, ToggleButton, ToggleButtonGroup, Typography, useTheme } from "@mui/material";
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
            borderRadius: 2,
            gap: 2,
            paddingBottom: "1rem"
        }}>
            <Table size='small' sx={{
                width: "auto",
                [`& .${tableCellClasses.root}`]: {
                    borderBottom: "none",
                    padding: "0 16px",
                },
            }}>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <FormHelperText>Display Times</FormHelperText>
                        </TableCell>
                        <TableCell>
                            <FormHelperText>Prediction Horizon</FormHelperText>
                        </TableCell>
                        <TableCell>
                            <FormHelperText>Details</FormHelperText>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="left" sx={{ minWidth: "300px" }}>
                            <FormControl fullWidth sx={{ bgcolor: "#090909", border: "1px solid #333333", p: 1, borderRadius: 2 }}>
                                <Select
                                    
                                    multiple
                                    value={display}
                                    variant="standard"
                                    onChange={handleDisplayChange}
                                    renderValue={(selected) => selected.map((value: string) => keyToLabels[value as keyof typeof keyToLabels]).join(', ')}
                                    MenuProps={MenuProps}
                                >
                                    {["avg5", "avg12", "avg100", "avg1000", "pb"].map((key) => (
                                        <MenuItem key={key} value={key} sx={{ bgcolor: "#090909" }}>
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
                        </TableCell>
                        <TableCell sx={{ minWidth: "300px" }}>
                            <FormControl fullWidth sx={{ bgcolor: "#090909", border: "1px solid #333333", p: 1, borderRadius: 2 }}>

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
                        </TableCell>
                        <TableCell>
                            <FormControl sx={{ bgcolor: "#090909", border: "1px solid #333333", borderRadius: 2 }}>
                                <ToggleButtonGroup
                                    value={sampleThreshold}
                                    exclusive
                                    onChange={handleSampleThresholdChange}
                                    sx={{
                                        justifyContent: 'center',
                                        // bgcolor: "blue",
                                        // p: 0,
                                    }}
                                >
                                    <ToggleButton value={100} >
                                        Min
                                    </ToggleButton>
                                    {/* <ToggleButton value={numSolves / 100}>
                                        Some
                                    </ToggleButton> */}
                                    <ToggleButton value={Math.floor(numSolves / 10)}>
                                        Medium
                                    </ToggleButton>
                                    {/* <ToggleButton value={numSolves / 3}>
                                        Lots
                                    </ToggleButton> */}
                                    <ToggleButton value={numSolves}>
                                        Max
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </FormControl>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>



        </Box>
    );
})

export default ImprovementChartControl;