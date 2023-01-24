import {useContext} from "react";
import {ThemeContext} from "../contexts/theme_context";

export function Section_Footer() {
    const theme = useContext(ThemeContext);
    return (
        <div style={{height: "5vh"}}/>
    )
}
