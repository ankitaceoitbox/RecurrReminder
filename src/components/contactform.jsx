import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Paper, Switch, FormControlLabel, InputLabel, FormControl, Select, MenuItem, FormHelperText, Input, Checkbox, Typography, Menu } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { loginSubject } from './login';
import setTimeToAMPM from '../utility/converttimetodate';
import { areEmailsValid } from '../utility/validations';
import './allformdata.css';
import WeeksIcon from './weeksIcon';
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
    const [endsOnOption, setEndsOnOption] = useState("never");

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
    // dropdown for month
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
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

    const handleEndsOnChange = (event) => {
        const endsOn = event.target.value;
        setEndsOnOption(endsOn);
    }

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

    const getDayOfWeek = (date) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = date.getDay();
        return daysOfWeek[dayIndex];
    }

    const getOccurrenceInMonth = (date) => {
        const targetDayOfWeek = date.getDay();
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const firstDayOfWeek = firstDayOfMonth.getDay();
        // Calculate the difference between the target day and the first day of the month
        let difference = targetDayOfWeek - firstDayOfWeek;
        if (difference < 0) difference += 7;

        // Calculate the occurrence
        const occurrence = Math.floor((date.getDate() - difference) / 7) + 1;
        return occurrence;
    }

    function getOccurrenceSuffix(occurrence) {
        if (occurrence >= 11 && occurrence <= 13) {
            return 'th';
        }
        switch (occurrence % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }

    // 1st friday
    const DayFrequencyFormat = () => {
        const date = new Date(formData.commonFields.startDate);
        console.log(date)
        const occurence = getOccurrenceInMonth(date);
        const format = getOccurrenceSuffix(occurence); // st,nd,rd
        const weekDayName = getDayOfWeek(date);
        const formattedText = `Every ${occurence}<sup>${format}</sup> ${weekDayName} Of Month`

        return (
            <div dangerouslySetInnerHTML={{ __html: formattedText }} />
        );
    }

    const DayDateFrequencyFormat = () => {
        const date = new Date(formData.commonFields.startDate);
        const format = getOccurrenceSuffix(date.getDate());
        const formattedText = `Every ${date.getDate()}<sup>${format}</sup> Date Of Month`;
        return (
            <div dangerouslySetInnerHTML={{ __html: formattedText }} />
        );
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
                    mt: marginTop ? marginTop : "60px",
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
                        // boxShadow: "rgb(180 180 180) 1px 1px 14px 1px"
                        boxShadow: "rgb(204 227 238) 1px 1px 20px 4px"
                    }}
                >
                    <Box component="form" noValidate>
                        <h1 style={{ textAlign: "center", marginTop: 0, fontFamily: "roboto" }}>Recurring Reminder</h1>
                    </Box>
                    <Box component="form" noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    variant="outlined"
                                    label={<span style={{ fontFamily: 'roboto' }}>Name</span>}
                                    value={formData.commonFields.name}
                                    onChange={handleNameChange}
                                    size="small"
                                    InputProps={{
                                        inputProps: {
                                            style: {
                                                fontFamily: 'roboto',  // Change the font family for the input text
                                            }
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    variant="outlined"
                                    label={<span style={{ fontFamily: 'roboto' }}>Company</span>}
                                    value={formData.commonFields.company}
                                    onChange={handleCompanyChange}
                                    size="small"
                                    InputProps={{
                                        inputProps: {
                                            style: {
                                                fontFamily: 'roboto',  // Change the font family for the input text
                                            }
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label={<span style={{ fontFamily: "roboto" }}>Start Date</span>}
                                        sx={{ width: "100%", fontFamily: "roboto" }}
                                        onChange={handleStartDateChange}
                                        slotProps={{
                                            textField: {
                                                size: 'small', helperText: startDateError && 'Invalid Date entered',
                                            },
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
                                    label={<span style={{ fontFamily: 'roboto' }}>Day</span>}
                                    value={formData.commonFields.day}
                                    disabled
                                    size="small"
                                    InputProps={{
                                        style: {
                                            fontFamily: 'roboto',  // Change the font family for the input and placeholder text
                                        },
                                        inputProps: {
                                            style: {
                                                fontFamily: 'roboto',  // Change the font family for the input text
                                            }
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel htmlFor="send-every-select" sx={{ fontFamily: "roboto" }}>Send Every</InputLabel>
                                    <Select
                                        id="send-every-select"
                                        value={formData.commonFields.every}
                                        label="Send Every"
                                        onChange={handleSendEveryChange}
                                        style={{ fontFamily: 'roboto' }}  // Change the font family for the menu items
                                    >
                                        <MenuItem value="day"><span style={{ fontFamily: "roboto" }}>Day</span></MenuItem>
                                        <MenuItem value="week"><span style={{ fontFamily: "roboto" }}>Week</span></MenuItem>
                                        <MenuItem value="month"><span style={{ fontFamily: "roboto" }}>Month</span></MenuItem>
                                        <MenuItem value="year"><span style={{ fontFamily: "roboto" }}>Year</span></MenuItem>
                                    </Select>
                                    <FormHelperText></FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label={<span style={{ fontFamily: 'roboto' }}>Frequency</span>}
                                    size="small"
                                    type='number'
                                    onChange={handleFrequency}
                                    min={1}
                                    value={formData.commonFields.frequency}
                                    InputProps={{
                                        inputProps: {
                                            style: {
                                                fontFamily: 'roboto',  // Change the font family for the input text
                                            }
                                        },
                                    }}
                                />
                            </Grid>
                            {
                                formData.commonFields.every == 'week' ?
                                    <Grid item xs={12} sm={12} sx={{ marginTop: "0px" }}>
                                        <WeeksIcon />
                                    </Grid>
                                    : <></>
                            }
                            {
                                formData.commonFields.every == 'month' ?
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel htmlFor="select-frequency" sx={{ fontFamily: "roboto" }}>Select Frequency</InputLabel>
                                                <Select
                                                    id="select-frequency"
                                                    label="Select Frequency"
                                                    style={{ fontFamily: 'roboto' }}  // Change the font family for the menu items
                                                >
                                                    <MenuItem value={<DayDateFrequencyFormat />}><DayDateFrequencyFormat /></MenuItem>
                                                    <MenuItem value={<DayFrequencyFormat />}><DayFrequencyFormat /></MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6}></Grid>
                                    </>
                                    :
                                    <>
                                    </>
                            }

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel htmlFor="ends-on-select"
                                        sx={{ fontFamily: "roboto" }}
                                    >
                                        End's On
                                    </InputLabel>
                                    <Select
                                        id="ends-on-select"
                                        label={<span style={{ fontFamily: "roboto" }}>Ends On</span>}
                                        onChange={handleEndsOnChange}
                                        style={{ fontFamily: 'roboto' }}  // Change the font family for the menu items
                                    >
                                        <MenuItem value="never"><span style={{ fontFamily: "roboto" }}>Never</span></MenuItem>
                                        <MenuItem value="ondate"><span style={{ fontFamily: "roboto" }}>On Date</span></MenuItem>
                                        <MenuItem value="after"><span style={{ fontFamily: "roboto" }}>After</span></MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {
                                endsOnOption === 'ondate' ?
                                    <>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label="Ends On"
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
                                    </>
                                    :
                                    endsOnOption === 'after' ?
                                        <>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    label={<span style={{ fontFamily: "roboto" }}>Occurrence</span>}
                                                    size="small"
                                                    type='number'
                                                    min={1}
                                                    InputProps={{
                                                        inputProps: {
                                                            style: {
                                                                fontFamily: 'roboto',  // Change the font family for the input text
                                                            }
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </>
                                        :
                                        <>
                                            <Grid item xs={12} sm={6} md={6}>
                                                <span style={{ fontFamily: "roboto" }}><i>Recurring reminder will never end if end's on is never</i></span>
                                            </Grid>
                                        </>
                            }
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label={<span style={{ fontFamily: "roboto" }}>Send Time</span>}
                                        sx={{ width: "100%" }}
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
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.commonFields.skipHolidays ?? false}
                                            onChange={handleSkipHolidays}
                                        />
                                    }
                                    style={{}}
                                    label={<span style={{ fontFamily: 'roboto' }}>Skip Holidays</span>}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControlLabel
                                    control={<Switch checked={isWAChecked}
                                        onChange={handleWAActivationChange}
                                    />}

                                    label={<span style={{ fontFamily: "roboto" }}>Activate WA</span>}
                                />
                            </Grid>
                            {isWAChecked && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<span style={{ fontFamily: "roboto" }}>Mobile/Group ID</span>}
                                            value={formData.whatsappFields.mobileOrGroupID}
                                            onChange={handleMobileOrGroupIDChange}
                                            size="small"
                                            InputProps={{
                                                inputProps: {
                                                    style: {
                                                        fontFamily: 'roboto',  // Change the font family for the input text
                                                    }
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<span style={{ fontFamily: "roboto" }}>WA Message</span>}
                                            value={formData.whatsappFields.waMessage}
                                            onChange={handleWAMessageChange}
                                            size="small"
                                            sx={{ fontFamily: "roboto" }}
                                            InputProps={{
                                                inputProps: {
                                                    style: {
                                                        fontFamily: 'roboto',  // Change the font family for the input text
                                                    }
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<span style={{ fontFamily: "roboto" }}>WA Attachments URL</span>}
                                            onChange={handleWAattachmentChange}
                                            size="small"
                                            error={wtsappAttachmentError}
                                            helperText={wtsappAttachmentError ? "Only google drive url are valid." : ''}
                                            InputProps={{
                                                inputProps: {
                                                    style: {
                                                        fontFamily: 'roboto',  // Change the font family for the input text
                                                    }
                                                },
                                            }}
                                        />
                                        <small style={{ fontFamily: "roboto" }}><i>Use drive links only.</i></small>
                                    </Grid>
                                </>
                            )}
                            <Grid item xs={12} sm={12}>
                                <FormControlLabel
                                    control={<Switch checked={isEmailChecked} onChange={handleEmailActivationChange}

                                    />}
                                    style={{}}
                                    label={<span style={{ fontFamily: "roboto" }}>Activate Email</span>}
                                />
                            </Grid>
                            {isEmailChecked && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<span style={{ fontFamily: "roboto" }}>Email ID: To</span>}
                                            value={formData.emailFields.emailIDTo}
                                            onChange={handleEmailIDToChange}
                                            size="small"
                                            error={emailError}
                                            helperText={emailError ? <span style={{ fontFamily: "roboto" }}>Invalid Email Id.</span> : ''}
                                            InputProps={{
                                                inputProps: {
                                                    style: {
                                                        fontFamily: 'roboto',  // Change the font family for the input text
                                                    }
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<span style={{ fontFamily: "roboto" }}>Email ID: Cc</span>}
                                            value={formData.emailFields.emailIDCc}
                                            onChange={handleEmailIDCcChange}
                                            size="small"
                                            error={ccEmailError}
                                            helperText={ccEmailError ? <span style={{ fontFamily: "roboto" }}>Invalid Cc.</span> : ''}
                                            InputProps={{
                                                inputProps: {
                                                    style: {
                                                        fontFamily: 'roboto',  // Change the font family for the input text
                                                    }
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<span style={{ fontFamily: "roboto" }}>Email ID: BCc</span>}
                                            value={formData.emailFields.emailIDBCc}
                                            onChange={handleEmailIDBCcChange}
                                            size="small"
                                            error={bccEmailError}
                                            helperText={bccEmailError ? <span style={{ fontFamily: "roboto" }}>Invalid BCc.</span> : ''}
                                            InputProps={{
                                                inputProps: {
                                                    style: {
                                                        fontFamily: 'roboto',  // Change the font family for the input text
                                                    }
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<span style={{ fontFamily: "roboto" }}>Subject line</span>}
                                            value={formData.emailFields.subjectLine}
                                            onChange={handleSubjectLineChange}
                                            size="small"
                                            InputProps={{
                                                inputProps: {
                                                    style: {
                                                        fontFamily: 'roboto',  // Change the font family for the input text
                                                    }
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<span style={{ fontFamily: "roboto" }}>Email Attachments URL</span>}
                                            onChange={handleEmailAttachmentChange}
                                            size="small"
                                            error={emailAttachmentError}
                                            helperText={emailAttachmentError ? <span style={{ fontFamily: "roboto" }}>Only google drive url are valid.</span> : ''}
                                            InputProps={{
                                                inputProps: {
                                                    style: {
                                                        fontFamily: 'roboto',  // Change the font family for the input text
                                                    }
                                                },
                                            }}
                                        />
                                        <small style={{ fontFamily: 'roboto' }}><i>Use drive links only.</i></small>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<span style={{ fontFamily: "roboto" }}>Mail body(HTML)</span>}
                                            value={formData.emailFields.mailBodyHTML}
                                            onChange={handleMailBodyHTMLChange}
                                            size="small"
                                            InputProps={{
                                                inputProps: {
                                                    style: {
                                                        fontFamily: 'roboto',  // Change the font family for the input text
                                                    }
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
                                                    style={{ background: "rgb(93 167 199)", color: "white", fontFamily: "roboto" }}
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

// sx={{
//     "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
//     "& .MuiOutlinedInput-root": {
//         "& > fieldset": { borderColor: "rgb(180 180 180)" },
//         "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
//         "&.Mui-focused fieldset": {
//             borderColor: "rgb(180 180 180)",
//         },
//         "& > fieldset": { borderColor: "rgb(180 180 180)" },
//         "& input": {
//             color: '',
//         },
//     },
//     "& label.MuiInputLabel-root": {
//         color: 'rgb(180 180 180)', // Specify label color
//     },
// }}