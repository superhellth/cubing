import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import Typography from "@mui/material/Typography";
import { Box, Stack, useTheme } from "@mui/system";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";

function TimerSettings({ isOpen, onClose, settings, updateSetting }: { isOpen: boolean, onClose: Function, settings: any, updateSetting: Function }) {
    const theme = useTheme();
    return (
        <Dialog open={isOpen} sx={{ color: "red" }}>
            <DialogTitle sx={{ bgcolor: "primary.main", textAlign: "center", fontSize: "3rem", fontWeight: "bold" }}>Settings
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
            <DialogContent sx={{ bgcolor: "primary.main" }} dividers>
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
                                <InputLabel>Graph Axis</InputLabel>
                                <Select
                                    value={settings.avgGraphXAxis}
                                    variant="outlined"
                                    label="Graph Axis"
                                    onChange={(e) => {updateSetting('avgGraphXAxis', e.target.value)}}
                                >
                                    <MenuItem value={"date"}>Date</MenuItem>
                                    <MenuItem value="id">Solve ID</MenuItem>
                                </Select>
                                <FormHelperText>Unit of the X-Axis of the Average Graph.</FormHelperText>
                            </FormControl>
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default TimerSettings;