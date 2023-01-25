import {createTheme, responsiveFontSizes, ThemeProvider, Typography} from "@mui/material";
import {useContext} from "react";
import {ThemeContext} from "../contexts/theme_context";

export function Section_Title() {
    let fontTheme = createTheme();
    fontTheme = responsiveFontSizes(fontTheme);
    const theme = useContext(ThemeContext);
    return (
        <ThemeProvider theme={fontTheme}>
            <Typography variant="h1" style={{color: theme.text_dark,  textAlign: "center"}}>
                Full Stack Demo
            </Typography>
        </ThemeProvider>
    )
}
