import {createTheme, responsiveFontSizes, Stack, ThemeProvider, Typography} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import {useContext} from "react";
import {ThemeContext} from "../contexts/theme_context";
import Link from '@mui/material/Link';

export function Section_Footer() {
    const theme = useContext(ThemeContext)
    let fontTheme = createTheme();
    fontTheme = responsiveFontSizes(fontTheme);
    return (
        <ThemeProvider theme={fontTheme}>
            <div style={{backgroundColor: theme.background_highlight}}>
                <Link href="https://github.com/HungKNguyen" underline="none" color="inherit">
                    <Stack direction="row" my={2} justifyContent={"center"} alignItems={"center"} spacing={2}>
                        <GitHubIcon fontSize="large"/>
                        <Typography variant={"h6"}>
                            Designed and Built by Hung Nguyen
                        </Typography>
                    </Stack>
                </Link>
            </div>
        </ThemeProvider>
    )
}
