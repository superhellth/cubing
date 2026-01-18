import { keyToLabels } from "@cubing/shared";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseIcon from '@mui/icons-material/Close';
import { ListItemText, Slider } from "@mui/material";
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
import { useTimerSettings } from "../../contexts/TimerSettingsContext";

const AVERAGE_DISPLAY_ORDER = ["duration", "avg5", "avg12", "avg100", "avg1000", "pb"];

function TimerSettings({ isOpen, onClose }: { isOpen: boolean, onClose: Function }) {
    const theme = useTheme();
    const { settings, updateSetting } = useTimerSettings();

    const handleDisplayChange = (event: any) => {
        const sortedSelection = AVERAGE_DISPLAY_ORDER.filter(item => event.target.value.includes(item));

        updateSetting('avgGraphDisplay', sortedSelection);
    };

    return (
        <Dialog open={isOpen} sx={{ color: "red" }}>
            <DialogTitle sx={{ textAlign: "center", fontSize: "3rem", fontWeight: "bold", color: "#FFFFFF" }}>Settings
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
                borderColor: "rgba(255, 255, 255, 0.06)",
                color: "#E4E4E7",
                p: 4
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
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.clickToTime}
                                        color="info"
                                        onChange={(e) => { updateSetting('clickToTime', e.target.checked); }}
                                    />
                                }
                                label="Use Mouse Timer"
                            />
                            <TextField
                                label="Preparation Timer"
                                variant="outlined"
                                color="info"
                                size="small"
                                fullWidth
                                value={settings.readyAfter}
                                onChange={(e) => updateSetting('readyAfter', e.target.value)}
                                helperText="The time you have to press spacebar before starting your solve (ms)."
                            />
                        </Stack>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography variant="overline" display="block" gutterBottom >
                            Graph
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
                                    {AVERAGE_DISPLAY_ORDER.filter(v => v !== "pb").map((key) => (
                                        <MenuItem key={key} value={key} sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between', // Pushes text left, icon right
                                            alignItems: 'center',
                                            gap: 2 // Ensures text doesn't hit the checkmark
                                        }}>
                                            <ListItemText primary={keyToLabels[key as keyof typeof keyToLabels]} />
                                            {settings.avgGraphDisplay.indexOf(key) > -1 && (
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
                                <FormHelperText>Which values to display in the Timer Graph.</FormHelperText>
                            </FormControl>
                            <FormControl fullWidth size="small">
                                <Slider
                                    value={settings.avgGraphNumSolves}
                                    onChange={(_event: Event, newValue: number) => { updateSetting("avgGraphNumSolves", newValue) }}
                                    valueLabelDisplay="auto"
                                    shiftStep={30}
                                    step={10}
                                    marks
                                    color="info"
                                    min={0}
                                    max={500}
                                />
                                <FormHelperText>How many solves to display.</FormHelperText>
                            </FormControl>

                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default TimerSettings;