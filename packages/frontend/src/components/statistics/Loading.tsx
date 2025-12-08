import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { alpha, Box, useTheme } from '@mui/material';

export default function CalculationLoader() {
    const theme = useTheme();

    // --- Colors based on your theme ---
    // We create an alpha (transparent) version of the bright accent for the "trails"
    const glowColor = theme.palette.info.main; 
    const secondaryColor = theme.palette.secondary.main;
    const orbitalColor = theme.palette.warning.main; // Adding an extra pop of color (Orange/Gold) for contrast

    // --- Animations ---
    const spin = {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    };

    const spinReverse = {
        '0%': { transform: 'rotate(360deg)' },
        '100%': { transform: 'rotate(0deg)' },
    };

    const pulse = {
        '0%': { opacity: 0.6, transform: 'scale(0.95)', filter: 'brightness(1)' },
        '50%': { opacity: 1, transform: 'scale(1.05)', filter: 'brightness(1.3)' },
        '100%': { opacity: 0.6, transform: 'scale(0.95)', filter: 'brightness(1)' },
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: "100%",
                flex: 1,
                bgcolor: 'transparent', // Ensuring it sits on your primary.main background
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* 1. Ambient Background Glow - Gives depth to the dark theme */}
            <Box 
                sx={{
                    position: 'absolute',
                    width: '300px',
                    height: '300px',
                    background: `radial-gradient(circle, ${alpha(glowColor, 0.15)} 0%, transparent 70%)`,
                    borderRadius: '50%',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />

            {/* Container for the layering */}
            <Box sx={{ position: 'relative', width: 120, height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>

                {/* 2. Outer Ring - The "Track" */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: `1px solid ${alpha(secondaryColor, 0.3)}`, // Very subtle track
                    }}
                />

                {/* 3. Outer Orbiting "Data Particle" (Blue/Info) */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        // We use a transparent border but add a glow to the top edge
                        border: '2px solid transparent',
                        borderTopColor: glowColor,
                        
                        // Neon Glow effect
                        filter: `drop-shadow(0 0 4px ${glowColor})`, 
                        
                        animation: 'spin 2s linear infinite',
                        '@keyframes spin': spin,

                        // This pseudo-element creates the "dot" at the head of the spinning line
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '12%', // Adjust based on curvature
                            left: '84%', 
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: glowColor,
                            boxShadow: `0 0 10px ${glowColor}`, // Bright particle glow
                        }
                    }}
                />

                {/* 4. Inner Ring - Reverse Spin with Contrast Color */}
                <Box
                    sx={{
                        position: 'absolute',
                        width: '70%',
                        height: '70%',
                        borderRadius: '50%',
                        border: '2px solid transparent',
                        borderBottomColor: orbitalColor, // Using Warning/Orange for contrast against Blue
                        borderLeftColor: alpha(orbitalColor, 0.5), // Fading tail
                        
                        filter: `drop-shadow(0 0 2px ${orbitalColor})`,
                        
                        animation: 'reverseSpin 1.5s linear infinite',
                        '@keyframes reverseSpin': spinReverse,
                    }}
                />

                {/* 5. Center Icon - Pulsing with Gradient Text effect */}
                <AutoGraphIcon
                    sx={{
                        fontSize: 36,
                        // This applies a gradient to the Icon itself using SVG masking logic within CSS
                        color: glowColor,
                        filter: `drop-shadow(0 0 8px ${alpha(glowColor, 0.6)})`, // Glow behind the icon
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': pulse,
                    }}
                />

            </Box>
        </Box>
    );
}