import React, {useContext, useEffect, useState} from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {theme, ThemeContext} from "../contexts/theme_context";
import {get_years} from "../minicomponents/Helpers";
import {RoundedBoxedText} from "../minicomponents/RoundedBoxedText";
import {Grid, Skeleton, Slider, Typography} from "@mui/material";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function process_data(raw_data, yearRange) {
    let color_index = 0
    let data = {}
    // Get labels
    let labels = Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, i) => yearRange[0] + i
    )
    // Get datasets
    for (let i = 0; i < raw_data.group.length; i++) {
        // Ignore wrong year
        if (raw_data.year[i] < yearRange[0] || raw_data.year[i] > yearRange[1]) {
            continue
        }
        // Create new label
        if (!data.hasOwnProperty(raw_data.group[i])) {
            data[raw_data.group[i]] = {
                label: raw_data.group[i],
                data: new Array(labels.length).fill(NaN),
                backgroundColor: theme.categories_scale[color_index]
            }
            color_index = (color_index + 1) % theme.categories_scale.length
        }
        // Populate in
        const index = labels.indexOf(raw_data.year[i])
        data[raw_data.group[i]].data[index] = raw_data.y[i]
    }
    return({labels: labels, datasets: Object.values(data)})
}

export function LinePlot({raw_data, options}) {
    const theme = useContext(ThemeContext);
    const [years, setYears] = useState([])
    const [selectedYears, setSelectedYears] = useState([])
    const [chartData, setChartData] = useState({})
    const [loading, setLoading] = useState(true)
    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        setYears(get_years(raw_data))
        setChartOptions(options)
    },[raw_data, options])
    useEffect(() => {
        if (years.length > 0) {
            setSelectedYears([years[0], years[years.length - 1]])
        }
    },[years])
    useEffect(() => {
        setChartData(process_data(raw_data, selectedYears))
    },[raw_data, selectedYears])
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
                        : <Line options={chartOptions} data={chartData} type="line"/>}
                </Grid>
                <Grid item container xs={12}>
                    <Grid item xs={2}>
                        <Typography variant="body1">Year Range</Typography>
                    </Grid>
                    <Grid item xs={10}>
                        <Slider marks={years.map((e) => ({value: e, label: ""}))} step={null}
                                onChange={(event) => setSelectedYears(event.target.value)}
                                min={years[0]} max={years[years.length - 1]} value={selectedYears}
                                valueLabelDisplay="auto"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </RoundedBoxedText>
    );
}
