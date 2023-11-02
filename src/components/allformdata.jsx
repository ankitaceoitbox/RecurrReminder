import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, TableCell } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { loginSubject } from './login';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ContactForm from './contactform';
import './allformdata.css';
import { UpdateSingleUserForm } from '../services/updateForm.service';
import { toast } from 'react-toastify';

function AllFormData({ allData, onDeleteFormDataById, onHandleUpdateForm, onLoadFormDataAgain }) {
    const [allFormData, setAllFormData] = React.useState([]);
    const [editRowID, setEditRowID] = React.useState();
    const [formData, setFormData] = React.useState({
        name: "",
        company: '',
        startDate: null,
        day: '',
        every: '',
        frequency: '',
        isActiveEmail: false,
        isActiveWA: false,
        endsOnObject: {
            occurence: 0,
            date: null,
            never: "never",
        },
        month: {
            date: null,
            day: "",
        },
        week: {
            days: []
        },
        sendTime: null,
        skipHolidays: false,
        sendWADate: null,
        mobileOrGroupID: '',
        waMessage: '',
        waAttachment: [],
        emailIDTo: '',
        emailIDCc: '',
        emailIDBCc: '',
        subjectLine: '',
        emailAttachment: [],
        mailBodyHTML: '',
        sendMailDate: null,
        /** ends of form data states */
    });
    const [editRowIndex, setEditRowIndex] = React.useState(-1);
    const [openEditDialog, setOpenEditDialog] = React.useState(false);
    const [openViewDialog, setOpenViewDialog] = React.useState(false);
    const [viewData, setViewData] = React.useState({});

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

    const handleSaveChanges = (formData) => {
        setEditRowIndex(-1);
    };

    const handleContactFormSubmit = async (formData) => {
        const response = await UpdateSingleUserForm(formData, editRowID);
        if (response.data.success === true) {
            toast.success('Form Updated Successfully.', {
                position: 'top-right',
                autoClose: 3000, // Time in milliseconds for the notification to automatically close
            });
            onLoadFormDataAgain();
        } else {
            toast.error('Form not updated.', {
                position: 'top-right',
                autoClose: 3000, // Time in milliseconds for the notification to automatically close
            });
        }
        setEditRowIndex(-1);
        return 1;
    }

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px', // Adjust the gap between each grid item
        padding: '5px', // Adjust the padding inside the Paper component
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

    const handleEditClick = (index, _id) => {
        setOpenEditDialog(true);
        setEditRowIndex(index);
        setEditRowID(_id);
        const editedData = { ...allFormData[index] };
        setFormData((prevFormData) => ({
            ...prevFormData,
            name: editedData.name,
            company: editedData.company,
            startDate: editedData.startDate,
            day: editedData.day,
            every: editedData.every,
            frequency: editedData.frequency,
            isActiveEmail: editedData.isActiveEmail,
            isActiveWA: editedData.isActiveWA,
            endsOnObject: {
                occurence: editedData?.endDate?.occurence,
                date: editedData?.endDate?.date,
                never: editedData?.endDate?.never,
            },
            month: {
                date: editedData?.month?.date,
                day: editedData?.month?.day,
            },
            week: {
                days: editedData?.week?.days
            },
            sendTime: editedData.sendTime,
            skipHolidays: editedData.skipHolidays,
            sendWADate: editedData.sendWADate,
            mobileOrGroupID: editedData.mobile,
            waMessage: editedData.waMessage,
            waAttachment: editedData.WaAttachement,
            emailIDTo: editedData.email,
            emailIDCc: editedData.cc,
            emailIDBCc: editedData.bcc,
            subjectLine: editedData.emailSubject,
            emailAttachment: editedData.emailAttachments,
            mailBodyHTML: editedData.emailBody,
            sendMailDate: editedData.sendMailDate,
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
            field: 'View',
            width: 30,
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
            },
            cellClassName: 'centered-cell',
        },
        {
            field: 'Edit',
            width: 30,
            sortable: false,
            filterable: false,
            toolbar: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return (
                    <TableCell>
                        <EditIcon
                            sx={{ fontSize: "18px" }}
                            onClick={() => handleEditClick(params.row.id, params.row._id)}
                        />
                    </TableCell>
                );
            },
            cellClassName: 'centered-cell',
        },
        {
            field: 'Delete',
            width: 30,
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
            },
            cellClassName: 'centered-cell',
        },
        {
            field: 'id', headerName: 'ID', width: 70, headerClassName: "header-bg-color", cellClassName: 'centered-cell',
        },
        { field: 'startDate', headerName: 'Start Date', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        // { field: 'day', headerName: 'Week Day', width: 100, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'every', headerName: 'Every (day/week/month/year)', width: 200, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'repeatson', headerName: 'Selected Week', width: 200, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'month', headerName: 'Month', width: 200, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'frequency', headerName: 'Frequency', width: 200, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'skipholidays', headerName: 'Skipped Holidays', width: 200, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'sendtime', headerName: 'Send Time', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'lastreminder', headerName: 'Last Reminder Date', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'name', headerName: 'Name', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'company', headerName: 'Company', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'isActiveWA', headerName: 'WhatsApp Activate', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'waMessage', headerName: 'WhatsApp Message', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        {
            field: 'WaAttachement',
            headerName: 'Whatsapp Attachments',
            width: 200,
            renderCell: (params) => {
                const attachmentUrls = params.value || [];
                return (
                    <TableCell>
                        {attachmentUrls.map((url, index) => (
                            <div key={index}>
                                <a href={url} target="_blank">
                                    Click Here
                                </a>
                                {
                                    index < attachmentUrls.length - 1 ? <span>,</span> : <></>
                                }
                            </div>
                        ))}
                    </TableCell>
                );
            },
            cellClassName: 'centered-cell',
            headerClassName: 'centered-header'
        },
        { field: 'mobile', headerName: 'WhatsApp Phone', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'isActiveEmail', headerName: 'Email Activate', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'email', headerName: 'Email ID', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'cc', headerName: 'Email Cc', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'bcc', headerName: 'Email Bcc', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'emailSubject', headerName: 'Email Subject', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'emailBody', headerName: 'Email Body', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        {
            field: 'emailAttachment',
            headerName: 'Email Attachment',
            width: 200,
            renderCell: (params) => {
                const attachmentUrls = params.value || [];
                return (
                    <TableCell>
                        {attachmentUrls.map((url, index) => (
                            <div key={index}>
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    Click Here
                                </a>
                                {
                                    index < attachmentUrls.length - 1 ? <span>,</span> : <></>
                                }
                            </div>
                        ))}
                    </TableCell>
                );
            },
            cellClassName: 'centered-cell',
            headerClassName: 'centered-header'
        },
        { field: 'endDate', headerName: 'End Date', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: '_id', headerName: 'Unique Id', width: 100, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
    ];
    console.log(allFormData)
    const rows = allFormData.map((item, index) => {
        let lastReminder = "";
        if (item.lastReminder) {
            lastReminder = formatDateToIndianTime(item.lastReminder);
        }
        let formattedEndDate = '';
        if (item.endDate) {
            formattedEndDate = (() => {
                if (item.endDate?.date) {
                    return `DATE - ${formatDateToIndianTime(item.endDate.date)}`;
                } else if (item.endDate?.occurence > 0) {
                    return `OCCURENCE - ${item.endDate?.occurence}`;
                } else if (item.endDate?.never === 'never') {
                    return 'NEVER';
                } else {
                    return '';
                }
            })();
        }
        let formattedMonth = '';
        if (item.month) {
            formattedMonth = (() => {
                if (item.month.date) {
                    return item.month.date;
                } else if (item.month.day) {
                    return item.month.day;
                }
            })();
        }
        return {
            id: index,
            startDate: formatDateToIndianTime(item.startDate),
            // day: item.day,
            every: item.every,
            repeatson: item?.week?.days.join(",") ?? '',
            month: formattedMonth,
            frequency: item.frequency,
            skipholidays: item.skipHolidays,
            sendtime: item.sendTime,
            lastreminder: lastReminder,
            name: item.name,
            company: item.company,
            isActiveWA: String(item.isActiveWA),
            waMessage: item.waMessage,
            WaAttachement: item.WaAttachement,
            mobile: item.mobile,
            isActiveEmail: item.isActiveEmail,
            email: item.email,
            cc: item.cc?.join(','),
            bcc: item.bcc?.join(','),
            emailSubject: item.emailSubject,
            emailBody: item.emailBody,
            emailAttachment: item.emailAttachments,
            endDate: formattedEndDate,
            _id: item._id,
        }
    });

    const handleDelete = async (_id) => {
        onDeleteFormDataById(_id);
    }

    const formateMonthDate = (month) => {
        let formattedMonth = '';
        if (month) {
            formattedMonth = (() => {
                if (month.date) {
                    return month.date;
                } else if (month.day) {
                    return month.day;
                }
            })();
        }
        return formattedMonth;
    }

    const formateEndDate = (endDate) => {
        if (endDate?.date) {
            return `DATE - ${formatDateToIndianTime(endDate?.date)}`;
        } else if (endDate?.occurence > 0) {
            return `OCCURENCE - ${endDate?.occurence}`;
        } else if (endDate?.never === 'never') {
            return 'NEVER';
        } else {
            return '';
        }
    }

    const ClickHereLinks = ({ links }) => {
        return <>
            {
                links.map((link, index) => {
                    if (index === links.length - 1) {
                        return <span><a href={link}>Click Here</a></span>;
                    }
                    return <><span><a href={link}>Click Here</a></span><span>,</span></>
                })
            }
        </>
    }

    return (
        <>
            <Grid
                container
                spacing={1}
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
                            style={{ fontFamily: "roboto", overflow: "auto", height: "85vh" }}
                            slots={{
                                toolbar: GridToolbar,
                            }}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                        _id: false,
                                    },
                                },
                            }}
                            stickyHeader
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
                                            <div style={{ fontFamily: "roboto" }}>Name</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.name}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Company</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.company}</div>

                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Day</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.day}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Start Date</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{formatDateToIndianTime(viewData.startDate)}</div>
                                        </Grid>
                                    </Grid>

                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Every</div>
                                        </Grid>
                                        <Grid xs={6} item>

                                            <div className="view-data">{viewData.every}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Repeats On</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData?.week?.days.join(",") ?? ''}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Month</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{formateMonthDate(viewData?.month)}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Frequency</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.frequency}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Skip Holidays</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{String(viewData.skipHolidays)}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Whatsapp Message</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{String(viewData.waMessage)}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Ends On</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{formateEndDate(viewData.endDate)}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Send Time</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.sendTime}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>WhatsApp Phone</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.mobile}</div>
                                        </Grid>
                                    </Grid>

                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Email</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.email}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>cc</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.cc?.join(",")}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>bcc</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.bcc?.join(",")}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item><div style={{ fontFamily: "roboto" }}>Email Subject</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.emailSubject}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Email Body</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.emailBody}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>Email Attachments</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{<ClickHereLinks links={viewData.emailAttachments ?? []} />}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>WhatsApp Message</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{viewData.waMessage}</div>
                                        </Grid>
                                    </Grid>
                                    <Grid container className='view-dialog-grid-container' style={itemStyle}>
                                        <Grid xs={6} item>
                                            <div style={{ fontFamily: "roboto" }}>WhatsApp Attachements</div>
                                        </Grid>
                                        <Grid xs={6} item>
                                            <div className="view-data">{<ClickHereLinks links={viewData.WaAttachement ?? []} />}</div>
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
                <DialogTitle><span style={{ fontFamily: "roboto" }}>Edit Data</span></DialogTitle>
                <DialogContent>
                    <ContactForm
                        width="100%"
                        autoFillData={formData}
                        onHandleContactFormSubmit={handleContactFormSubmit}
                        marginTop="0px"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)} sx={{ fontFamily: "roboto" }}>Close</Button>
                </DialogActions>
            </Dialog>
            {/* End of edit the data inside dialog. */}
        </>
    );
}

export default AllFormData;