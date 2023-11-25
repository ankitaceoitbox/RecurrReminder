import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const CircularCheckbox = ({ label, onCheckboxChange, weekname, selectedDays }) => {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(selectedDays.includes(weekname));
    });

    const handleCheckboxChange = () => {
        setChecked(!checked);
        onCheckboxChange(weekname, !checked); // Notify the parent about the change
    };

    const checkboxStyle = {
        width: '25px',
        height: '25px',
        borderRadius: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    };

    const checkedStyle = {
        backgroundColor: '#000',
        color: '#fff',
    };
    const unCheckedStyle = {
        backgroundColor: '#eee',
        color: '#000'
    };

    return (
        <div
            style={{ ...checkboxStyle, ...(checked ? checkedStyle : unCheckedStyle) }}
        >
            <Checkbox
                checked={checked}
                onChange={handleCheckboxChange}
                icon={<div style={{ display: 'inline-block', fontFamily: "roboto" }}>{label}</div>}
                checkedIcon={<div style={{ display: 'inline-block' }}>{label}</div>}
            />
        </div>
    );
};

const WeeksIcon = ({ initiallySelectedWeeks, onSelectedWeeksChange }) => {
    const [selectedDays, setSelectedDays] = useState([]);
    const handleCheckboxChange = (day, isChecked) => {
        if (isChecked) {
            setSelectedDays(prevSelectedDays => { return [...prevSelectedDays, day] });
        } else {
            setSelectedDays(prevSelectedDays => prevSelectedDays.filter(selectedDay => selectedDay !== day));
        }
    };

    useEffect(() => {
        // Set the initially selected weeks when the component mounts
        if (initiallySelectedWeeks && initiallySelectedWeeks.length > 0) {
            setSelectedDays([...initiallySelectedWeeks]);
            onSelectedWeeksChange(initiallySelectedWeeks);
        }
    }, []);

    useEffect(() => {
        onSelectedWeeksChange(selectedDays);
    }, [selectedDays])

    return (
        <>
            <div>
                <Typography sx={{ display: "flex", justifyContent: "center", paddingBottom: "10px", fontFamily: "roboto" }} variant='h6'>Repeats On</Typography>
                <Grid container sx={{ display: "flex", justifyContent: "center" }}>
                    {daysOfWeek.map((day, index) => (
                        <Grid item key={index} sm={1.5}>
                            <CircularCheckbox
                                weekname={weeks[index]}
                                label={day}
                                onCheckboxChange={handleCheckboxChange}
                                selectedDays={selectedDays ?? []}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
        </>
    );
};

export default WeeksIcon;
