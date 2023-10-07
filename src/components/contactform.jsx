import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Paper, Switch, FormControlLabel, InputLabel, FormControl, Select, MenuItem, FormHelperText, Input, Checkbox } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { loginSubject } from './login';
import setTimeToAMPM from '../utility/converttimetodate';
import { areEmailsValid } from '../utility/validations';
import './allformdata.css';
function ContactForm({ onHandleContactFormSubmit, width, autoFillData, marginTop }) {
    const [isWAChecked, setIsWAChecked] = useState(() => {
        if (autoFillData) {
            return autoFillData.isWAChecked;
        }
        return false;
    });
    const [isEmailChecked, setIsEmailChecked] = useState(() => {
        if (autoFillData) {
            return autoFillData.isEmailChecked;
        }
        return false;
    });
    const [submitClicked, setSubmitClicked] = useState(false);

    const [formData, setFormData] = useState(() => {
        if (autoFillData) {
            return autoFillData;
        } else {
            return {
                isWAChecked: false,
                whatsappFields: {
                    sendWADate: null,
                    mobileOrGroupID: '',
                    waMessage: '',
                    attachment: [],
                },
                isEmailChecked: false,
                emailFields: {
                    emailIDTo: '',
                    emailIDCc: [],
                    emailIDBCc: [],
                    subjectLine: '',
                    attachment: [],
                    mailBodyHTML: '',
                },
                commonFields: {
                    startDate: null,
                    day: '',
                    every: '',
                    frequency: '',
                    sendTime: null,
                    name: '',
                    company: '',
                    endsOnDate: null,
                    skipHolidays: false,
                },
            };
        }
    });
    const [emailError, setEmailError] = useState(false);
    const [bccEmailError, setBccEmailError] = useState(false);
    const [ccEmailError, setCcEmailError] = useState(false);
    const [startDateError, setStartDateError] = useState(false);
    const [endsOnDateError, setEndsOnDateError] = useState(false);
    const [wtsappAttachmentError, setWtsappAttachmentError] = useState(false);
    const [emailAttachmentError, setEmailAttachmentError] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleStartDateChange = (date) => {
        if (date && dayjs(date).isBefore(dayjs(), 'day')) {
            setStartDateError(true);
            setFormData((prevData) => ({
                ...prevData,
                commonFields: {
                    ...prevData.commonFields,
                    day: '',
                },
            }));
            return;
        } else {
            setStartDateError(false);
        }
        if (date) {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const day = dayjs(date).format('dddd');
            // Update formData with formatted startDate and dayOfWeek
            setFormData((prevData) => ({
                ...prevData,
                commonFields: {
                    ...prevData.commonFields,
                    startDate: formattedDate,
                    day: day,
                },
            }));
        } else {
            // Update formData with null values for startDate and dayOfWeek
            setFormData((prevData) => ({
                ...prevData,
                commonFields: {
                    ...prevData.commonFields,
                    startDate: null,
                    day: '',
                },
            }));
        }
    };

    const handleSendEveryChange = (event) => {
        const every = event.target.value;
        setFormData((prevData) => ({
            ...prevData,
            commonFields: {
                ...prevData.commonFields,
                every,
            },
        }));
    };

    const handleFrequency = (event) => {
        const frequency = event.target.value;
        if (frequency === '+' || frequency === '-') {
            return;
        }
        if (frequency === '-' || frequency === '+') {
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            commonFields: {
                ...prevData.commonFields,
                frequency,
            },
        }));
    }

    const handleSendTimeChange = (time) => {
        if (time && time.$d instanceof Date) {
            const date = time.$d;
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const period = hours >= 12 ? 'PM' : 'AM';
            const adjustedHours = hours % 12 === 0 ? 12 : hours % 12;
            const formattedHours = adjustedHours.toString().padStart(2, '0');
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedTime = `${formattedHours}:${formattedMinutes} ${period}`;
            setFormData((prevData) => ({
                ...prevData,
                commonFields: {
                    ...prevData.commonFields,
                    sendTime: formattedTime,
                },
            }));
        }
    };

    const handleNameChange = (e) => {
        setFormData({
            ...formData,
            commonFields: {
                ...formData.commonFields,
                name: e.target.value,
            },
        });
    };

    const handleSkipHolidays = (e) => {
        setFormData({
            ...formData,
            commonFields: {
                ...formData.commonFields,
                skipHolidays: e.target.checked,
            },
        });
    }

    const handleCompanyChange = (e) => {
        setFormData({
            ...formData,
            commonFields: {
                ...formData.commonFields,
                company: e.target.value,
            },
        });
    };

    const handleMobileOrGroupIDChange = (e) => {
        setFormData({
            ...formData,
            whatsappFields: {
                ...formData.whatsappFields,
                mobileOrGroupID: e.target.value,
            },
        });
    };

    const handleWAActivationChange = () => {
        setIsWAChecked(!isWAChecked);
        // Update formData with the new value
        setFormData((prevData) => ({
            ...prevData,
            isWAChecked: !isWAChecked,
        }));
    };

    const handleEmailActivationChange = () => {
        setIsEmailChecked(!isEmailChecked);
        // Update formData with the new value
        setFormData((prevData) => ({
            ...prevData,
            isEmailChecked: !isEmailChecked,
        }));
    };

    const handleWAMessageChange = (e) => {
        setFormData({
            ...formData,
            whatsappFields: {
                ...formData.whatsappFields,
                waMessage: e.target.value,
            },
        });
    };

    const handleWAattachmentChange = async (e) => {
        let attachment = e.target.value || "";
        if (attachment) {
            attachment = attachment.split(',');
        }
        for (let i = 0; i < attachment.length; i++) {
            const url = attachment[i];
            if (url.indexOf('https://drive.google.com') == -1) {
                setWtsappAttachmentError(true);
                return;
            }
        }
        setWtsappAttachmentError(false);
        setFormData({
            ...formData,
            whatsappFields: {
                ...formData.whatsappFields,
                attachment: attachment,
            },
        });
    };

    const handleEmailIDToChange = (e) => {
        const validOrNot = areEmailsValid(e.target.value);
        if (!validOrNot) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
        setFormData({
            ...formData,
            emailFields: {
                ...formData.emailFields,
                emailIDTo: e.target.value,
            },
        });
    };

    const handleEmailIDCcChange = (e) => {
        let cc = [];
        if (e.target.value !== '') {
            cc = [...e.target.value.split(",")];
        }
        const validOrNot = areEmailsValid(e.target.value);
        if (!validOrNot) {
            setCcEmailError(true);
        } else {
            setCcEmailError(false);
        }
        setFormData({
            ...formData,
            emailFields: {
                ...formData.emailFields,
                emailIDCc: cc,
            },
        });
    };

    const handleEmailIDBCcChange = (e) => {
        let bcc = [];
        console.log(e.target.value)
        if (e.target.value !== '') {
            bcc = [...e.target.value.split(",")];
        }
        const validOrNot = areEmailsValid(e.target.value);
        if (!validOrNot) {
            setBccEmailError(true);
        } else {
            setBccEmailError(false);
        }
        setFormData({
            ...formData,
            emailFields: {
                ...formData.emailFields,
                emailIDBCc: bcc,
            },
        });
    };

    const handleSubjectLineChange = (e) => {
        setFormData({
            ...formData,
            emailFields: {
                ...formData.emailFields,
                subjectLine: e.target.value,
            },
        });
    };

    const handleEmailAttachmentChange = async (e) => {
        let attachment = e.target.value || "";
        console.log(attachment);
        if (attachment) {
            attachment = attachment.split(',');
        }
        for (let i = 0; i < attachment.length; i++) {
            const url = attachment[i];
            if (url.indexOf("https://drive.google.com") == -1) {
                setEmailAttachmentError(true);
                return;
            }
        }
        setEmailAttachmentError(false);
        setFormData({
            ...formData,
            emailFields: {
                ...formData.emailFields,
                attachment: attachment,
            },
        });
    };

    const handleMailBodyHTMLChange = (e) => {
        setFormData({
            ...formData,
            emailFields: {
                ...formData.emailFields,
                mailBodyHTML: e.target.value,
            },
        });
    };

    const handleEndsOnDateChange = (date) => {
        if (date && dayjs(date).isBefore(dayjs(), 'day')) {
            setEndsOnDateError(true);
            return;
        } else {
            setEndsOnDateError(false);
        }
        if (date) {
            // Format the date to a string in a desired format (e.g., 'YYYY-MM-DD')
            const formattedDate = dayjs(date).format('YYYY-MM-DD');

            // Update formData with the formatted date
            setFormData((prevData) => ({
                ...prevData,
                commonFields: {
                    ...prevData.commonFields,
                    endsOnDate: formattedDate,
                },
            }));
        } else {
            // Update formData with null value for endsOnDate
            setFormData((prevData) => ({
                ...prevData,
                commonFields: {
                    ...prevData.commonFields,
                    endsOnDate: null,
                },
            }));
        }
    };

    const handleFormSubmit = async () => {
        setSubmitClicked(true);
        const res = await onHandleContactFormSubmit(formData);
        if (res) {
            setSubmitClicked(false);
            resetForm();
        }
    }

    function handleFileUpload(files) {
        return new Promise((resolve, reject) => {
            const fileDetailsArray = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const filename = file.name;
                const contentType = file.type;
                const reader = new FileReader();
                reader.onload = function (e) {
                    const content = e.target.result; // Content as a Buffer (or ArrayBuffer)
                    const fileDetails = {
                        filename: filename,
                        contentType: contentType,
                        content
                    };
                    fileDetailsArray.push(fileDetails);
                    if (fileDetailsArray.length === files.length) {
                        resolve(fileDetailsArray);
                    }
                };
                reader.onerror = function (error) {
                    reject(error);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const resetForm = () => {
        const formData = {
            isWAChecked: false,
            whatsappFields: {
                sendWADate: null,
                mobileOrGroupID: '',
                waMessage: '',
                attachment: [],
            },
            isEmailChecked: false,
            emailFields: {
                emailIDTo: '',
                emailIDCc: [],
                emailIDBCc: [],
                subjectLine: '',
                attachment: [],
                mailBodyHTML: '',
            },
            commonFields: {
                startDate: null,
                day: '',
                every: '',
                frequency: '',
                sendTime: null,
                name: '',
                company: '',
                endsOnDate: null,
                skipHolidays: false,
            }
        }
        setFormData(formData);
        setIsWAChecked(false);
        setIsEmailChecked(false);
        setEndsOnDateError(false);
        setStartDateError(false);
    }

    useEffect(() => {
        loginSubject.next({
            isAuth: true
        });
    }, []);

    return (
        <div className='container'>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: marginTop ? marginTop : "80px",
                    width: '100%', // Set width to 100%
                }}
                className="contact-form-container"
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: '1rem',
                        width: { xs: '90%', sm: width != undefined ? width : '45%' },
                    }}
                    style={{
                        background: "transparent",
                        border: "1px solid rgb(180 180 180)",
                        boxShadow: "rgb(180 180 180) 1px 1px 14px 1px"
                    }}
                >
                    <Box component="form" noValidate>
                        <h4 style={{ textAlign: "center", marginTop: 0, color: "rgb(180 180 180)" }}>Recurring Reminder</h4>
                    </Box>
                    <Box component="form" noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Start Date"
                                        sx={{
                                            width: "100%",
                                            "& .MuiInputLabel-root": {
                                                color: "rgb(180 180 180)", // Color of the label
                                            },
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: "rgb(180 180 180)", // Border color of the input
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "rgb(180 180 180)", // Border color of the input on hover
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "rgb(180 180 180)", // Border color of the input when focused
                                                },
                                                "& input": {
                                                    color: "#fff", // Color of the input text
                                                },
                                                "& .MuiIconButton-root": {
                                                    color: "rgb(180 180 180)", // Color of the icon
                                                },
                                            },
                                            "& .MuiMenu-paper": {
                                                backgroundColor: "#f2f2f2", // Background color of the dropdown menu
                                                border: "1px solid #ccc", // Border color for the dropdown menu
                                                borderRadius: "4px", // Border radius for the dropdown menu
                                            },
                                        }}
                                        onChange={handleStartDateChange}
                                        slotProps={{
                                            textField: {
                                                size: 'small', helperText: startDateError && 'Invalid Date entered',
                                            }
                                        }}
                                        defaultValue={formData.commonFields.startDate && dayjs(formData.commonFields.startDate)}
                                        value={formData.commonFields.startDate}
                                        minDate={dayjs(new Date())}
                                        reduceAnimations
                                        error={startDateError}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Day"
                                    value={formData.commonFields.day}
                                    disabled
                                    size="small"
                                    sx={{
                                        '& .MuiInputLabel-root': {
                                            color: 'rgb(180 180 180) !important', // Override color for disabled state
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'rgb(180 180 180) !important', // Override border color for disabled state
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgb(180 180 180) !important', // Override border color for hover on disabled state
                                            },
                                        },
                                        '&.Mui-disabled': {
                                            '& .MuiInputLabel-root': {
                                                color: 'rgb(180 180 180) !important', // Override color for disabled state
                                            },
                                        },
                                        backgroundColor: "#667666"
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small"
                                >
                                    <InputLabel htmlFor="send-every-select"
                                        sx={{
                                            color: 'rgb(180 180 180)',
                                            '&.Mui-focused': {
                                                color: 'rgb(180 180 180)', // Change label color on focus
                                            },
                                        }}>Send Every</InputLabel>
                                    <Select
                                        id="send-every-select"
                                        value={formData.commonFields.every}
                                        label="Send Every"
                                        onChange={handleSendEveryChange}
                                        sx={{
                                            color: "ghostwhite",
                                            '& .MuiSelect-icon': {
                                                color: 'rgb(180 180 180)',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'rgb(180 180 180)',
                                                },
                                            },
                                            '& .MuiMenuItem-root': {
                                                color: '#000000',
                                            },
                                            '& .MuiListItem-root.Mui-selected': {
                                                backgroundColor: 'rgb(180 180 180)',
                                                color: '#ffffff',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgb(180 180 180)',
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgb(180 180 180)',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgb(180 180 180)',
                                            },
                                        }}
                                    >
                                        <MenuItem value="day">Day</MenuItem>
                                        <MenuItem value="week">Week</MenuItem>
                                        <MenuItem value="month">Month</MenuItem>
                                        <MenuItem value="year">Year</MenuItem>
                                    </Select>
                                    <FormHelperText></FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Frequency"
                                    size="small"
                                    type='number'
                                    onChange={handleFrequency}
                                    min={1}
                                    value={formData.commonFields.frequency}
                                    sx={{
                                        "& .MuiInputLabel-root": { color: 'rgb(180 180 180)rgb(180 180 180)' },
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "rgb(180 180 180)",
                                            },
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "& input": {
                                                color: 'ghostwhite',
                                            },
                                        },
                                        "& label.MuiInputLabel-root": {
                                            color: 'rgb(180 180 180)', // Specify label color
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        sx={{
                                            width: '100%',
                                            '& .MuiSvgIcon-root': {
                                                color: 'rgb(180 180 180)', // Icon color
                                            },
                                            '& .MuiInputLabel-root': {
                                                color: 'rgb(180 180 180)', // Label color
                                            },
                                            '& .MuiInputLabel-filled': {
                                                color: 'rgb(180 180 180)', // Change label color when filled
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'rgb(180 180 180)', // Border color
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'rgb(180 180 180)', // Border color on hover
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'rgb(180 180 180)',
                                                },
                                                '& .MuiInputBase-input': {
                                                    color: 'ghostwhite', // Change the selected time color
                                                },
                                            },
                                        }}
                                        label="Send Time"
                                        defaultValue={setTimeToAMPM(formData.commonFields.sendTime)}
                                        value={formData.commonFields.sendTime}
                                        onChange={(event) => {
                                            handleSendTimeChange(event);
                                        }}
                                        slotProps={{ textField: { size: 'small' } }}
                                        textField={(params) => <TextField {...params} variant="outlined" />}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    variant="outlined"
                                    label="Name"
                                    value={formData.commonFields.name}
                                    onChange={handleNameChange}
                                    size="small"
                                    sx={{
                                        "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "rgb(180 180 180)",
                                            },
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "& input": {
                                                color: 'ghostwhite',
                                            },
                                        },
                                        "& label.MuiInputLabel-root": {
                                            color: 'rgb(180 180 180)', // Specify label color
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    variant="outlined"
                                    label="Company"
                                    value={formData.commonFields.company}
                                    onChange={handleCompanyChange}
                                    size="small"
                                    sx={{
                                        "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "rgb(180 180 180)",
                                            },
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "& input": {
                                                color: 'ghostwhite',
                                            },
                                        },
                                        "& label.MuiInputLabel-root": {
                                            color: 'rgb(180 180 180)', // Specify label color
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Ends On"
                                        sx={{
                                            width: "100%",
                                            "& .MuiInputLabel-root": {
                                                color: "rgb(180 180 180)", // Color of the label
                                            },
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: "rgb(180 180 180)", // Border color of the input
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "rgb(180 180 180)", // Border color of the input on hover
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "rgb(180 180 180)", // Border color of the input when focused
                                                },
                                                "& input": {
                                                    color: "#fff", // Color of the input text
                                                },
                                                "& .MuiIconButton-root": {
                                                    color: "rgb(180 180 180)", // Color of the icon
                                                },
                                            },
                                            "& .MuiMenu-paper": {
                                                backgroundColor: "#f2f2f2", // Background color of the dropdown menu
                                                border: "1px solid #ccc", // Border color for the dropdown menu
                                                borderRadius: "4px", // Border radius for the dropdown menu
                                            },
                                        }}
                                        onChange={handleEndsOnDateChange}
                                        slotProps={{
                                            textField: {
                                                size: 'small', helperText: endsOnDateError && 'Invalid Date entered',
                                            }
                                        }}
                                        defaultValue={formData.commonFields.endsOnDate && dayjs(formData.commonFields.endsOnDate)}
                                        minDate={dayjs(new Date())}
                                        reduceAnimations
                                        value={formData.commonFields.endsOnDate}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.commonFields.skipHolidays ?? false}
                                            onChange={handleSkipHolidays}
                                            sx={{
                                                color: "rgb(180 180 180)",
                                                '&.Mui-checked .MuiIconButton-root': {
                                                    color: 'rgb(180 180 180)',
                                                },
                                            }}
                                        />
                                    }
                                    style={{ color: "rgb(180 180 180)" }}
                                    label="Skip Holidays"
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControlLabel
                                    control={<Switch checked={isWAChecked}
                                        onChange={handleWAActivationChange}
                                        sx={{
                                            '& .Mui-checked': {
                                                color: "rgb(180 180 180)",
                                            },
                                        }}
                                    />}
                                    style={{ color: "rgb(180 180 180)" }}
                                    label="Activate WA"
                                />
                            </Grid>
                            {isWAChecked && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label="Mobile/Group ID"
                                            value={formData.whatsappFields.mobileOrGroupID}
                                            onChange={handleMobileOrGroupIDChange}
                                            size="small"
                                            sx={{
                                                "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                                "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "rgb(180 180 180)",
                                                    },
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "& input": {
                                                        color: 'ghostwhite',
                                                    },
                                                },
                                                "& label.MuiInputLabel-root": {
                                                    color: 'rgb(180 180 180)', // Specify label color
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label="WA Message"
                                            value={formData.whatsappFields.waMessage}
                                            onChange={handleWAMessageChange}
                                            size="small"
                                            sx={{
                                                "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                                "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "rgb(180 180 180)",
                                                    },
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "& input": {
                                                        color: 'ghostwhite',
                                                    },
                                                },
                                                "& label.MuiInputLabel-root": {
                                                    color: 'rgb(180 180 180)', // Specify label color
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label="WA Attachments URL"
                                            onChange={handleWAattachmentChange}
                                            size="small"
                                            error={wtsappAttachmentError}
                                            helperText={wtsappAttachmentError ? "Only google drive url are valid." : ''}
                                            sx={{
                                                "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                                "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "rgb(180 180 180)",
                                                    },
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "& input": {
                                                        color: 'ghostwhite',
                                                    },
                                                },
                                                "& label.MuiInputLabel-root": {
                                                    color: 'rgb(180 180 180)', // Specify label color
                                                },
                                            }}
                                        />
                                        <small style={{ color: "ghostwhite" }}><i>Use drive links only.</i></small>
                                    </Grid>
                                </>
                            )}
                            <Grid item xs={12} sm={12}>
                                <FormControlLabel
                                    control={<Switch checked={isEmailChecked} onChange={handleEmailActivationChange}
                                        sx={{
                                            '& .Mui-checked': {
                                                color: "rgb(180 180 180)", // 
                                            },
                                        }}
                                    />}
                                    style={{ color: "rgb(180 180 180)" }}
                                    label="Activate Email"
                                />
                            </Grid>
                            {isEmailChecked && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label="Email ID: To"
                                            value={formData.emailFields.emailIDTo}
                                            onChange={handleEmailIDToChange}
                                            size="small"
                                            error={emailError}
                                            helperText={emailError ? "Invalid Email Id." : ''}
                                            sx={{
                                                "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                                "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "rgb(180 180 180)",
                                                    },
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "& input": {
                                                        color: 'ghostwhite',
                                                    },
                                                },
                                                "& label.MuiInputLabel-root": {
                                                    color: 'rgb(180 180 180)', // Specify label color
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label="Email ID: Cc"
                                            value={formData.emailFields.emailIDCc}
                                            onChange={handleEmailIDCcChange}
                                            size="small"
                                            error={ccEmailError}
                                            helperText={ccEmailError ? "Invalid Cc." : ''}
                                            sx={{
                                                "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                                "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "rgb(180 180 180)",
                                                    },
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "& input": {
                                                        color: 'ghostwhite',
                                                    },
                                                },
                                                "& label.MuiInputLabel-root": {
                                                    color: 'rgb(180 180 180)', // Specify label color
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label="Email ID: BCc"
                                            value={formData.emailFields.emailIDBCc}
                                            onChange={handleEmailIDBCcChange}
                                            size="small"
                                            error={bccEmailError}
                                            helperText={bccEmailError ? "Invalid Bcc." : ''}
                                            sx={{
                                                "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                                "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "rgb(180 180 180)",
                                                    },
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "& input": {
                                                        color: 'ghostwhite',
                                                    },
                                                },
                                                "& label.MuiInputLabel-root": {
                                                    color: 'rgb(180 180 180)', // Specify label color
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label="Subject line"
                                            value={formData.emailFields.subjectLine}
                                            onChange={handleSubjectLineChange}
                                            size="small"
                                            sx={{
                                                "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                                "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "rgb(180 180 180)",
                                                    },
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "& input": {
                                                        color: 'ghostwhite',
                                                    },
                                                },
                                                "& label.MuiInputLabel-root": {
                                                    color: 'rgb(180 180 180)', // Specify label color
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label="Email Attachments URL"
                                            onChange={handleEmailAttachmentChange}
                                            size="small"
                                            error={emailAttachmentError}
                                            helperText={emailAttachmentError ? "Only google drive url are valid." : ''}
                                            sx={{
                                                "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                                "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "rgb(180 180 180)",
                                                    },
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "& input": {
                                                        color: 'ghostwhite',
                                                    },
                                                },
                                                "& label.MuiInputLabel-root": {
                                                    color: 'rgb(180 180 180)', // Specify label color
                                                },
                                            }}
                                        />
                                        <small style={{ color: "ghostwhite" }}><i>Use drive links only.</i></small>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label="Mail body(HTML)"
                                            value={formData.emailFields.mailBodyHTML}
                                            onChange={handleMailBodyHTMLChange}
                                            size="small"
                                            sx={{
                                                "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                                "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "rgb(180 180 180)",
                                                    },
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "& input": {
                                                        color: 'ghostwhite',
                                                    },
                                                },
                                                "& label.MuiInputLabel-root": {
                                                    color: 'rgb(180 180 180)', // Specify label color
                                                },
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}
                            {
                                <Grid item xs={12} sm={12}>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        {
                                            submitClicked ?
                                                <CircularProgress color="primary" size={50} thickness={4} />
                                                :
                                                <Button
                                                    variant='contained'
                                                    onClick={handleFormSubmit}
                                                    disabled={emailError || bccEmailError || ccEmailError || startDateError || endsOnDateError || wtsappAttachmentError || emailAttachmentError}
                                                    style={{ background: "rgb(180 180 180)", color: "black" }}
                                                >
                                                    Submit
                                                </Button>
                                        }
                                    </div>
                                </Grid>
                            }
                        </Grid>
                    </Box>
                </Paper>
            </Box >
        </div >
    );
}

export default ContactForm;

