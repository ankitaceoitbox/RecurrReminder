import MultipleDatesPicker from '@ambiot/material-ui-multiple-dates-picker'
import { Button } from '@mui/material'
import { useState } from 'react'

const DateChipsSelector = () => {
    const [open, setOpen] = useState(false)
    const [selectedDates, setSelectedDates] = useState([]); // Store selected dates

    const handleSelectDates = (dates) => {
        setSelectedDates(dates); // Update selected dates
        setOpen(false); // Close the date picker
    };

    return (
        <div>
            <Button
                onClick={() => setOpen(!open)}
                variant="outlined"
                color='warning'
                fullWidth
            >
                Select Holidays
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