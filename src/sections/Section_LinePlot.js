import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../contexts/theme_context";
import {Button, Grid, Skeleton, Stack, Typography} from "@mui/material";
import {RoundedBoxedText} from "../minicomponents/RoundedBoxedText";
import {DropDownControl} from "../minicomponents/DropDownControl";
import {SingleSelect} from "../minicomponents/SingleSelect";
import MultiSelect from "../minicomponents/MultiSelect";
import {API_Data} from "../minicomponents/WebAPIs";
import {LinePlot} from "../charts/LinePlot";

export function Section_LinePlot(props) {
    const theme = useContext(ThemeContext);
    const [yValue, setYValue] = useState("hdi");
    const [yScale, setYScale] = useState("linear");
    const [countries, setCountries] = useState(["VNM"]);
    const [regions, setRegions] = useState([]);
    const [incomegroups, setIncomeGroups] = useState(["Low income",
        "Lower middle income",
        "Upper middle income",
        "High income"]);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [options, setOptions] = useState(null);

    function Render(yValue, yLabel, yScale, countries, regions, incomegroups) {
        // Put on loading
        setLoading(true)
        // Call Web API - get data
        let data = {group: [], y: [], year: []}
        API_Data({
            level: "country",
            include_indicators: [yValue],
            include_members_or_groups: countries
        }, (body) => {
            // Convert data
            if (body.country.length > 0) {
                data.group.push(...body.country)
                data.y.push(...body[yValue])
                data.year.push(...body.year)
            }
            // Next call
            API_Data({
                level: "region",
                include_indicators: [yValue],
                include_members_or_groups: regions
            }, (body) => {
                // Convert data
                if (body.region.length > 0) {
                    data.group.push(...body.region)
                    data.y.push(...body[yValue])
                    data.year.push(...body.year)
                }
                // Next call
                API_Data({
                    level: "incomegroup",
                    include_indicators: [yValue],
                    include_members_or_groups: incomegroups
                }, (body) => {
                    // Convert data
                    if (body.incomegroup.length > 0) {
                        data.group.push(...body.incomegroup)
                        data.y.push(...body[yValue])
                        data.year.push(...body.year)
                    }
                    // Set Data
                    setData(data)
                })
            })
        })
        // Set up options
        const options = {
            responsive: true,
            aspectRatio: 3/2,
            scales: {
                y: {type: yScale,
                    title: {
                        text: yLabel,
                        display: true
                    }
                }
            }
        }
        setOptions(options)
    }

    useEffect(() => {
        Render("hdi",
            "Human Development Index",
            "linear", ["VNM"],
            [], ["Low income",
                "Lower middle income",
                "Upper middle income",
                "High income"])
    },[])

    useEffect(() => {
        if (data !== null && options !== null) {
            setLoading(false)
        }
    }, [data, options])

    return (
        <Stack spacing={2}>
            <Typography variant="h4" style={{color:theme.primary_dark}}>
                Line Plot
            </Typography>
            <Grid container>
                <Grid item md={6} sm={8} xs={12} paddingRight={2}>
                    {loading ? <Skeleton variant="rectangular" height="100%" width="100%"/>
                        : <LinePlot raw_data={data} options={options}/>}
                </Grid>
                <Grid item md={6} sm={4} xs={12} paddingLeft={2}>
                    <RoundedBoxedText borderColor={theme.secondary} elevation={2}>
                        <p>
                            The graph on the right is a typical line plot. Such a plot allows us to see how a single variable&nbsp;
                            changes overtime. This plot also allows comparison of different countries/groups overtime.&nbsp;
                            With the addition of a slider, the user can zoom in on a particular timezone of interest.
                        </p>
                        <p>
                            The control panel below allow the user to select the y variable, along with the&nbsp;
                            type of scale. In addition, the user can choose which country/group to include.
                        </p>
                    </RoundedBoxedText>
                </Grid>
            </Grid>
            <DropDownControl title="Line Plot Control Panel">
                <Grid container spacing={3}>
                    <Grid item xs={6} paddingRight={3}>
                        <SingleSelect label="Y Variable" id="bar_plot_y_select"
                                      onChangeCallback={(value) => {setYValue(value)}}
                                      data={{labels: props.indicators.indicator, values: props.indicators.code}}
                                      value={yValue}/>
                    </Grid>
                    <Grid item xs={6} paddingLeft={3}>
                        <SingleSelect label="Y Scale" id="bar_plot_y_scale"
                                      onChangeCallback={(value) => {setYScale(value)}}
                                      data={{labels: props.scales.scale, values: props.scales.code}}
                                      value={yScale}/>
                    </Grid>
                    <Grid item xs={12}>
                        <MultiSelect label="Countries" id="line_plot_countries_select"
                                     onChangeCallback={(value) => {setCountries(value)}}
                                     data={{labels: props.countries.country, values: props.countries.iso3}}
                                     values={countries}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MultiSelect label="Regions" id="line_plot_regions_select"
                                     onChangeCallback={(value) => {setRegions(value)}}
                                     data={{labels: props.regions.region, values: props.regions.region}}
                                     values={regions}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MultiSelect label="Income Groups" id="line_plot_income_groups_select"
                                     onChangeCallback={(value) => {setIncomeGroups(value)}}
                                     data={{labels: props.income_groups.incomegroup, values: props.income_groups.incomegroup}}
                                     values={incomegroups}
                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent="flex-end">
                        <Button variant="contained" onClick={() => {
                            Render(yValue,
                                props.indicators.indicator[props.indicators.code.indexOf(yValue)],
                                yScale, countries, regions, incomegroups)
                        }}>Render</Button>
                    </Grid>
                </Grid>
            </DropDownControl>
        </Stack>
    )
}


