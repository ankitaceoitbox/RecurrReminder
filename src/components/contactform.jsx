import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, Paper, Switch, FormControlLabel, InputLabel, FormControl, Select, MenuItem, FormHelperText, Input, Checkbox, Typography, Menu, TextareaAutosize } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { loginSubject } from './login';
import { areEmailsValid } from '../utility/validations';
import './allformdata.css';
import WeeksIcon from './weeksIcon';
import { DayDateFrequencyFormat, DayFrequencyFormat, createDateWithTime, getDayOfWeek, getTimeFromDateString } from '../utility/date_related_function';
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
    const [emailError, setEmailError] = useState(false);
    const [bccEmailError, setBccEmailError] = useState(false);
    const [ccEmailError, setCcEmailError] = useState(false);
    const [startDateError, setStartDateError] = useState(false);
    const [endsOnDateError, setEndsOnDateError] = useState(false);
    const [wtsappAttachmentError, setWtsappAttachmentError] = useState(false);
    const [emailAttachmentError, setEmailAttachmentError] = useState(false);

    /** states for form data */
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [day, setDay] = useState('');
    const [every, setEvery] = useState('');
    const [frequency, setFrequency] = useState('');
    const [endsOnObject, setEndsOnObject] = useState({
        occurence: 0,
        date: null,
        never: "never",
    });
    const [endsOnOption, setEndsOnOption] = useState('never');
    const [month, setMonth] = useState({
        date: null,
        day: "",
    });
    const [week, setWeek] = useState({
        days: []
    });
    const [sendTime, setSendTime] = useState(null);
    const [skipHolidays, setSkipHolidays] = useState(false);
    const [sendWADate, setSendWADate] = useState(null);
    const [mobileOrGroupID, setMobileOrGroupID] = useState('');
    const [waMessage, setWaMessage] = useState('');
    const [waAttachment, setWaAttachment] = useState([]);
    const [emailIDTo, setEmailIDTo] = useState('');
    const [emailIDCc, setEmailIDCc] = useState('');
    const [emailIDBCc, setEmailIDBCc] = useState('');
    const [subjectLine, setSubjectLine] = useState('');
    const [emailAttachment, setEmailAttachment] = useState([]);
    const [mailBodyHTML, setMailBodyHTML] = useState('');
    const [sendMailDate, setSendMailDate] = useState(null);
    /** ends of form data states */

    /** for setting the font to roboto */
    const fontFamilySet = {
        inputProps: {
            style: {
                fontFamily: 'roboto',
            }
        },
    }

    /** For setting the font of label to roboto */
    const LabelStyling = ({ labelName }) => {
        return (
            <>
                <span style={{ fontFamily: 'roboto' }}>{labelName}</span>
            </>
        )
    }

    const handleStartDateChange = (date) => {
        if (date && dayjs(date).isBefore(dayjs(), 'day')) {
            setStartDateError(true);
            setDay('');
            return;
        } else {
            setStartDateError(false);
        }
        if (date) {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const day = dayjs(date).format('dddd');
            setStartDate(formattedDate);
            setDay(day);
        } else {
            setStartDate(null);
            setDay('');
        }
    };

    const handleEndsOnChange = (event) => {
        const endsOn = event.target.value;
        const endsOnDate = {};
        if (endsOn === "never") {
            endsOnDate['occurence'] = 0;
            endsOnDate['date'] = null;
            endsOnDate['never'] = "never";
        } else if (endsOn === 'ondate') {
            endsOnDate['occurence'] = 0;
            endsOnDate['date'] = null;
            endsOnDate['never'] = "never";

        } else if (endsOn === "after") {
            endsOnDate['occurence'] = 0;
            endsOnDate['date'] = null;
            endsOnDate['never'] = "never";
        }
        setEndsOnObject(endsOnDate);
        setEndsOnOption(endsOn);
    }

    const handleSendTimeChange = (time) => {
        setSendTime(time);
    };

    const handleWAattachmentChange = async (e) => {
        let attachment = e.target.value || "";
        setWtsappAttachmentError(false);
        setWaAttachment(attachment);
    };

    const handleWAattachmentChangeError = async (e) => {
        let attachment = e.target.value || "";
        if (attachment) {
            attachment = attachment.split(',');
        }
        for (let i = 0; i < attachment.length; i++) {
            const url = attachment[i];
            if (url.indexOf('https://drive.google.com') === -1) {
                setWtsappAttachmentError(true);
                return;
            }
        }
    }

    const handleEmailattachmentChangeError = async (e) => {
        let attachment = e.target.value || "";
        if (attachment) {
            attachment = attachment.split(',');
        }
        for (let i = 0; i < attachment.length; i++) {
            const url = attachment[i];
            if (url.indexOf('https://drive.google.com') === -1) {
                setEmailAttachmentError(true);
                return;
            }
        }
    }

    const handleEmailIDToChange = (e) => {
        const validOrNot = areEmailsValid(e.target.value);
        if (!validOrNot) {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
        setEmailIDTo(e.target.value)
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
        setEmailIDCc(cc);
    };

    const handleEmailIDBCcChange = (e) => {
        let bcc = [];
        if (e.target.value !== '') {
            bcc = [...e.target.value.split(",")];
        }
        const validOrNot = areEmailsValid(e.target.value);
        if (!validOrNot) {
            setBccEmailError(true);
        } else {
            setBccEmailError(false);
        }
        setEmailIDBCc(bcc);
    };

    const handleEmailAttachmentChange = async (e) => {
        let attachment = e.target.value || "";
        setEmailAttachmentError(false);
        setEmailAttachment(attachment);
    };

    const handleEndsOnDateChange = (date) => {
        if (date && dayjs(date).isBefore(dayjs(), 'day')) {
            setEndsOnDateError(true);
            return;
        } else {
            setEndsOnDateError(false);
        }
        if (date) {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            setEndsOnObject({
                occurence: 0,
                date: formattedDate,
                never: "",
            });
        } else {
            setEndsOnObject({
                occurence: 0,
                date: null,
                never: "never",
            });
        }
    };

    const handleFormSubmit = async () => {
        console.log(week);
        let time = '';
        if (sendTime) {
            time = sendTime.$d;
            time = getTimeFromDateString(new Date(time));
        }
        setSubmitClicked(true);
        const formData = {
            startDate,
            skipHolidays,
            day,
            frequency,
            every,
            month,
            week,
            sendTime: time,
            name,
            company,
            isActiveWA: isWAChecked,
            isActiveEmail: isEmailChecked,
            mobile: mobileOrGroupID,
            waMessage,
            WaAttachement: waAttachment,
            emailAttachments: emailAttachment,
            sendWADate,
            email: emailIDTo,
            cc: emailIDCc,
            bcc: emailIDBCc,
            emailSubject: subjectLine,
            emailBody: mailBodyHTML,
            sendMailDate: new Date(),
            endDate: endsOnObject,
        }
        const res = await onHandleContactFormSubmit(formData);
        if (res) {
            setSubmitClicked(false);
            resetForm();
        }
    }

    const resetForm = () => {
        setStartDate(null);
        setSkipHolidays(false);
        setDay('');
        setFrequency('');
        setEvery('');
        setMonth({
            date: null,
            day: ''
        });
        setWeek({
            days: []
        });
        setSendTime(null);
        setName('')
        setCompany('');
        setIsWAChecked(false);
        setIsEmailChecked(false);
        setMobileOrGroupID('');
        setWaMessage('');
        setWaAttachment('');
        setEmailAttachment('');
        setSendWADate(null);
        setEmailIDTo('');
        setEmailIDCc('');
        setEmailIDBCc('');
        setSubjectLine('');
        setMailBodyHTML('');
        setSendMailDate(null);
        setEndsOnObject({
            occurence: 0,
            date: null,
            never: ""
        });
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

    useEffect(() => {
        if (autoFillData) {
            setStartDate(dayjs(new Date(autoFillData.startDate)));
            setSkipHolidays(autoFillData.skipHolidays);
            setDay(autoFillData.day);
            setFrequency(autoFillData.frequency);
            setEvery(autoFillData.every);
            setMonth({
                date: autoFillData?.month?.date,
                day: autoFillData?.month?.day
            });
            setWeek({
                days: autoFillData?.week?.days
            });
            const timeDate = createDateWithTime(autoFillData.sendTime);
            setSendTime(dayjs(timeDate));
            setName(autoFillData.name);
            setCompany(autoFillData.company);
            setIsWAChecked(autoFillData.isActiveWA);
            setIsEmailChecked(autoFillData.isActiveEmail);
            setMobileOrGroupID(autoFillData.mobileOrGroupID);
            setWaMessage(autoFillData.waMessage);
            setWaAttachment(autoFillData.waAttachment);
            setEmailAttachment(autoFillData.emailAttachment);
            setSendWADate(null);
            setEmailIDTo(autoFillData.emailIDTo);
            setEmailIDCc(autoFillData.emailIDCc);
            setEmailIDBCc(autoFillData.emailIDBCc);
            setSubjectLine(autoFillData.subjectLine);
            setMailBodyHTML(autoFillData.mailBodyHTML);
            setSendMailDate(null);
            setEndsOnObject({
                occurence: autoFillData?.endsOnObject?.occurence,
                date: autoFillData?.endsOnObject?.date,
                never: autoFillData?.endsOnObject?.never
            });
            if (autoFillData?.endsOnObject?.occurence > 0) {
                setEndsOnOption('after');
            } else if (autoFillData?.endsOnObject?.date) {
                setEndsOnOption('ondate');
            } else if (autoFillData?.endsOnObject?.never) {
                setEndsOnOption('never');
            }
        }
    }, [autoFillData]);

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
                                    label={<LabelStyling labelName="Name" />}
                                    value={name}
                                    onChange={(e) => { setName(e.target.value) }}
                                    size="small"
                                    InputProps={fontFamilySet}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    variant="outlined"
                                    label={<LabelStyling labelName="Company" />}
                                    value={company}
                                    onChange={(e) => { setCompany(e.target.value) }}
                                    size="small"
                                    InputProps={fontFamilySet}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label={<LabelStyling labelName="Start Date" />}
                                        sx={{ width: "100%", fontFamily: "roboto" }}
                                        onChange={handleStartDateChange}
                                        slotProps={{
                                            textField: {
                                                size: 'small', helperText: startDateError && 'Invalid Date entered',
                                            },
                                        }}
                                        value={!!startDate ? dayjs(startDate) : null}
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
                                    label={<LabelStyling labelName="Day" />}
                                    value={day}
                                    disabled
                                    size="small"
                                    InputProps={fontFamilySet}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small">
                                    <InputLabel htmlFor="send-every-select" sx={{ fontFamily: "roboto" }}>Send Every</InputLabel>
                                    <Select
                                        id="send-every-select"
                                        value={every}
                                        label="Send Every"
                                        onChange={(e) => { setEvery(e.target.value) }}
                                        style={{ fontFamily: 'roboto' }}
                                    >
                                        <MenuItem value="day"><LabelStyling labelName="Day" /></MenuItem>
                                        <MenuItem value="week"><LabelStyling labelName="Week" /></MenuItem>
                                        <MenuItem value="month"><LabelStyling labelName="Month" /></MenuItem>
                                        <MenuItem value="year"><LabelStyling labelName="Year" /></MenuItem>
                                    </Select>
                                    <FormHelperText></FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label={<LabelStyling labelName="Frequency" />}
                                    size="small"
                                    type='number'
                                    onChange={(e) => { setFrequency(e.target.value) }}
                                    min={1}
                                    value={frequency}
                                    InputProps={fontFamilySet}
                                />
                            </Grid>
                            {
                                every == 'week' ?
                                    <Grid item xs={12} sm={12} sx={{ marginTop: "0px" }}>
                                        <WeeksIcon
                                            onSelectedWeeksChange={(selectedWeeks) => {
                                                setWeek({
                                                    days: [...selectedWeeks]
                                                })
                                            }}
                                            initiallySelectedWeeks={week.days ?? []}
                                        />
                                    </Grid>
                                    : <></>
                            }
                            {
                                every === 'month' ?
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel htmlFor="select-frequency" sx={{ fontFamily: "roboto" }}>Select Frequency</InputLabel>
                                                <Select
                                                    id="select-frequency"
                                                    label="Select Frequency"
                                                    style={{ fontFamily: 'roboto' }}
                                                    onChange={(e) => {
                                                        if (e.target.value === 'date') {
                                                            const date = new Date(startDate);
                                                            setMonth({
                                                                date: date,
                                                                day: "",
                                                            });
                                                        } else {
                                                            const date = new Date(startDate);
                                                            const weekDayName = getDayOfWeek(date);
                                                            setMonth({
                                                                date: null,
                                                                day: weekDayName,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="date"><DayDateFrequencyFormat date={startDate} /></MenuItem>
                                                    <MenuItem value="day"><DayFrequencyFormat date={startDate} /></MenuItem>
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
                                        label={<LabelStyling labelName="Ends On" />}
                                        onChange={handleEndsOnChange}
                                        style={{ fontFamily: 'roboto' }}  // Change the font family for the menu items
                                        value={endsOnOption}
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
                                                    sx={{ width: "100%", fontFamily: "roboto" }}
                                                    onChange={handleEndsOnDateChange}
                                                    slotProps={{
                                                        textField: {
                                                            size: 'small', helperText: endsOnDateError && 'Invalid Date entered',
                                                        }
                                                    }}
                                                    defaultValue={endsOnObject.date === null ? null : (endsOnObject.date && dayjs(endsOnObject.date))}
                                                    minDate={dayjs(new Date())}
                                                    reduceAnimations
                                                    value={endsOnObject.date === null ? null : dayjs(endsOnObject.date)}
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
                                                    label={<LabelStyling labelName="Occurrence" />}
                                                    size="small"
                                                    type='number'
                                                    min={1}
                                                    value={endsOnObject.occurence ?? ''}
                                                    InputProps={fontFamilySet}
                                                    onChange={(e) => {
                                                        setEndsOnObject({
                                                            occurence: e.target.value,
                                                            date: null,
                                                            never: "",
                                                        })
                                                    }
                                                    }
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
                                        label={<LabelStyling labelName="Send Time" />}
                                        sx={{ width: "100%" }}
                                        value={sendTime}
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
                                            checked={skipHolidays}
                                            onChange={(e) => {
                                                setSkipHolidays(e.target.checked)
                                            }}
                                        />
                                    }
                                    label={<LabelStyling labelName="Skip Holidays" />}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <FormControlLabel
                                    control={<Switch checked={isWAChecked}
                                        onChange={(e) => {
                                            setIsWAChecked(e.target.checked)
                                        }}
                                    />}
                                    label={<LabelStyling labelName="Activate WA" />}
                                />
                            </Grid>
                            {isWAChecked && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<LabelStyling labelName="Mobile/Group ID" />}
                                            value={mobileOrGroupID}
                                            onChange={(e) => { setMobileOrGroupID(e.target.value) }}
                                            size="small"
                                            InputProps={fontFamilySet}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<LabelStyling labelName="WA Attachments URL" />}
                                            value={waAttachment}
                                            onChange={handleWAattachmentChange}
                                            onBlur={handleWAattachmentChangeError}
                                            size="small"
                                            error={wtsappAttachmentError}
                                            helperText={wtsappAttachmentError ? "Only google drive url are valid." : ''}
                                            InputProps={fontFamilySet}
                                        />
                                        <small style={{ fontFamily: "roboto" }}><i>Use drive links only.</i></small>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <textarea
                                            onChange={(e) => setWaMessage(e.target.value)}
                                            placeholder="WA Message"
                                            value={waMessage}
                                            style={{
                                                fontFamily: "roboto",
                                                maxWidth: "100%", minWidth: "100%", maxHeight: "200px",
                                                overflowY: "auto",
                                                minHeight: "100px",
                                                paddingLeft: "10px",
                                                paddingTop: "10px",
                                            }}
                                        >
                                        </textarea>
                                    </Grid>

                                </>
                            )}
                            <Grid item xs={12} sm={12}>
                                <FormControlLabel
                                    control={<Switch checked={isEmailChecked} onChange={(e) => {
                                        setIsEmailChecked(e.target.checked)
                                    }}
                                    />}
                                    label={<LabelStyling labelName="Activate Email" />}
                                />
                            </Grid>
                            {isEmailChecked && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<LabelStyling labelName="Email ID: To" />}
                                            value={emailIDTo}
                                            onChange={handleEmailIDToChange}
                                            size="small"
                                            error={emailError}
                                            helperText={emailError ? <span style={{ fontFamily: "roboto" }}>Invalid Email Id.</span> : ''}
                                            InputProps={fontFamilySet}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<LabelStyling labelName="Email ID: Cc" />}
                                            value={emailIDCc}
                                            onChange={handleEmailIDCcChange}
                                            size="small"
                                            error={ccEmailError}
                                            helperText={ccEmailError ? <span style={{ fontFamily: "roboto" }}>Invalid Cc.</span> : ''}
                                            InputProps={fontFamilySet}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<LabelStyling labelName="Email ID: BCc" />}
                                            value={emailIDBCc}
                                            onChange={handleEmailIDBCcChange}
                                            size="small"
                                            error={bccEmailError}
                                            helperText={bccEmailError ? <span style={{ fontFamily: "roboto" }}>Invalid BCc.</span> : ''}
                                            InputProps={fontFamilySet}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<LabelStyling labelName="Subject line" />}
                                            value={subjectLine}
                                            onChange={(e) => setSubjectLine(e.target.value)}
                                            size="small"
                                            InputProps={fontFamilySet}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            variant="outlined"
                                            label={<LabelStyling labelName="Email Attachments URL" />}
                                            onChange={handleEmailAttachmentChange}
                                            onBlur={handleEmailattachmentChangeError}
                                            value={emailAttachment}
                                            size="small"
                                            error={emailAttachmentError}
                                            helperText={emailAttachmentError ? <span style={{ fontFamily: "roboto" }}>Only google drive url are valid.</span> : ''}
                                            InputProps={fontFamilySet}
                                        />
                                        <small style={{ fontFamily: 'roboto' }}><i>Use drive links only.</i></small>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <textarea
                                            onChange={(e) => setMailBodyHTML(e.target.value)}
                                            placeholder="Mail Body (HTML)"
                                            value={mailBodyHTML}
                                            style={{
                                                fontFamily: "roboto",
                                                maxWidth: "100%", minWidth: "100%", maxHeight: "200px",
                                                overflowY: "auto",
                                                minHeight: "100px",
                                                paddingLeft: "10px",
                                                paddingTop: "10px",
                                            }}
                                        >
                                        </textarea>
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
            </Box>
        </div>
    );
}

export default ContactForm;
