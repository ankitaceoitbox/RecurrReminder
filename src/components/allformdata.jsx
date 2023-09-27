import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, TableCell, createTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { loginSubject } from './login';
import { useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import ContactForm from './contactform';
import './allformdata.css';
import { UpdateSingleUserForm } from '../services/updateForm.service';
import { toast } from 'react-toastify';
const theme = createTheme(); // Create a theme

function AllFormData({ allData, onDeleteFormDataById, onHandleUpdateForm, onLoadFormDataAgain }) {
    // Check if the screen size is small (mobile)
    const [allFormData, setAllFormData] = React.useState([]);
    const [editRowID, setEditRowID] = React.useState();
    const [formData, setFormData] = React.useState({
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
            skipHolidays: false,
            sendTime: null,
            name: '',
            company: '',
            endsOnDate: null,
        },
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
        console.log(allData);
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
            commonFields: {
                ...prevFormData.commonFields,
                startDate: editedData.startDate,
                day: editedData.day,
                every: editedData.every,
                frequency: editedData.frequency,
                skipHolidays: editedData.skipHolidays,
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
                                onClick={() => handleEditClick(params.row.id, params.row._id)} />
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
        { field: 'day', headerName: 'Week Day', width: 100 },
        { field: 'every', headerName: 'Every (day/week/month/year)', width: 200 },
        { field: 'frequency', headerName: 'Frequency', width: 200 },
        { field: 'skipholidays', headerName: 'Skipped Holidays', width: 200 },
        { field: 'sendtime', headerName: 'Send Time', width: 150 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'company', headerName: 'Company', width: 150 },
        { field: 'isActiveWA', headerName: 'WhatsApp Activate', width: 150 },
        { field: 'waMessage', headerName: 'WhatsApp Message', width: 150 },
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
                                <span>,</span>
                            </div>
                        ))}
                    </TableCell>
                );
            }
        },
        { field: 'mobile', headerName: 'WhatsApp Phone', width: 150 },
        { field: 'isActiveEmail', headerName: 'Email Activate', width: 150 },
        { field: 'email', headerName: 'Email ID', width: 150 },
        { field: 'cc', headerName: 'Email Cc', width: 150 },
        { field: 'bcc', headerName: 'Email Bcc', width: 150 },
        { field: 'emailSubject', headerName: 'Email Subject', width: 150 },
        { field: 'emailBody', headerName: 'Email Body', width: 150 },
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
                                <span>,</span>
                            </div>
                        ))}
                    </TableCell>
                );
            }
        },
        { field: 'endDate', headerName: 'End Date', width: 150 },
        { field: '_id', headerName: 'Unique Id', width: 100 },
    ];

    const rows = allFormData.map((item, index) => ({
        id: index,
        startDate: formatDateToIndianTime(item.startDate),
        day: item.day,
        every: item.every,
        frequency: item.frequency,
        skipholidays: item.skipHolidays,
        sendtime: item.sendTime,
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
        endDate: formatDateToIndianTime(item.endDate),
        _id: item._id,
    }));

    const handleDelete = async (_id) => {
        onDeleteFormDataById(_id);
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
                        onHandleContactFormSubmit={handleContactFormSubmit}
                        marginTop="0px"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            {/* End of edit the data inside dialog. */}
        </>
    );
}

export default AllFormData;




