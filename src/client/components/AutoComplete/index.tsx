import { Autocomplete, TextField } from "@mui/material";

const AutoComplete = ({ 
    name = "autocomplete",
    options, 
    label, 
    performSearch, 
    onValueChange,
    currentValue }) => {

    function onInputChange(event: any, query: string) {

        if (query && query.length > 2) {

            performSearch(query);
        }
    }

    function onChange(event: any, value: any | null, reason: string) {

        if (value) {

            onValueChange({code: value.id, name: value.label});
            return;
        }

        onValueChange({code: '', name: ''});
    }

    function verifyValue(option: any, value: any): boolean {

        return option.id === value.id;
    }

    return (
        <Autocomplete 
            fullWidth={true}
            id={label+'-autocomplete'}
            options={options}
            renderInput={(params) => <TextField name={name} {...params} label={label} variant="filled" />}
            filterOptions={(x) => x}
            onChange={onChange}
            onInputChange={onInputChange}
            isOptionEqualToValue={verifyValue}
            defaultValue={currentValue}
        />

    )
}

export default AutoComplete;
