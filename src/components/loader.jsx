import { CircularProgress } from '@mui/material';
import React from 'react';

const loaderContainer = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
};
const Loader = () => {
    return (
        <div style={loaderContainer}>
            <CircularProgress />
        </div>
    );
};

export default Loader;
