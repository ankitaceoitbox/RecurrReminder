import MultipleDatesPicker from '@ambiot/material-ui-multiple-dates-picker'
import { Button } from '@mui/material'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const DateChipsSelector = ({ onHandleSelectedDates, preSelectedDates }) => {
    const [open, setOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]); // Store selected dates

    const handleSelectDates = (dates) => {
        setSelectedDates(dates); // Update selected dates
        setOpen(false); // Close the date picker
    };

    useEffect(() => {
        const dates = selectedDates.map(date => dayjs(date).format('YYYY-MM-DD'))
        onHandleSelectedDates(dates);
    }, [selectedDates]);

    useEffect(() => {
        if (preSelectedDates.length > 0 && preSelectedDates[0].length > 0) {
            const date = preSelectedDates[0].split(",").map(date => new Date(date));
            setSelectedDates([...date]);
        }
    }, []);

    useEffect(() => {
        setSelectedDates(preSelectedDates.map(date => new Date(date)));
    }, [preSelectedDates]);

    return (
        <div>
            <Button
                onClick={() => setOpen(!open)}
                variant="outlined"
                color='warning'
                fullWidth
            >
                {
                    selectedDates.length > 0 ? selectedDates.length + " dates selected" : "Select Holidays"
                }
            </Button>
            <MultipleDatesPicker
                open={open}
                selectedDates={selectedDates}
                onCancel={() => setOpen(false)}
                onSubmit={handleSelectDates}
            />
        </div>
    )
}

export default DateChipsSelector;