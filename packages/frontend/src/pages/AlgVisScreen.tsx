import {
    Box,
    useTheme
} from '@mui/material';
import { useState } from 'react';
import AlgVisControls from '../components/algvis/AlgVisControls';
import CubePreview from '../components/algvis/CubePreview';


function AlgVisScreen() {
    const theme = useTheme();
    const [generatedUrl, setGeneratedUrl] = useState<string>("");
    const [fileFormat, setFileFormat] = useState<string>("svg");

    return (
        <Box sx={{ p: 3, bgcolor: theme.palette.primary.main, height: '100%', display: 'flex', justifyContent: 'space-between', gap: 2 }}>

            <CubePreview url={generatedUrl} fileFormat={fileFormat} />
            <AlgVisControls fileFormat={fileFormat} setFileFormat={setFileFormat} setGeneratedUrl={setGeneratedUrl} />

        </Box>
    );
}

export default AlgVisScreen;