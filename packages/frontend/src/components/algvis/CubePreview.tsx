import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { Button, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

interface CubePreviewParams {
    url: string;
    fileFormat: string;
}

function CubePreview({ url, fileFormat }: CubePreviewParams) {

    const handleDownload = async () => {
        try {
            console.log(url)
            const response = await fetch(url);
            const blob = await response.blob();
            const objectURL = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectURL;
            link.download = `cube_alg.${fileFormat}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    return (
        <Box sx={{ border: '1px solid #27272a', borderRadius: "10px", p: 1, flex: 4, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
                Live Preview
            </Typography>

            <Box
                sx={{
                    height: "100%",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // border: '1px dashed #ddd',
                    borderRadius: 2,
                    mb: 2,
                    overflow: 'hidden'
                }}
            >
                {/* The VisualCube Image */}
                <img
                    src={url}
                    alt="Cube Visualization"
                    style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                    color='info'
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => navigator.clipboard.writeText(url)}
                >
                    Copy URL
                </Button>
                <Button
                    color='info'
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                >
                    Download
                </Button>
            </Stack>
        </Box>
    );
}

export default CubePreview;