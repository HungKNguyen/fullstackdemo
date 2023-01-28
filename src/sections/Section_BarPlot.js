import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../contexts/theme_context";
import {Button, Grid, Skeleton, Stack, Typography} from "@mui/material";
import {RoundedBoxedText} from "../minicomponents/RoundedBoxedText";
import {DropDownControl} from "../minicomponents/DropDownControl";
import {SingleSelect} from "../minicomponents/SingleSelect";
import MultiSelect from "../minicomponents/MultiSelect";
import {API_Data} from "../minicomponents/WebAPIs";
import {BarPlot} from "../charts/BarPlot";

export function Section_BarPlot(props) {
    const theme = useContext(ThemeContext);
    const [yValues, setYValues] = useState(["ineq_le", "ineq_edu", "ineq_inc"]);
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

    function Render(yValues, yLabels, yScale, countries, regions, incomegroups) {
        // Put on loading
        setLoading(true)
        // Call Web API - get data
        let data = {group: [], year: []}
        for (let i = 0; i < yValues.length; i++) {
            data[yLabels[i]] = []
        }
        API_Data({
            level: "country",
            include_indicators: yValues,
            include_members_or_groups: countries
        }, (body) => {
            if (body.country.length > 0) {
                data.group.push(...body.country)
                data.year.push(...body.year)
                for (let i = 0; i < yValues.length; i++) {
                    data[yLabels[i]].push(...body[yValues[i]])
                }
            }
            API_Data({
                level: "region",
                include_indicators: yValues,
                include_members_or_groups: regions
            }, (body) => {
                if (body.region.length > 0) {
                    data.group.push(...body.region)
                    data.year.push(...body.year)
                    for (let i = 0; i < yValues.length; i++) {
                        data[yLabels[i]].push(...body[yValues[i]])
                    }
                }
                API_Data({
                    level: "incomegroup",
                    include_indicators: yValues,
                    include_members_or_groups: incomegroups
                }, (body) => {
                    if (body.incomegroup.length > 0) {
                        data.group.push(...body.incomegroup)
                        data.year.push(...body.year)
                        for (let i = 0; i < yValues.length; i++) {
                            data[yLabels[i]].push(...body[yValues[i]])
                        }
                    }
                    // Set Data
                    setData(data)
                })
            })
        })
        const options = {
            responsive: true,
            aspectRatio: 3/2,
            scales: {
                y: {type: yScale,
                    title: {
                        text: "Values",
                        display: true
                    }
                }
            }
        }
        setOptions(options)
    }

    useEffect(() => {
        Render(["ineq_le", "ineq_edu", "ineq_inc"],
            ["Inequality in life expectancy", "Inequality in education", "Inequality in income"],
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
                Bar Plot
            </Typography>
            <Grid container>
                <Grid item md={8} xs={12} paddingRight={{sm: 0, md:1}} paddingBottom={{xs: 1, md:0}}>
                    {loading ? <Skeleton variant="rectangular" height="100%" width="100%"/>
                        : <BarPlot raw_data={data} options={options}/>}
                </Grid>
                <Grid item md={4} xs={12} paddingLeft={{sm: 0, md:1}}>
                    <RoundedBoxedText borderColor={theme.secondary} elevation={2}>
                        <Typography variant="body1" style={{color:theme.text_dark}} component="div">
                            <p>
                                This bar plot allows the user to compare multiple variables at the same time between&nbsp;
                                many countries/groups. The only limitation is that the values of each variable need to be&nbsp;
                                on similar scales
                            </p>
                            <p>
                                The reader can choose which variable(s) to include, the scale, as well as which countries&nbsp;
                                and groups to include.
                            </p>
                        </Typography>
                    </RoundedBoxedText>
                </Grid>
            </Grid>
            <DropDownControl title="Bar Plot Control Panel">
                <Grid container spacing={3}>
                    <Grid item xs={6} paddingRight={3}>
                        <MultiSelect label="Y Variables" id="bar_plot_y_select"
                                     onChangeCallback={(value) => {setYValues(value)}}
                                     data={{labels: props.indicators.indicator, values: props.indicators.code}}
                                     values={yValues}
                        />
                    </Grid>
                    <Grid item xs={6} paddingLeft={3}>
                        <SingleSelect label="Y Scale" id="bar_plot_y_scale"
                                      onChangeCallback={(value) => {setYScale(value)}}
                                      data={{labels: props.scales.scale, values: props.scales.code}}
                                      value={yScale}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MultiSelect label="Countries" id="bar_plot_countries_select"
                                     onChangeCallback={(value) => {setCountries(value)}}
                                     data={{labels: props.countries.country, values: props.countries.iso3}}
                                     values={countries}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MultiSelect label="Regions" id="bar_plot_regions_select"
                                     onChangeCallback={(value) => {setRegions(value)}}
                                     data={{labels: props.regions.region, values: props.regions.region}}
                                     values={regions}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MultiSelect label="Income Groups" id="bar_plot_income_groups_select"
                                     onChangeCallback={(value) => {setIncomeGroups(value)}}
                                     data={{labels: props.income_groups.incomegroup, values: props.income_groups.incomegroup}}
                                     values={incomegroups}
                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent="flex-end">
                        <Button variant="contained" onClick={() => {
                            Render(yValues,
                                yValues.map((code) => props.indicators.indicator[props.indicators.code.indexOf(code)]),
                                yScale, countries, regions, incomegroups)
                        }}>Render</Button>
                    </Grid>
                </Grid>
            </DropDownControl>
        </Stack>
    )
}
