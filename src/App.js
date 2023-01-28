import './App.css';
import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "./contexts/theme_context";
import {Stack} from "@mui/material";
import {Section_Title} from "./sections/Section_Title";
import {Section_Intro} from "./sections/Section_Intro";
import {Section_ScatterPlot} from "./sections/Section_ScatterPlot";
import {Section_BarPlot} from "./sections/Section_BarPlot";
import {Section_Map} from "./sections/Section_Map";
import {Section_Regression} from "./sections/Section_Regression";
import {Section_LinePlot} from "./sections/Section_LinePlot";
import {Section_Footer} from "./sections/Section_Footer";
import {
  API_Countries,
  API_IncomeGroups,
  API_Indicators,
  API_Map_Data,
  API_Model,
  API_Regions
} from "./minicomponents/WebAPIs";

function App() {

  const theme = useContext(ThemeContext);
  const [countries, setCountries] = useState({country:[], iso3:[]});
  const [regions, setRegions] = useState({region:[]});
  const [income_groups, setIncomeGroups] = useState({incomegroup: []});
  const [indicators, setIndicators] = useState({indicator:[], code:[]});
  const [models, setModels] = useState({model:[], code:[]});
  const scales = {scale:["Linear", "Logarithmic"], code:["linear", "logarithmic"]}
  const colorPalette = {palette:["Two-color", "Three-color"], code:["two", "three"]}
  const [mapData, setMapData] = useState({})

  useEffect(() => {
    let new_countries = {country:[], iso3:[]}
    API_Regions((body) => {
      setRegions(body);
      new_countries.country.push(...body.region.map((e) => (e + " countries")))
      new_countries.iso3.push(...body.region)
      API_IncomeGroups((body) => {
        setIncomeGroups(body)
        new_countries.country.push(...body.incomegroup.map((e) => (e + " countries")))
        new_countries.iso3.push(...body.incomegroup)
        API_Countries((body) => {
          new_countries.country.push(...body.country)
          new_countries.iso3.push(...body.iso3)
          setCountries(new_countries);
        })
      })
    })

    API_Indicators((body) => {
      setIndicators(body)
    })

    API_Model((body) => {
      setModels(body)
    })

    API_Map_Data((body) => {
      setMapData(body)
    })
  },[])

  return (
    <Stack spacing={6} style={{color: theme.text_dark, background: theme.background}}>
      <Section_Title/>
      <Stack spacing={6} px={{xs:3, sm:6, md:10, lg: 16}}>
        <Stack spacing={6}>
          <Section_Intro/>
          <Section_ScatterPlot indicators={indicators} countries={countries} scales={scales}
                               income_groups={income_groups} regions={regions}/>
          <Section_LinePlot indicators={indicators} countries={countries} scales={scales}
                            income_groups={income_groups} regions={regions}/>
          <Section_BarPlot indicators={indicators} countries={countries} scales={scales}
                           income_groups={income_groups} regions={regions}/>
          <Section_Map indicators={indicators} mapData={mapData} palette={colorPalette}/>
          <Section_Regression models={models} indicators={indicators}/>
        </Stack>
      </Stack>
      <Section_Footer/>
    </Stack>
  );
}

export default App;
