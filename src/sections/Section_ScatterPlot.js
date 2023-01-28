import React, {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../contexts/theme_context";
import {Button, Grid, Skeleton, Stack, Typography} from "@mui/material";
import {RoundedBoxedText} from "../minicomponents/RoundedBoxedText";
import {DropDownControl} from "../minicomponents/DropDownControl";
import {SingleSelect} from "../minicomponents/SingleSelect";
import MultiSelect from "../minicomponents/MultiSelect";
import {ScatterPlot} from "../charts/ScatterPlot";
import {API_Data} from "../minicomponents/WebAPIs";

export function Section_ScatterPlot(props) {
    const theme = useContext(ThemeContext);

    const [xValue, setXValue] = useState("gdp_pcap_ppp");
    const [yValue, setYValue] = useState("hdi");
    const [xScale, setXScale] = useState("logarithmic");
    const [yScale, setYScale] = useState("linear");
    const [countries, setCountries] = useState(["Low income", "Lower middle income", "Upper middle income", "High income"]);
    const [regions, setRegions] = useState([]);
    const [incomegroups, setIncomeGroups] = useState([]);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [options, setOptions] = useState(null);

    function Render(xValue, yValue, xLabel, yLabel, xScale, yScale,
                    countries, regions, incomegroups) {
        // Put on loading
        setLoading(true)
        // Call Web API - get data
        let data = {group: [], x: [], y: [], year: []}
        API_Data({
            level: "country",
            include_indicators: [xValue, yValue],
            include_members_or_groups: countries
        }, (body) => {
            // Convert data
            if (body.country.length > 0) {
                data.group.push(...body.country)
                data.x.push(...body[xValue])
                data.y.push(...body[yValue])
                data.year.push(...body.year)
            }
            // Next call
            API_Data({
                level: "region",
                include_indicators: [xValue, yValue],
                include_members_or_groups: regions
            }, (body) => {
                // Convert data
                if (body.region.length > 0) {
                    data.group.push(...body.region)
                    data.x.push(...body[xValue])
                    data.y.push(...body[yValue])
                    data.year.push(...body.year)
                }
                // Next call
                API_Data({
                    level: "incomegroup",
                    include_indicators: [xValue, yValue],
                    include_members_or_groups: incomegroups
                }, (body) => {
                    // Convert data
                    if (body.incomegroup.length > 0) {
                        data.group.push(...body.incomegroup)
                        data.x.push(...body[xValue])
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
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {type: xScale,
                    title: {
                        text: xLabel,
                        display: true
                    }
                },
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
        Render("gdp_pcap_ppp", "hdi",
            "GDP per capita, PPP",
            "Human Development Index",
            "logarithmic", "linear",
            ["VNM","Low income", "Lower middle income", "Upper middle income", "High income"],
            [], [])
    },[])

    useEffect(() => {
      if (data !== null && options !== null) {
          setLoading(false)
      }
    }, [data, options])

    return (
        <Stack spacing={2}>
            <Typography variant="h4" style={{color:theme.primary_dark}}>
                Scatter Plot
            </Typography>
            <Grid container>
                <Grid item md={8} xs={12} paddingRight={{sm: 0, md:1}} paddingBottom={{xs: 1, md:0}}>
                    {loading ? <Skeleton variant="rectangular" height="100%" width="100%"/>
                        : <ScatterPlot raw_data={data} options={options}/>}
                </Grid>
                <Grid item md={4} xs={12} paddingLeft={{sm: 0, md:1}}>
                    <RoundedBoxedText borderColor={theme.secondary} elevation={2}>
                        <Typography variant="body1" style={{color:theme.text_dark}} component="div">
                            <p>
                                Using World Bank data, I simulate a situation where the research team allows readers to&nbsp;
                                explore the data on the website. The first example would be a scatter plot
                            </p>
                            <p>
                                The reader can use the control panel below to set the X and Y variable, which type of&nbsp;
                                scale would they like to use, as well as which countries they want to be included on the&nbsp;
                                scatter plot.
                            </p>
                            <p>
                                In addition, the user can directly interact with the graph my choosing the year using the&nbsp;
                                slider as well as hover to the more information on any particular country.
                            </p>
                        </Typography>
                    </RoundedBoxedText>
                </Grid>
            </Grid>
            <DropDownControl title="Scatter Plot Control Panel">
                <Grid container spacing={3}>
                    <Grid item xs={6} paddingRight={3}>
                        <SingleSelect label="X Variable" id="scatter_plot_x_select"
                                      onChangeCallback={(value) => {setXValue(value)}}
                                      data={{labels: props.indicators.indicator, values: props.indicators.code}}
                                      value={xValue}
                        />
                    </Grid>
                    <Grid item xs={6} paddingLeft={3}>
                        <SingleSelect label="Y Variable" id="scatter_plot_y_select"
                                      onChangeCallback={(value) => {setYValue(value)}}
                                      data={{labels: props.indicators.indicator, values: props.indicators.code}}
                                      value={yValue}
                        />
                    </Grid>
                    <Grid item xs={6} paddingRight={3}>
                        <SingleSelect label="X Scale" id="scatter_plot_x_scale"
                                      onChangeCallback={(value) => {setXScale(value)}}
                                      data={{labels: props.scales.scale, values: props.scales.code}}
                                      value={xScale}
                        />
                    </Grid>
                    <Grid item xs={6} paddingLeft={3}>
                        <SingleSelect label="Y Scale" id="scatter_plot_y_scale"
                                      onChangeCallback={(value) => {setYScale(value)}}
                                      data={{labels: props.scales.scale, values: props.scales.code}}
                                      value={yScale}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MultiSelect label="Countries" id="scatter_plot_countries_select"
                                     onChangeCallback={(value) => {setCountries(value)}}
                                     data={{labels: props.countries.country, values: props.countries.iso3}}
                                     values={countries}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MultiSelect label="Regions" id="scatter_plot_regions_select"
                                     onChangeCallback={(value) => {setRegions(value)}}
                                     data={{labels: props.regions.region, values: props.regions.region}}
                                     values={regions}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MultiSelect label="Income Groups" id="scatter_plot_income_groups_select"
                                     onChangeCallback={(value) => {setIncomeGroups(value)}}
                                     data={{labels: props.income_groups.incomegroup, values: props.income_groups.incomegroup}}
                                     values={incomegroups}
                        />
                    </Grid>
                    <Grid item xs={12} container justifyContent="flex-end">
                            <Button variant="contained" onClick={() => {
                                Render(xValue, yValue,
                                    props.indicators.indicator[props.indicators.code.indexOf(xValue)],
                                    props.indicators.indicator[props.indicators.code.indexOf(yValue)],
                                    xScale, yScale, countries, regions, incomegroups)
                            }}>Render</Button>
                    </Grid>
                </Grid>
            </DropDownControl>
        </Stack>
    )
}
