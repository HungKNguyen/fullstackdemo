import React from 'react';

export const theme = {
    primary: '#1565c0',
    primary_light: '#5e92f3',
    primary_dark: '#003c8f',
    secondary: '#4caf50',
    secondary_light: '#80e27e',
    secondary_dark: '#087f23',
    background: '#f5f5f5',
    background_highlight: '#e1e1e1',
    background_dark: '#1c1e21',
    text_light: '#ffffff',
    text_dark: '#000000',
    text_gray: '#616161',
    categories_scale: ["#E41A1C", "#377EB8", "#4DAF4A",
        "#984EA3", "#FF7F00", "#FFFF33",
        "#A65628", "#F781BF", "#999999"],
    two_color_scale: ["#F7FBFF", "#082d9c"],
    three_color_scale: ["#bd0b12","#F7FCF5","#186d00"],
};

export const ThemeContext = React.createContext(
    theme
);
