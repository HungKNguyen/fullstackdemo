import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(value, selectedValues, theme) {
    return {
        fontWeight:
            selectedValues.indexOf(value) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export default function MultiSelect({onChangeCallback, label, data, id, values}) {
    const theme = useTheme();

    const handleChange = (event) => {
        onChangeCallback(event.target.value)
    };

    return (
        <FormControl fullWidth>
            <InputLabel id={id+"-label"}>{label}</InputLabel>
            <Select
                labelId={id+"-label"}
                id={id}
                multiple
                value={values}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => {
                            const index = data.values.indexOf(value);
                            return (
                                <Chip key={value} label={data.labels[index]} />
                            )})}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {data.labels.map((e, i) => (
                        <MenuItem
                            key={data.values[i]}
                            value={data.values[i]}
                            style={getStyles(data.values[i], values, theme)}
                        >
                            {e}
                        </MenuItem>
                    ))}
            </Select>
        </FormControl>
    )
}
