import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../contexts/theme_context";
import {Button, Grid, Skeleton, Stack, Typography} from "@mui/material";
import {RoundedBoxedText} from "../minicomponents/RoundedBoxedText";
import {DropDownControl} from "../minicomponents/DropDownControl";
import {SingleSelect} from "../minicomponents/SingleSelect";
import {Map} from "../charts/Map";
import {API_Data} from "../minicomponents/WebAPIs";

export function Section_Map(props) {
    const theme = useContext(ThemeContext);
    const [indicator, setIndicator] = useState("eys")
    const [colorPalette, setColorPalette] = useState("three");
    const [tempColorPalette, setTempColorPalette] = useState("three")

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    function Render(indicator) {
        // Put on loading
        setLoading(true)
        // Call Web API - get data
        API_Data({
            level: "country",
            include_indicators: [indicator]
        }, (body) => {
            let data = {
                iso3: body.iso3,
                group: body.country,
                year: body.year,
                value: body[indicator]
            }
            setData(data)
        })
        setColorPalette(tempColorPalette)
    }

    useEffect(() => {
        Render("eys")
    },[])

    useEffect(() => {
        if (data !== null) {
            setLoading(false)
        }
    }, [data])

    return (
        <Stack spacing={2}>
            <Typography variant="h4" style={{color:theme.primary_dark}}>
                Map Plot
            </Typography>
            <RoundedBoxedText borderColor={theme.secondary} elevation={2}>
                <Typography variant="body1" style={{color:theme.text_dark}} component="div">
                    <p>
                        Another example of a useful graph is a world map. Such a map allow the reader to have a overview&nbsp;
                        of a variable across the world. The reader also has the option to choose between two color scale.
                    </p>
                </Typography>
            </RoundedBoxedText>
            {loading ? <Skeleton variant="rectangular" style={{aspectRatio: 16/9}} height="100%" width="100%"/>
                : <Map geodata={props.mapData} palette={colorPalette} indicator={indicator} data={data}
                       label={props.indicators.indicator[props.indicators.code.indexOf(indicator)]}/>}
            <DropDownControl title="Map Control Panel">
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <SingleSelect label="Indicator" id="map_indicator_select"
                                      onChangeCallback={(value) => {setIndicator(value)}}
                                      data={{labels: props.indicators.indicator, values: props.indicators.code}}
                                      value={indicator}/>
                    </Grid>
                    <Grid item xs={6}>
                        <SingleSelect label="Color Palette" id="map_color_pal_select"
                                      onChangeCallback={(value) => {setTempColorPalette(value)}}
                                      data={{labels: props.palette.palette, values: props.palette.code}}
                                      value={tempColorPalette}/>
                    </Grid>
                    <Grid item xs={12} container justifyContent="flex-end">
                        <Button variant="contained" onClick={() => {
                            Render(indicator)
                        }}>Render</Button>
                    </Grid>
                </Grid>
            </DropDownControl>
        </Stack>
    )
}
