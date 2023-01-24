import {Typography} from "@mui/material";
import {useContext} from "react";
import {ThemeContext} from "../contexts/theme_context";

export function Section_Title() {
    const theme = useContext(ThemeContext);
    return (
        <Typography variant="h1" style={{color: theme.text_dark,  textAlign: "center"}}>
            Full Stack Demo
        </Typography>)
}
