import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import LockIcon from '@mui/icons-material/Lock';

export function LockedOverlay({ children, numSolves, solvesToUnlock, hint, fontSize }: any) {
    const active: boolean = numSolves < solvesToUnlock;

    return (
        <Box sx={{ position: 'relative', height: "100%" }}>
            {active &&
                <Box sx={{
                    position: "absolute",
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                    userSelect: "none"
                }}>

                    <LockIcon sx={{ fontSize: 40, color: "grey.500", mb: 1 }} />
                    <Typography sx={{fontSize: fontSize}} noWrap>
                        {hint}
                    </Typography>
                    <Typography sx={{fontSize: fontSize}}>
                        ({numSolves} / {solvesToUnlock})
                    </Typography>
                </Box>
            }
            <BlurrableContent active={active}>
                {children}
            </BlurrableContent>
        </Box>

    );
}

const BlurrableContent = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 0,
    filter: active ? "blur(5px)" : "none",
    transform: "translate3d(0,0,0)", 
    backfaceVisibility: "hidden", 
    perspective: 1000,
    userSelect: active ? "none" : "auto",
    pointerEvents: active ? "none" : "auto",
    // backgroundColor: "red",
    opacity: active ? 0.5 : 1,
}));