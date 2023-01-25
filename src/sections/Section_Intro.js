import {Grid, Skeleton, Stack, Typography} from "@mui/material";
import {useContext} from "react";
import {ThemeContext} from "../contexts/theme_context";
import {RoundedBoxedText} from "../minicomponents/RoundedBoxedText";
import PNG from "../resources/FullStack.png"


export function Section_Intro() {
    const theme = useContext(ThemeContext);
    return (
        <Stack>
            <Grid container>
                <Grid item md={4} sm={6} paddingRight={{xs: 0, md:1, sm:2}} paddingBottom={{xs: 1, md:0}}>
                    <img src={PNG} width="100%" />
                </Grid>
                <Grid item md={8} sm={6}  paddingLeft={{xs: 0, md:1, sm:2}}>
                    <RoundedBoxedText borderColor={theme.background_highlight}
                                      backgroundColor={theme.background_highlight}
                                      elevation={2}
                    >
                        <Typography variant="body1" style={{color:theme.primary_dark}} component="div">
                            <p>
                                This page is designed as a demonstration for a full stack web application focusing on,&nbsp;
                                allowing researchers to leverage the data manipulation/modeling capabilities of R and its&nbsp;
                                expansive libraries while still allow for a complex, beautiful front end with React.js.
                            </p>
                            <p>
                                Additional libraries are used for both frontend and backend, notably Chart.js and React Leaflet&nbsp;
                                are used to create charts and world maps, R/tidyverse and R/giscoR used for data manipulation,&nbsp;
                                and AXIOS and R/httpuv are for HTTP communications.
                            </p>
                            <p>
                                Data shown here are gathered from World Bank Data for some common development statistics globally.
                            </p>
                        </Typography>
                    </RoundedBoxedText>
                </Grid>
            </Grid>
        </Stack>
    )
}
