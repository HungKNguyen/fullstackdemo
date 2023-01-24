import Color from "colorjs.io";
import {theme} from "../contexts/theme_context";
import {useCallback, useRef} from "react";

export function get_years(raw_data) {
    let years = new Set();
    const columns = Object.keys(raw_data).filter((name) => !(name === "group" || name === "year"))
    for (let i = 0; i < raw_data.group.length; i++) {
        for (let j = 0; j < columns.length; j++) {
            if (!isNaN(raw_data[columns[j]][i])) {
                years.add(raw_data.year[i])
            }
        }
    }
    return([...years].sort((a,b) => a-b))
}

export function useStableCallback(callback) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const stableCallback = useCallback((...args) => {
        return callbackRef.current(...args);
    }, []);

    return stableCallback;
}

export let two_color_scale = new Color(theme.two_color_scale[0]).range(theme.two_color_scale[1])
let three_color_scale_lower = new Color(theme.three_color_scale[0]).range(theme.three_color_scale[1])
let three_color_scale_higher = new Color(theme.three_color_scale[1]).range(theme.three_color_scale[2])
export let three_color_scale = (percentage) => {
    if (percentage <= 0.5) {
        return three_color_scale_lower(percentage * 2)
    } else {
        return three_color_scale_higher((percentage - 0.5) * 2)
    }
}

