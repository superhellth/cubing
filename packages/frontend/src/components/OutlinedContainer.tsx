import { Box, useTheme } from "@mui/system";

const OutlinedContainer = ({ label, children }: any) => {
    const theme = useTheme();

    return (
        <Box
            component="fieldset"
            sx={{
                border: "1px solid rgba(255, 255, 255, 0.6)",
                borderRadius: "4px",
                margin: 0,
                padding: 0,
                // padding: "8px 12px",
                // height: "100%",
                // backgroundColor: "red",
                backgroundColor: "transparent",


                transition: "border-color 0.2s",
                "&:hover": {
                    borderColor: "#FFFFFF",
                },
                "&:focus-within": {
                    borderColor: theme.palette.info.main,
                    borderWidth: "1px",
                },
            }}
        >
            {/* 3. The Label (The "Cut-Out" Title) */}
            <Box
                component="legend"
                sx={{
                    fontSize: "0.75rem",
                    color: theme.palette.text.secondary,
                    padding: "0 4px", 

                    // Color change on focus
                    // "*:focus-within &": {
                    //     color: theme.palette.info.main
                    // }
                }}
            >
                {label}
            </Box>

            {/* 4. Your Toggle Buttons go here */}
            {children}
        </Box>
    );
};

export default OutlinedContainer;