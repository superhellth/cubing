import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, FormHelperText, InputLabel, Link, MenuItem, Paper, Select, Slider, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import { Box, Grid, Stack, useTheme } from "@mui/system";
import { useEffect, useState } from "react";
import HCButton from '../HCButton';

const STAGE_OPTIONS = [
    { value: 'full', label: 'Full Cube' },
    { value: 'oll', label: 'OLL (Top Face)' },
    { value: 'pll', label: 'PLL (Top Layer)' },
    { value: 'cll', label: 'CLL (Corners Only)' },
    { value: 'cross', label: 'Cross' },
    { value: 'f2l', label: 'F2L' },
    { value: 'f2l_1', label: 'F2L Pair 1' },
    { value: 'wv', label: 'Winter Variation' },
];

const COLOR_OPTIONS = [
    { value: "t", label: "Transparent" },
    { value: "black", label: "Black" },
    { value: "white", label: "White" },
    { value: "dgrey", label: "Dark Grey" },
    { value: "grey", label: "Light Grey" },
    { value: "silver", label: "Silver" },
    { value: "yellow", label: "Yellow" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "pink", label: "Pink" },
]

interface AlgVisControlsParams {
    fileFormat: string;
    setGeneratedUrl: Function;
    setFileFormat: Function;
}

