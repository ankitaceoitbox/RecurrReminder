import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function WeekdaySelector({ onHandleSelectedWeekDay, preSelectedDays }) {
    const [selectedDays, setSelectedDays] = React.useState([]);
    const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const handleDayChange = (_, value) => {
        setSelectedDays(value);
        onHandleSelectedWeekDay(value);
    };

    React.useEffect(() => {
        setSelectedDays([...preSelectedDays]);
    }, [preSelectedDays])

    return (
        <Autocomplete
            multiple
            id="checkboxes-tags-weekdays"
            options={daysOfWeek}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option}
                </li>
            )}
            value={selectedDays}
            onChange={handleDayChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select days of the Weekdays"
                    placeholder="Days"
                    size="small"
                />
            )}
            size="small"
        />
    );
}
