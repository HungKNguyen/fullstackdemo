import React, {useContext, useEffect, useRef, useState} from "react";
import {ThemeContext} from "../contexts/theme_context";
import {get_years, three_color_scale, two_color_scale, useStableCallback} from "../minicomponents/Helpers";
import {GeoJSON, MapContainer, TileLayer} from "react-leaflet";
import {Skeleton, Slider, Stack, Typography} from "@mui/material";
import "leaflet/dist/leaflet.css"

function InfoControl({properties}) {
    const info_style = {
        padding: "6px 8px",
        font: "14px/16px Arial, Helvetica, sans-serif",
        background: "rgba(255,255,255,0.8)",
        boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        borderRadius: "5px",
        lineHeight: "80%",
    }
    const info_h4_style = {
        margin: "0 0 5px",
        color: "#777",
    }

    return(
        <div className={'leaflet-bottom leaflet-left'}>
            <div style={info_style} className="leaflet-control">
                <h4 style={info_h4_style}>{properties.country}</h4>
                <p><b>Year</b> {properties.year}</p>
                <p><b>{properties.label}</b> {properties.value}</p>
            </div>
        </div>
    )
}

export function Map({label, geodata, data, palette}) {
    const theme = useContext(ThemeContext);
    const [years, setYears] = useState([])
    const [selectedYear, setSelectedYear] = useState(0)
    const [chartData, setChartData] = useState({})
    const [maxValue, setMaxValue] = useState(1)
    const [minValue, setMinValue] = useState(0)
    const [currentProps, setCurrentProps] = useState({})
    const [loading, setLoading] = useState(true)
    const geoJsonLayer = useRef(null);

    useEffect(() => {
        if (geoJsonLayer.current) {
            geoJsonLayer.current.clearLayers().addData(chartData);
        }
    }, [chartData]);

    useEffect(() => {
        let valid_values = data.value.filter(value => Number.isFinite(value))
        setMaxValue(Math.max(...valid_values))
        setMinValue(Math.min(...valid_values))
        let all_years = get_years(data)
        setYears(all_years)
        setSelectedYear(all_years[0])
    },[data])

    useEffect(() => {
        if (selectedYear !== 0) {
            let filtered_data = filter_data(data, selectedYear)
            setChartData(merge_data(filtered_data, geodata, selectedYear))
        }
    },[data, geodata, selectedYear])

    useEffect(() => {
        if (chartData !== {}) {
            setLoading(false)
        }
    },[chartData])

    function filter_data(data, year) {
        let new_data = {
            iso3: [],
            country: [],
            value: [],
        }
        for (let i = 0; i < data.iso3.length; i++){
            if (data.year[i] === year) {
                new_data.iso3.push(data.iso3[i])
                new_data.country.push(data.group[i])
                new_data.value.push(data.value[i])
            }
        }
        return(new_data)
    }

    // function to merge geodata and filtered data
    function merge_data(data, geodata, year) {
        let chart_data = {
            type: "FeatureCollection",
            features: []
        }
        for (let i = 0; i < geodata.features.length; i++) {
            const ISO = geodata.features[i].properties.iso3
            const index = data.iso3.indexOf(ISO)
            if (index !== -1) {
                chart_data.features.push({
                    ...geodata.features[i],
                    properties: {
                        iso3: ISO,
                        country: data.country[index],
                        label: label,
                        value: data.value[index],
                        year: year
                    }
                })
            }
        }
        return(chart_data)
    }

    //function to get color based on properties
    function getColor(properties) {
        let percentage = (properties.value - minValue) / (maxValue - minValue)
        if (palette === "two") {
            return(two_color_scale(percentage).display())
        } else {
            return(three_color_scale(percentage).display())
        }
    }

    //function set area style
    function area_style(feature) {
        return {
            fillColor: getColor(feature.properties),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }
    //function for set highlight and reset
    function highlightFeature(e) {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        layer.bringToFront();
        setCurrentProps(layer.feature.properties)
    }
    const stableHighlightFeature = useStableCallback(highlightFeature);

    function resetHighlight(e) {
        const layer = e.target;
        layer.setStyle({
            weight: 2,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        });
        layer.bringToBack();
    }
    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: stableHighlightFeature,
            mouseout: resetHighlight
        });
    }

    return (
        <Stack spacing={4}>
            {loading ? <Skeleton variant="rectangular" height="100%" width="100%"/>
            : <MapContainer center={[25, 0]} zoom={2} scrollWheelZoom={false} style={{
                    height: "500px",
                    border: "3px solid",
                    borderColor: theme.primary_dark
                }}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'
                    />
                    <GeoJSON data={chartData} style={area_style} onEachFeature={onEachFeature} ref={geoJsonLayer}/>
                    <InfoControl properties={currentProps}/>
                </MapContainer>}
            <Stack direction="row" spacing={4}>
                <Typography variant="h6">Year</Typography>
                <Slider marks={years.map((e) => ({value: e, label: ""}))} step={null}
                        onChange={(event) => setSelectedYear(event.target.value)}
                        min={years[0]} max={years[years.length - 1]} value={selectedYear}
                        valueLabelDisplay="auto"/>
            </Stack>

        </Stack>
    )
}
