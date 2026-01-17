import { FormControl, FormHelperText, InputLabel, ListItemText, MenuItem, Select, useTheme } from "@mui/material";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

function CCSingleSelect({ options, selected, onChange, helperText, label }: any) {
    const theme = useTheme();

    return (
        <FormControl fullWidth size="small">
            <InputLabel>{label}</InputLabel>
            <Select
                value={selected}
                variant="outlined"
                label={label}
                onChange={onChange}
                renderValue={(selected) => selected}
            >
                {options.map((option: any) => (
                    <MenuItem key={option} value={option} sx={{
                        display: 'flex',
                        flexDirection: "row",
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <ListItemText primary={option} />
                        {selected === option && (
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
            <FormHelperText>{helperText}</FormHelperText>
        </FormControl>
    );
}

export default CCSingleSelect;