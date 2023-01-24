import React, {useContext, useEffect, useState} from "react";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend, LogarithmicScale
} from "chart.js";
import {Scatter} from "react-chartjs-2";
import {Grid, Skeleton, Slider, Typography} from "@mui/material";
import {RoundedBoxedText} from "../minicomponents/RoundedBoxedText";
import {ThemeContext} from "../contexts/theme_context";
import {theme} from "../contexts/theme_context";
import {get_years} from "../minicomponents/Helpers";

ChartJS.register(LinearScale, LogarithmicScale, PointElement, LineElement, Tooltip, Legend);

function process_data(raw_data, year) {
    let color_index = 0
    let datasets = {}
    for (let i = 0; i < raw_data.group.length; i++) {
        // Ignore wrong year
        if (raw_data.year[i] !== year) {
            continue
        }
        // Create new label
        if (!datasets.hasOwnProperty(raw_data.group[i])) {
            datasets[raw_data.group[i]] = {
                label: raw_data.group[i],
                data: [],
                backgroundColor: theme.categories_scale[color_index]
            }
            color_index = (color_index + 1) % theme.categories_scale.length
        }
        // Populate in
        datasets[raw_data.group[i]].data.push({x: raw_data.x[i], y: raw_data.y[i]})
    }
    return({datasets: Object.values(datasets)})
}

export function ScatterPlot({raw_data, options}) {
    const theme = useContext(ThemeContext);
    const [years, setYears] = useState([])
    const [selectedYear, setSelectedYear] = useState(0)
    const [chartData, setChartData] = useState({})
    const [loading, setLoading] = useState(true)
    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        setYears(get_years(raw_data))
        setChartOptions({...options, scales: {
                x: {
                    ...(options.scales.x),
                    suggestedMin: Math.min(...raw_data.x),
                    suggestedMax: Math.max(...raw_data.x)
                },
                y: {
                    ...(options.scales.y),
                    suggestedMin: Math.min(...raw_data.y),
                    suggestedMax: Math.max(...raw_data.y)
                }
            }})
    },[raw_data, options])

    useEffect(() => {
        if (years.length > 0) {
            setSelectedYear(years[0])
        }
    },[years])
    useEffect(() => {
        setChartData(process_data(raw_data, selectedYear))
    },[raw_data, selectedYear])
    useEffect(() => {
        if (chartData !== {}) {
            setLoading(false)
        }
    },[chartData])

    return (
        <RoundedBoxedText borderColor={theme.background_highlight} backgroundColor={theme.text_light}>
            <Grid container>
                <Grid item xs={12}>
                    {loading ? <Skeleton variant="rectangular" height="100%" width="100%"/>
                        : <Scatter options={chartOptions} data={chartData} type="scatter"/>}
                </Grid>
                <Grid item container xs={12}>
                    <Grid item xs={2}>
                        <Typography variant="h6">Year</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Slider marks={years.map((e) => ({value: e, label: ""}))} step={null}
                                onChange={(event) => setSelectedYear(event.target.value)}
                                min={years[0]} max={years[years.length - 1]} value={selectedYear}
                                valueLabelDisplay="auto"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </RoundedBoxedText>
    );
}
