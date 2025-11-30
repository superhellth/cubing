import { keyToLabels } from "@cubing/shared";
import CloseIcon from '@mui/icons-material/Close';
import { Checkbox, ListItemText } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Box, Stack, useTheme } from "@mui/system";

const AVERAGE_DISPLAY_ORDER = ["avg5", "avg12", "avg100", "avg1000", "pb"];

function TimerSettings({ isOpen, onClose, settings, updateSetting }: { isOpen: boolean, onClose: Function, settings: any, updateSetting: Function }) {
    const theme = useTheme();

    const handleDisplayChange = (event: any, newV: any) => {
        // console.log(event.target.value)
        // const { target: { value } } = event;
        // const newDisplaySelection: any = typeof value === 'string' ? value.split(',') : value;
        const sortedSelection = AVERAGE_DISPLAY_ORDER.filter(item => event.target.value.includes(item));

        updateSetting('avgGraphDisplay', sortedSelection);
    };

    return (
        <Dialog open={isOpen} sx={{ color: "red" }}>
            <DialogTitle sx={{ bgcolor: "secondary.main", textAlign: "center", fontSize: "3rem", fontWeight: "bold" }}>Settings
                <IconButton
                    aria-label="close"
                    onClick={() => onClose()}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8, color: "secondary.light",
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{
                bgcolor: "secondary.main",
                borderColor: "rgba(255, 255, 255, 0.06)",
                color: "primary.contrastText"
            }} dividers>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="overline" display="block" gutterBottom >
                            Timer
                        </Typography>
                        <Stack spacing={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.inspection}
                                        color="info"
                                        onChange={(e) => updateSetting('inspection', e.target.checked)}
                                    />
                                }
                                label="Use Inspection"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.hideElementsWhileSolving}
                                        color="info"
                                        onChange={(e) => updateSetting('hideElementsWhileSolving', e.target.checked)}
                                    />
                                }
                                label="Hide all elements while solving"
                            />
                            <TextField
                                label="Preparation Timer"
                                variant="outlined"
                                color="info"
                                size="small"
                                fullWidth
                                value={settings.readyAfter}
                                onChange={(e) => updateSetting('readyAfter', e.target.value)}
                                helperText="The time you have to press spacebar before starting your solve."
                            />
                        </Stack>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography variant="overline" display="block" gutterBottom >
                            Display
                        </Typography>
                        <Stack spacing={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Displayed Times</InputLabel>
                                <Select
                                    value={settings.avgGraphDisplay}
                                    variant="outlined"
                                    multiple
                                    label="Displayed Times"
                                    onChange={handleDisplayChange}
                                    renderValue={(selected) => selected.map((value: string) => keyToLabels[value as keyof typeof keyToLabels]).join(', ')}
                                >
                                    {AVERAGE_DISPLAY_ORDER.map((key) => (
                                        <MenuItem key={key} value={key}>
                                            <Checkbox checked={settings.avgGraphDisplay.includes(key)} />
                                            <ListItemText primary={keyToLabels[key as keyof typeof keyToLabels]} />
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Which values to display in the Timer Graph.</FormHelperText>
                            </FormControl>
                            <FormControl fullWidth size="small">
                                <InputLabel>Graph Axis</InputLabel>
                                <Select
                                    value={settings.avgGraphXAxis}
                                    variant="outlined"
                                    label="Graph Axis"
                                    onChange={(e) => { updateSetting('avgGraphXAxis', e.target.value) }}
                                >
                                    <MenuItem value={"date"}>Date</MenuItem>
                                    <MenuItem value="id">Solve ID</MenuItem>
                                </Select>
                                <FormHelperText>Unit of the X-Axis of the Timer Graph.</FormHelperText>
                            </FormControl>
                            
                        </Stack>
                    </Box>
                </Stack>
                {/* avgGraphDisplay: ["avg5", "avg12"],
    avgGraphNumSolves: 50 */}
            </DialogContent>
        </Dialog>
    );
}

export default TimerSettings;