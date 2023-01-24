import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export function SingleSelect({onChangeCallback, label, data, id, value}) {

    function handleChange(event) {
        onChangeCallback(event.target.value)
    }

    return (
        <FormControl fullWidth>
            <InputLabel id={id+"-label"}>{label}</InputLabel>
            <Select
                labelId={id+"-label"}
                id={id}
                value={value}
                label="Age"
                onChange={handleChange}
            >
                {data.labels.map((e, i) => <MenuItem value={data.values[i]} key={id+"-"+i}>{e}</MenuItem>)}
            </Select>
        </FormControl>
    )
}
