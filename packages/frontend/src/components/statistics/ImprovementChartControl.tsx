import { keyToLabels } from "@cubing/shared";
import DoneIcon from '@mui/icons-material/Done';
import { Box, Chip, FormControl, FormHelperText, Slider, Table, TableBody, TableCell, tableCellClasses, TableRow, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { memo } from "react";

const ImprovementChartControl = memo(({ numSolves, display, onDisplaySelectionChanged,
    predict, onPredictionHorizonChanged,
    sampleThreshold, onSampleThresholdChanged, mediumSamplingLimit }: any) => {

    const handlePredictionHorizonChange = (_event: Event, newValue: number) => {
        onPredictionHorizonChanged(newValue);
    };
    const handleSampleThresholdChange = (_event: any, newValue: any) => {
        if (newValue !== null) {
            onSampleThresholdChanged(newValue);
        }
    }
    const handleToggle = (value: string) => {
        const currentIndex = display.indexOf(value);
        const newChecked = [...display];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        onDisplaySelectionChanged(newChecked);
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            borderRadius: 2,
            gap: 2,
            paddingBottom: "1rem"
        }}>
            {numSolves > 30 &&
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
                            {numSolves >= 150 &&
                                <TableCell>
                                    <FormHelperText>Details</FormHelperText>
                                </TableCell>
                            }
                        </TableRow>
                        <TableRow>
                            <TableCell align="left" sx={{ minWidth: "300px" }}>
                                <Box
                                    sx={{
                                        bgcolor: "#090909",
                                        border: "1px solid #333333",
                                        p: 1,
                                        borderRadius: 2,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1,
                                    }}
                                >
                                    {["avg5", "avg12", "avg100", "avg1000", "pb"].map((key) => {
                                        const isSelected = display.includes(key);

                                        return (
                                            <Chip
                                                key={key}
                                                label={keyToLabels[key as keyof typeof keyToLabels]}
                                                onClick={() => handleToggle(key)}
                                                deleteIcon={<DoneIcon />}
                                                // Styling logic
                                                sx={{
                                                    // Selected Style
                                                    ...(isSelected && {
                                                        bgcolor: "info.main", // Or a specific hex like '#333333'
                                                        color: "#fff",
                                                        border: "1px solid #333333",
                                                        "&:hover": {
                                                            bgcolor: "info.dark",
                                                        },
                                                    }),
                                                    // Unselected Style
                                                    ...(!isSelected && {
                                                        bgcolor: "transparent",
                                                        color: "#888", // Greyed out text for unselected
                                                        border: "1px solid #333333",
                                                        "&:hover": {
                                                            bgcolor: "#1a1a1a",
                                                            borderColor: "#555",
                                                        },
                                                    }),
                                                }}
                                            />
                                        );
                                    })}
                                </Box>
                            </TableCell>
                            <TableCell sx={{ minWidth: "300px" }}>
                                <FormControl fullWidth sx={{ bgcolor: "#090909", border: "1px solid #333333", p: 1, borderRadius: 2 }}>
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
                            {numSolves >= 150 &&
                                <TableCell>
                                    <FormControl sx={{ bgcolor: "#090909", border: "1px solid #333333", borderRadius: 2 }}>
                                        <ToggleButtonGroup
                                            value={sampleThreshold}
                                            exclusive
                                            onChange={handleSampleThresholdChange}
                                            sx={{
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <ToggleButton value={100} >
                                                Min
                                            </ToggleButton>
                                            <ToggleButton value={mediumSamplingLimit}>
                                                Medium
                                            </ToggleButton>
                                            <ToggleButton value={numSolves}>
                                                Max
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </FormControl>
                                </TableCell>
                            }
                        </TableRow>
                    </TableBody>
                </Table>
            }



        </Box>
    );
})

export default ImprovementChartControl;