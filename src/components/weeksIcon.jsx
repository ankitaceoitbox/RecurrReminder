import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const CircularCheckbox = ({ label }) => {
    const [checked, setChecked] = useState(false);

    const handleCheckboxChange = () => {
        setChecked(!checked);
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
            onClick={handleCheckboxChange}
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

const WeeksIcon = () => {
    return (
        <>
            <div>
                <Typography sx={{ display: "flex", justifyContent: "center", paddingBottom: "10px", fontFamily: "roboto" }} variant='h6'>Repeats On</Typography>
                <Grid container sx={{ display: "flex", justifyContent: "center" }}>
                    {daysOfWeek.map((day, index) => (
                        <Grid item key={index} sm={1.5}>
                            <CircularCheckbox label={day} />
                        </Grid>
                    ))}
                </Grid>
            </div>
        </>
    );
};

export default WeeksIcon;
