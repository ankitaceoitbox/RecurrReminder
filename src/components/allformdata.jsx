import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, TableCell } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { loginSubject } from './login';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import ContactForm from './contactform';
import './allformdata.css';

function AllFormData({ allData, onDeleteFormDataById }) {
    const [allFormData, setAllFormData] = React.useState([]);
    const [formData, setFormData] = React.useState({
        isWAChecked: false,
        whatsappFields: {
            sendWADate: null,
            mobileOrGroupID: '',
            waMessage: '',
            attachment: '',
        },
        isEmailChecked: false,
        emailFields: {
            emailIDTo: '',
            emailIDCc: [],
            emailIDBCc: [],
            subjectLine: '',
            attachment: '',
            mailBodyHTML: '',
        },
        commonFields: {
            startDate: null,
            day: '',
            sendTime: null,
            sendDays: '',
            name: '',
            company: '',
            endsOnDate: null,
        },
    });
    const [editRowIndex, setEditRowIndex] = React.useState(-1);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openViewDialog, setOpenViewDialog] = React.useState(false);
    const [isWAChecked, setIsWAChecked] = React.useState(false);
    const [isEmailChecked, setIsEmailChecked] = React.useState(false);
    const [viewData, setViewData] = React.useState({});
    const [editedData, setEditedData] = React.useState({});
    useEffect(() => {
        loginSubject.next({
            isAuth: true
        });
    }, []);

    useEffect(() => {
        setAllFormData(allData);
    }, [allData]);

    if (!allFormData || allFormData.length === 0) {
        return <div>No data to display.</div>;
    }

    const handleSaveChanges = (index) => {
        // Save the edited data here (e.g., update it in your state or send it to a server)
        // After saving, exit edit mode
        setEditRowIndex(-1);
        handleFormSubmit();
    };

    const handleCancelEdit = (index) => {
        // Exit edit mode without saving changes
        setEditRowIndex(-1);
    };

    const handleEditDataChange = (field, value) => {
        // Update the edited data while in edit mode
        setEditedData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px', // Adjust the gap between each grid item
        padding: '20px', // Adjust the padding inside the Paper component
    };

    const itemStyle = {
        padding: '8px', // Adjust the padding for each individual grid item
        border: '1px solid #ddd', // Add a border
        borderRadius: '4px', // Add some border-radius for rounded corners
    };
    const formatDateToIndianTime = (utcDateString) => {
        if (utcDateString === '') return '';
        // Create a Date object from the UTC date string
        const utcDate = new Date(utcDateString);

        // Specify the options for formatting in the Indian time zone (IST)
        const options = {
            timeZone: "Asia/Kolkata", // Indian time zone
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        };

        // Format the date and time in the Indian time zone
        return utcDate.toLocaleString("en-IN", options);
    }

    const handleEditClick = (index) => {
        setOpenEditDialog(true);
        setEditRowIndex(index);
        const editedData = { ...allFormData[index] };
        setFormData((prevFormData) => ({
            ...prevFormData,
            commonFields: {
                ...prevFormData.commonFields,
                startDate: editedData.startDate,
                day: editedData.day,
                sendTime: editedData.sendTime,
                name: editedData.name,
                company: editedData.company,
                endsOnDate: editedData.endDate,
            },
            isWAChecked: editedData.isActiveWA,
            whatsappFields: {
                ...prevFormData.whatsappFields,
                sendWADate: editedData.sendWADate,
                waMessage: editedData.waMessage,
                attachment: editedData.WaAttachement,
            },
            isEmailChecked: editedData.isActiveEmail,
            emailFields: {
                ...prevFormData.emailFields,
                emailIDTo: editedData.email,
                emailIDCc: editedData.cc,
                emailIDBCc: editedData.bcc,
                subjectLine: editedData.emailSubject,
                attachment: editedData.attachment,
                mailBodyHTML: editedData.emailBody,
            },
        }));
    };

    /** Update the view data object. */
    const handleViewDataObject = (_id) => {
        const data = allFormData.find(data => {
            return data._id === _id;
        })
        setViewData(data);
    }

    const columns = [
        {
            field: 'view',
            headerName: 'View',
            width: 70,
            renderCell: (params) => {
                return (
                    <TableCell>
                        <VisibilityIcon
                            sx={{ fontSize: "18px" }}
                            onClick={() => {
                                setOpenViewDialog(true);
                                handleViewDataObject(params.row._id);
                            }}
                        />
                    </TableCell>
                )
            }
        },
        {
            field: 'edit',
            headerName: 'Edit',
            width: 70,
            sortable: false,
            filterable: false,
            toolbar: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                if (params.row.id === editRowIndex) {
                    return (
                        <TableCell>
                            <SaveIcon
                                sx={{ fontSize: "18px" }}
                                onClick={() => handleSaveChanges(params.row.id)} />
                        </TableCell>
                    );
                } else {
                    return (
                        <TableCell>
                            <EditIcon
                                sx={{ fontSize: "18px" }}
                                onClick={() => handleEditClick(params.row.id)} />
                        </TableCell>
                    );
                }
            },
        },
        {
            field: 'delete',
            headerName: 'Delete',
            width: 70,
            renderCell: (params) => {
                return (
                    <TableCell>
                        <DeleteIcon
                            sx={{ fontSize: "18px" }}
                            onClick={() => {
                                const id = params.row._id;
                                handleDelete(id);
                            }}
                        />
                    </TableCell>
                )
            }
        },
        {
            field: 'id', headerName: 'ID', width: 70, headerClassName: "header-bg-color"
        },
        { field: 'startDate', headerName: 'Start Date', width: 150 },
        { field: 'day', headerName: 'Day', width: 100 },
        { field: 'remDay', headerName: 'Repeat After', width: 150 },
        { field: 'sendTime', headerName: 'Send Time', width: 150 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'company', headerName: 'Company', width: 150 },
        { field: 'isActiveWA', headerName: 'WhatsApp Activate', width: 150 },
        { field: 'waMessage', headerName: 'WhatsApp Message', width: 150 },
        { field: 'mobile', headerName: 'WhatsApp Phone', width: 150 },
        { field: 'isActiveEmail', headerName: 'Email Activate', width: 150 },
        { field: 'email', headerName: 'Email ID', width: 150 },
        { field: 'cc', headerName: 'Email Cc', width: 150 },
        { field: 'bcc', headerName: 'Email Bcc', width: 150 },
        { field: 'emailSubject', headerName: 'Email Subject', width: 150 },
        { field: 'emailBody', headerName: 'Email Body', width: 150 },
        { field: 'endDate', headerName: 'End Date', width: 150 },
        { field: '_id', headerName: 'Unique Id', width: 100 },
    ];

    const rows = allFormData.map((item, index) => ({
        id: index,
        startDate: formatDateToIndianTime(item.startDate),
        day: item.day,
        remDay: item.remDay,
        sendTime: item.sendTime,
        name: item.name,
        company: item.company,
        isActiveWA: item.isActiveWA.toString(),
        waMessage: item.waMessage,
        mobile: item.mobile,
        isActiveEmail: item.isActiveEmail,
        email: item.email,
        cc: item.cc.join(','),
        bcc: item.bcc.join(','),
        emailSubject: item.emailSubject,
        emailBody: item.emailBody,
        endDate: formatDateToIndianTime(item.endDate),
        _id: item._id,
    }));

    /** Edit Dialog Settings and functions */
    const handleSendDaysChange = (event) => {
        const newSendDays = event.target.value;

        // Update formData with the newSendDays value
        setFormData((prevData) => ({
            ...prevData,
            commonFields: {
                ...prevData.commonFields,
                sendDays: newSendDays,
            },
        }));
    };

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
    }
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

    const handleNameChange = (e) => {
        setFormData({
            ...formData,
            commonFields: {
                ...formData.commonFields,
                name: e.target.value,
            },
        });
    };

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
        const selectedFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileData = event.target.result;
            setFormData({
                ...formData,
                whatsappFields: {
                    ...formData.whatsappFields,
                    attachment: fileData,
                },
            });

        };
        reader.readAsDataURL(selectedFile);
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
        const selectedFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const fileData = event.target.result;
            setFormData({
                ...formData,
                emailFields: {
                    ...formData.emailFields,
                    attachment: fileData,
                },
            });
        };
        reader.readAsDataURL(selectedFile);
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

    const handleFormSubmit = () => {
    }

    const handleDelete = async (_id) => {
        onDeleteFormDataById(_id);
    }

    return (
        <>
            <Grid
                container
                spacing={2}
                sx={{ mt: 8, ml: 3, textAlign: 'center', justifyContent: 'center', alignItems: 'center', width: "98%" }}
            >
                <Grid item xs={12} sm={11.5}>
                    <Paper elevation={10} sx={{ padding: "10px" }}>
                        <DataGrid
                            disableSelectionOnClick={true}
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            className="header-bg-color"
                            slots={{
                                toolbar: GridToolbar,
                            }}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                    },
                                },
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {/* This is for view data in dialog. */}
            <Dialog
                open={openViewDialog}
                onClose={() => setOpenViewDialog(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>View Data</DialogTitle>
                <DialogContent>
                    {
                        viewData &&
                        <>
                            <Box sx={{ width: "100%" }}>
                                <Paper style={containerStyle} elevation={6}>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>Name</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.name}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>Company</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.company}</div>

                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>Day</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.day}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>Start Date</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{formatDateToIndianTime(viewData.startDate)}</div>
                                        </Grid>
                                    </Grid>

                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>Reminder Date</div>
                                        </Grid>
                                        <Grid xs={6} item>

                                            <div className="view-data">{viewData.remDay}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>Ends On</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{formatDateToIndianTime(viewData.endDate)}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>Send Time</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.sendTime}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>WhatsApp Phone</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.mobile}</div>
                                        </Grid>
                                    </Grid>

                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>Email</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.email}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>cc</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.cc?.join(",")}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>bcc</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.bcc?.join(",")}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item><div>Email Subject</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.emailSubject}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>Email Body</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.emailBody}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>WhatsApp Message</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.waMessage}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div>WatSapp Attachement</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.WaAttachement}</div>
                                        </Grid>
                                    </Grid>
                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <Button variant="contained" color="primary" onClick={() => { setOpenViewDialog(false) }}>
                                            Close
                                        </Button>
                                    </div>
                                </Paper>
                            </Box>
                        </>
                    }
                </DialogContent>
            </Dialog>
            {/* End of view data in dialog. */}

            {/* This is for edit the data inside dialog. */}
            <Dialog
                fullWidth
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                maxWidth="sm"
            >
                <DialogTitle>Edit Data</DialogTitle>
                <DialogContent>
                    <ContactForm
                        width="100%"
                        autoFillData={formData}
                    />
                    {/* <Box
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                padding: '1rem',
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
                                                defaultValue={dayjs(formData.commonFields.startDate)}
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
                                                value={formData.commonFields.sendDays}
                                                label="Frequency"
                                                onChange={handleSendDaysChange}
                                            >
                                                <MenuItem value="Day">Day</MenuItem>
                                                <MenuItem value="Week">Week</MenuItem>
                                                <MenuItem value="Month">Month</MenuItem>
                                                <MenuItem value="Year">Year</MenuItem>
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
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                sx={{ width: "100%" }}
                                                label="Send Time"
                                                value={dayjs(formData.commonFields.sendTime)}
                                                onChange={(event) => {
                                                    handleSendTimeChange(event);
                                                }}
                                                // defaultValue={dayjs('2022-04-17T15:30')}
                                                slotProps={{ textField: { size: 'small' } }}
                                                renderInput={(params) => <TextField {...params} variant="outlined" />}
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
                                                defaultValue={dayjs(formData.commonFields.endsOnDate)}
                                            />
                                        </LocalizationProvider>
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
                                                <Input
                                                    type="file"
                                                    accept="image/*" // Specify the accepted file types
                                                    onChange={handleWAattachmentChange}
                                                    style={{ display: 'none' }} // Hide the default file input
                                                    id="file-upload-input"
                                                />
                                                <label htmlFor="file-upload-input">
                                                    <Button
                                                        variant="outlined"
                                                        component="span"
                                                        startIcon={<CloudUploadIcon />}
                                                        fullWidth
                                                    >
                                                        Upload WA File
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
                                                <Input
                                                    type="file"
                                                    accept="image/*" // Specify the accepted file types
                                                    onChange={handleEmailAttachmentChange}
                                                    style={{ display: 'none' }} // Hide the default file input
                                                    id="file-upload-input"
                                                />
                                                <label htmlFor="file-upload-input">
                                                    <Button
                                                        variant="outlined"
                                                        component="span"
                                                        startIcon={<CloudUploadIcon />}
                                                        fullWidth
                                                    >
                                                        Upload Email File
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
                                </Grid>
                            </Box>
                        </Paper>
                    </Box> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save</Button>
                </DialogActions>
            </Dialog>
            {/* End of edit the data inside dialog. */}
        </>
    );
}

export default AllFormData;




