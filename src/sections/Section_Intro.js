import {Grid, Stack, Typography} from "@mui/material";
import {useContext} from "react";
import {ThemeContext} from "../contexts/theme_context";
import {RoundedBoxedText} from "../minicomponents/RoundedBoxedText";
import PNG from "../resources/FullStack.png"


export function Section_Intro() {
    const theme = useContext(ThemeContext);
    return (
        <Stack>
            <Grid container>
                <Grid item md={6} sm={12} paddingRight={{sm: 0, md:1}} paddingBottom={{xs: 1, md:0}}>
                    <img src={PNG} width="100%" alt="Tech Stack"/>
                </Grid>
                <Grid item md={6} sm={12}  paddingLeft={{sm: 0, md:1}}>
                    <RoundedBoxedText borderColor={theme.background_highlight}
                                      backgroundColor={theme.background_highlight}
                                      elevation={2}
                    >
                        <Typography variant="body1" style={{color:theme.primary_dark}} component="div">
                            <p>
                                Did you know R can be used as a Web server? I certainly didn't before starting this project.&nbsp;
                                Between coding web applications for my computer science major and running data&nbsp;
                                analysis for my econometrics major, I always wonder, is there a way to combine them together.
                            </p>
                            <p>
                                I have always been interested with the concept of an <b>interactive</b> research paper - something&nbsp;
                                that you can both read and "play" with. This concept is more than just vanity, an interactive&nbsp;
                                research paper can allow reader a deeper exploration of data, the ability to run their own regression&nbsp;
                                ,and the access to prebuild models trained by the author(s).
                            </p>
                            <p>
                                The image here shows the tech stack (JavaScript Frontend - R Backend) I used to build this project. The main goal is to&nbsp;
                                demonstrate a subset of functionalities that a small research team can reasonably provide&nbsp;
                                for their website.
                            </p>
                        </Typography>
                    </RoundedBoxedText>
                </Grid>
            </Grid>
        </Stack>
    )
}