function AlgVisControls({ setGeneratedUrl, fileFormat, setFileFormat }: AlgVisControlsParams) {
    const theme = useTheme();
    // Core
    const [alg, setAlg] = useState("R U R' U'");
    const [isCase, setIsCase] = useState<boolean>(false); // Toggles between 'alg' and 'case' param
    const [puzzleSize, setPuzzleSize] = useState<number>(3);

    // View & Format
    const [view, setView] = useState("iso"); // default to plan (top down) as it's cleaner for algs
    const [imageSize, setImageSize] = useState<number>(300);
    const [stage, setStage] = useState("full");

    // Styling
    const [bg, setBg] = useState("t"); // Transparent
    const [cc, setCc] = useState("black"); // Cube Color
    const [opacity, setOpacity] = useState(100); // 0-100

    // Advanced
    const [rotation, setRotation] = useState({ x: -34, y: 45, z: 0 });
    const [arrows, setArrows] = useState(""); // e.g. U0U2

    // --- URL Construction ---
    useEffect(() => {
        const baseUrl = "https://cosmic-cubing.com/cube-img/";
        const params = new URLSearchParams();

        // Core
        params.append('fmt', fileFormat);
        params.append('pzl', String(puzzleSize));
        params.append('size', String(imageSize));

        // The main logic: "alg" shows the moves applied, "case" solves the case
        if (alg.trim()) {
            params.append(isCase ? 'case' : 'alg', alg.trim());
        }

        // View Parameters
        if (view && view !== 'iso') params.append('view', view);
        if (stage && stage !== "full") params.append('stage', stage);

        // Style Parameters
        if (bg && bg !== 'white') params.append('bg', bg);
        if (cc && cc !== 'black') params.append('cc', cc);
        if (opacity < 100) params.append('co', String(opacity));
        params.append('r', `y${rotation.y}x${rotation.x}z${rotation.z}`);
        if (arrows) params.append('arw', arrows);

        setGeneratedUrl(`${baseUrl}?${params.toString()}`);
    }, [alg, isCase, puzzleSize, fileFormat, view, imageSize, stage, bg, cc, opacity, rotation, arrows]);

    const handleReset = () => {
        setAlg("R U R' U'");
        setIsCase(false);
        setView("iso");
        setBg("t");
        setFileFormat("svg");
        setPuzzleSize(3);
        setCc("black")
        setImageSize(300);
        setOpacity(100);
        setStage("full");
        setArrows("");
        setRotation({ x: -34, y: 45, z: 0 });
    };

    const handleChange = (axis: any, value: number) => {
        setRotation(prev => ({
            ...prev,
            [axis]: value
        }));
    };

    return (
        <Box sx={{ p: 2, border: '1px solid #27272a', borderRadius: "10px", overflow: 'auto', flex: 2, bgcolor: theme.palette.secondary.main }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, pb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h5" fontWeight="bold">
                        VisualCube Studio
                    </Typography>

                    {/* The Hint / Link */}
                    <Tooltip title="Based on the VisualCube project. Click to visit their docs." arrow>
                        <Link
                            href="http://cube.rider.biz/visualcube.php"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="inherit"
                            sx={{ display: 'flex', opacity: 0.7, '&:hover': { opacity: 1, color: theme.palette.info.main } }}
                        >
                            <InfoOutlinedIcon />
                        </Link>
                    </Tooltip>
                </Stack>
                <Tooltip title="Reset Defaults" arrow>
                    <HCButton onClick={handleReset}>
                        <RefreshIcon sx={{ fontSize: "2rem" }} />
                    </HCButton>
                </Tooltip>
            </Box>

            <Stack spacing={2} >
                {/* 1. The Algorithm Section */}
                <Paper sx={{ p: 2, borderRadius: "10px" }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 9 }}>
                            <TextField
                                fullWidth
                                label="Algorithm Sequence"
                                value={alg}
                                onChange={(e) => setAlg(e.target.value)}
                                placeholder="e.g. R U R' U'"
                                variant="outlined"
                                multiline
                            />
                        </Grid>
                        <Grid size={{ xs: 3 }}>
                            <Tooltip title="Toggle between applying moves (Alg) or solving a specific case (Case)" arrow>
                                <FormControl>

                                    <ToggleButtonGroup
                                        value={isCase}
                                        exclusive
                                        fullWidth
                                        onChange={(_event: any, v: any) => { if (v != null) setIsCase(v) }}
                                        sx={{
                                            borderRadius: 2,
                                            bgcolor: "#090909",
                                            border: "1px solid #333333"
                                        }}
                                    >
                                        <ToggleButton value={false} >
                                            Alg
                                        </ToggleButton>
                                        <ToggleButton value={true}>
                                            Case
                                        </ToggleButton>

                                    </ToggleButtonGroup>
                                </FormControl>
                            </Tooltip>
                        </Grid>
                        <Grid size={{ xs: 6, md: 6 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Puzzle Size</InputLabel>
                                <Select
                                    value={puzzleSize}
                                    label="Puzzle Size"
                                    onChange={(e) => setPuzzleSize(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7].map(n => <MenuItem key={n} value={n}>{n}x{n}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 6, md: 6 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Format</InputLabel>
                                <Select
                                    value={fileFormat}
                                    label="Format"
                                    onChange={(e) => setFileFormat(e.target.value)}
                                >
                                    <MenuItem value="svg">SVG (Vector)</MenuItem>
                                    <MenuItem value="png">PNG</MenuItem>
                                    <MenuItem value="jpg">JPG</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {/* 2. View & Masking */}
                <Accordion defaultExpanded elevation={5} sx={{ borderRadius: "10px" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">Perspective & Filters</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>View Perspective</InputLabel>
                                    <Select value={view} label="View Perspective" onChange={(e) => setView(e.target.value)}>
                                        <MenuItem value="iso">Isometric (3D)</MenuItem>
                                        <MenuItem value="plan">Plan (Top Down)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Display Filter</InputLabel>
                                    <Select value={stage} label="Display Filter" onChange={(e) => setStage(e.target.value)}>
                                        {STAGE_OPTIONS.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                {/* <Typography gutterBottom variant="caption">Image Size (px)</Typography> */}
                                <Slider
                                    color="info"
                                    value={imageSize}
                                    onChange={(_, v) => setImageSize(v)}
                                    min={100} max={1024} step={50}
                                    valueLabelDisplay="auto"
                                />
                                <FormHelperText>Image Size ({imageSize} px) - Only displayed up to 500px</FormHelperText>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* 3. Colors & Style */}
                <Accordion elevation={5} sx={{ borderRadius: "10px" }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">Colors & Style</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 6, md: 6 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Background Color</InputLabel>
                                    <Select value={bg} label="Background Color" onChange={(e) => setBg(e.target.value)}>
                                        {COLOR_OPTIONS.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 6, md: 6 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Cube Color</InputLabel>
                                    <Select value={cc} label="Cube Color" onChange={(e) => setCc(e.target.value)}>
                                        {COLOR_OPTIONS.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Slider
                                    color="info"
                                    value={opacity}
                                    onChange={(_, v) => setOpacity(v)}
                                    min={0} max={100} step={10}
                                />
                                <FormHelperText>Cube Opacity ({opacity}%)</FormHelperText>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* 4. Advanced / Arrows */}
                <Accordion elevation={5} sx={{ borderRadius: "10px" }} disabled>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight="bold">Advanced: Arrows & Rotation</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Slider
                                    color="info"
                                    value={rotation.y}
                                    onChange={(e: any) => handleChange('y', e.target.value)}
                                    min={-180} max={180} step={5}
                                />
                                <FormHelperText>Rotation X ({rotation.y}°)</FormHelperText>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Slider
                                    color="info"
                                    value={rotation.x}
                                    onChange={(e: any) => handleChange('x', e.target.value)}
                                    min={-180} max={180} step={5}
                                />
                                <FormHelperText>Rotation Y ({rotation.x}°)</FormHelperText>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Slider
                                    color="info"
                                    value={rotation.z}
                                    onChange={(e: any) => handleChange('z', e.target.value)}
                                    min={-180} max={180} step={5}
                                />
                                <FormHelperText>Rotation Z ({rotation.z}°)</FormHelperText>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Arrows"
                                    placeholder="e.g. U0U2, U2U8"
                                    helperText="Format: Face+Index -> Face+Index"
                                    value={arrows}
                                    onChange={(e) => setArrows(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

            </Stack>
        </Box>
    );
}

export default AlgVisControls;