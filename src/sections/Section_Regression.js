import {useContext, useState} from "react";
import {ThemeContext} from "../contexts/theme_context";
import {Button, Grid, Skeleton, Stack, Typography} from "@mui/material";
import {RoundedBoxedText} from "../minicomponents/RoundedBoxedText";
import {DropDownControl} from "../minicomponents/DropDownControl";
import {SingleSelect} from "../minicomponents/SingleSelect";
import MultiSelect from "../minicomponents/MultiSelect";
import {API_Model, API_Regression} from "../minicomponents/WebAPIs";

export function Section_Regression(props) {
    const theme = useContext(ThemeContext);
    const [model, setModel] = useState("");
    const [dependent, setDependent] = useState("");
    const [independents, setIndependents] = useState([]);

    const [text, setText] = useState(<p>Chose a model to run...</p>)

    function Render(model, dependent, independents) {
        API_Regression({
            model: model,
            dependent: dependent,
            independents: independents
        }, (body) => {
            setText(body)
        })
    }

    return (
        <Stack spacing={2}>
            <Typography variant="h4" style={{color:theme.primary_dark}}>
                Regression Fit
            </Typography>
            <Stack spacing={2}>
                <RoundedBoxedText borderColor={theme.secondary} elevation={2}>
                    <Typography variant="body1" style={{color:theme.text_dark}} component="div">
                        <p>
                            Doing data modeling is really where R shines compared to its alternatives with more robust&nbsp;
                            backend frameworks (like Java/C#/Python/JavaScript). There is a relatively simple example where&nbsp;
                            the user can specify between a OLS, Fixed Effects, or Random Effects model to fit the current data.
                        </p>
                        <p>
                            Further work on this will focus on a more user friendly output as well as expanding its functionality&nbsp;
                            while maintaining the no-code experience.
                        </p>
                    </Typography>
                </RoundedBoxedText>
                <RoundedBoxedText borderColor={theme.primary_dark} backgroundColor={theme.background_dark}>
                    <Typography variant="body2" style={{lineHeight: 1}} component="div">
                        <code style={{color: theme.text_light, whiteSpace: "pre"}}>{text}</code>
                    </Typography>
                </RoundedBoxedText>
                <DropDownControl title="Regression Control Panel">
                    <Grid container spacing={3}>
                        <Grid item xs={6} paddingRight={3}>
                            <SingleSelect label="Model Type" id="regression_model_select"
                                          onChangeCallback={(value) => {setModel(value)}}
                                          data={{labels: props.models.model, values: props.models.code}}
                                          value={model}/>
                        </Grid>
                        <Grid item xs={6} paddingLeft={3}>
                            <SingleSelect label="Dependent" id="regression_dependent_select"
                                          onChangeCallback={(value) => {setDependent(value)}}
                                          data={{labels: props.indicators.indicator, values: props.indicators.code}}
                                          value={dependent}/>
                        </Grid>
                        <Grid item xs={12}>
                            <MultiSelect label="Independents" id="regression_independent_select"
                                         onChangeCallback={(value) => {setIndependents(value)}}
                                         data={{labels: props.indicators.indicator, values: props.indicators.code}}
                                         values={independents}
                            />
                        </Grid>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <Button variant="contained" onClick={() => {
                                Render(model, dependent, independents)
                            }}>Render</Button>
                        </Grid>
                    </Grid>
                </DropDownControl>
            </Stack>

        </Stack>
    )
}
