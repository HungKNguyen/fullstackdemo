import React, {useContext, useEffect, useState} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend, LogarithmicScale
} from 'chart.js';
import {theme, ThemeContext} from "../contexts/theme_context";
import {Grid, Skeleton, Slider, Typography} from "@mui/material";
import {Bar} from "react-chartjs-2";
import {RoundedBoxedText} from "../minicomponents/RoundedBoxedText";
import {get_years} from "../minicomponents/Helpers";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LogarithmicScale
);

function process_data(raw_data, year) {
    let data = {}
    // Get labels
    let labels = [...new Set(raw_data.group)].sort()
    // Get datasets
    let series = Object.keys(raw_data).filter((name) => (name !== "year" && name !== "group"))
    for (let i = 0; i < series.length; i++) {
        data[series[i]] = {
            label: series[i],
            data: new Array(labels.length).fill(NaN),
            backgroundColor: theme.categories_scale[i % theme.categories_scale.length]
        }
    }
    for (let i = 0; i < raw_data.group.length; i++) {
        // Ignore wrong year
        if (raw_data.year[i] !== year) {
            continue
        }
        for(let j = 0; j < series.length; j++) {
            // Populate in
            const index = labels.indexOf(raw_data.group[i])
            data[series[j]].data[index] = raw_data[series[j]][i]
        }
    }
    return({labels: labels, datasets: Object.values(data)})
}

export function BarPlot({raw_data, options}) {
    const theme = useContext(ThemeContext);
    const [years, setYears] = useState([])
    const [selectedYear, setSelectedYear] = useState(0)
    const [chartData, setChartData] = useState({})
    const [loading, setLoading] = useState(true)
    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        setYears(get_years(raw_data))
        setChartOptions(options)
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
                        : <Bar options={chartOptions} data={chartData} type={"bar"}/>}
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
