import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Paper, Switch, FormControlLabel, InputLabel, FormControl, Select, MenuItem, FormHelperText, Input, Checkbox } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import DateChipsSelector from './multipledateselector';
import WeekdaySelector from './multipleweekselector';
import { loginSubject } from './login';
import setTimeToAMPM from '../utility/converttimetodate';

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
    const [emailAttachmentLength, setEmailAttachmentLength] = useState(0);
    const [waAttachmentLength, setWaAttachmentLength] = useState(0);
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

    const handleStartDateChange = (date) => {
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

            // Extract hours and minutes from the date object
            const hours = date.getHours();
            const minutes = date.getMinutes();

            // Determine whether it's AM or PM
            const period = hours >= 12 ? 'PM' : 'AM';

            // Adjust hours for 12:00 AM/PM
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
        console.log(e.target.checked)
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

    const handleWAattachmentChange = (e) => {
        const files = e.target.files;
        const attachments = Array.from(files).map(data => data);
        setWaAttachmentLength(attachments.length);
        setFormData({
            ...formData,
            whatsappFields: {
                ...formData.whatsappFields,
                attachment: attachments,
            },
        });
    };

    const handleEmailIDToChange = (e) => {
        setFormData({
            ...formData,
            emailFields: {
                ...formData.emailFields,
                emailIDTo: e.target.value,
            },
        });
    };

    const handleEmailIDCcChange = (e) => {
        setFormData({
            ...formData,
            emailFields: {
                ...formData.emailFields,
                emailIDCc: e.target.value.split(','),
            },
        });
    };

    const handleEmailIDBCcChange = (e) => {
        setFormData({
            ...formData,
            emailFields: {
                ...formData.emailFields,
                emailIDBCc: e.target.value.split(','),
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

    const handleEmailAttachmentChange = (e) => {
        const files = e.target.files;
        const attachments = Array.from(files).map(data => data);
        setEmailAttachmentLength(attachments.length);
        setFormData({
            ...formData,
            emailFields: {
                ...formData.whatsappFields,
                attachment: attachments,
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

    const handleSelectedHolidays = (holidays) => {
        setFormData((prevData) => ({
            ...prevData,
            commonFields: {
                ...prevData.commonFields,
                skipDates: [...holidays],
            },
        }));
    }

    const handleSelectedWeekDay = (days) => {
        setFormData((prevData) => ({
            ...prevData,
            commonFields: {
                ...prevData.commonFields,
                skipDays: [...days],
            },
        }));
    }

    const handleFormSubmit = async () => {
        setSubmitClicked(true);
        const res = await onHandleContactFormSubmit(formData);
        if (res) {
            setSubmitClicked(false);
        }
    }

    useEffect(() => {
        loginSubject.next({
            isAuth: true
        });
    }, []);

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: marginTop ? marginTop : "80px",
                    width: '100%', // Set width to 100%
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: '1rem',
                        width: { xs: '90%', sm: width != undefined ? width : '50%' },
                    }}
                >
                    <Box component="form" noValidate>
                        <h1 style={{ textAlign: "center", marginTop: 0 }}>Recurring Reminder</h1>
                    </Box>
                    <Box component="form" noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Start Date"
                                        sx={{ width: "100%" }}
                                        onChange={handleStartDateChange}
                                        slotProps={{ textField: { size: 'small' } }}
                                        defaultValue={formData.commonFields.startDate && dayjs(formData.commonFields.startDate)}
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
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small"
                                >
                                    <InputLabel>Send Every</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        value={formData.commonFields.every}
                                        label="Every"
                                        onChange={handleSendEveryChange}
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
                                    value={formData.commonFields.frequency}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        sx={{ width: "100%" }}
                                        label="Send Time"
                                        defaultValue={setTimeToAMPM(formData.commonFields.sendTime)}
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
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Ends On"
                                        sx={{ width: "100%" }}
                                        onChange={handleEndsOnDateChange}
                                        slotProps={{ textField: { size: 'small' } }}
                                        defaultValue={formData.commonFields.endsOnDate && dayjs(formData.commonFields.endsOnDate)}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/* <DateChipsSelector
                                    onHandleSelectedDates={handleSelectedHolidays}
                                    preSelectedDates={formData.commonFields.skipDates}
                                /> */}
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.commonFields.skipHolidays ?? false}
                                            onChange={handleSkipHolidays}
                                            color="primary" // Customize the color if needed
                                        />
                                    }
                                    label="Skip Holidays"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/* <WeekdaySelector
                                    onHandleSelectedWeekDay={handleSelectedWeekDay}
                                    preSelectedDays={formData.commonFields.skipDays}
                                /> */}
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControlLabel
                                    control={<Switch checked={isWAChecked}
                                        onChange={handleWAActivationChange} />}
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <input
                                            hidden
                                            accept="*/*"
                                            multiple
                                            type="file"
                                            id="file-wa-upload-input"
                                            onChange={handleWAattachmentChange}
                                        />
                                        <label htmlFor="file-wa-upload-input">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<CloudUploadIcon />}
                                                fullWidth
                                            >
                                                {
                                                    waAttachmentLength > 0 ? waAttachmentLength + " files selected" : "Upload WA File"
                                                }
                                            </Button>
                                        </label>
                                    </Grid>
                                </>
                            )}
                            <Grid item xs={12} sm={12}>
                                <FormControlLabel
                                    control={<Switch checked={isEmailChecked} onChange={handleEmailActivationChange} />}
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <input
                                            hidden
                                            accept="*/*"
                                            multiple
                                            type="file"
                                            id="file-email-upload-input"
                                            onChange={handleEmailAttachmentChange}
                                        />
                                        <label htmlFor="file-email-upload-input">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                startIcon={<CloudUploadIcon />}
                                                fullWidth
                                            >
                                                {
                                                    emailAttachmentLength > 0 ? emailAttachmentLength + " files selected" : "Upload File"
                                                }
                                            </Button>
                                        </label>
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
            </Box>
        </>
    );
}

export default ContactForm;

