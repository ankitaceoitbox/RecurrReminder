import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import React, { useEffect, useState } from 'react'
import { loginSubject } from './login';
import { AdminUsersDataService } from '../services/admin_userdata.service';
import { Button, Checkbox, FormControl, Grid, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Loader from './loader';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './adminuserdata.css';
import { ApproveAdminService } from '../services/adminapprove.service';
import { UpdateRoleService } from '../services/adminrole.service';
import { toast } from 'react-toastify';
import { RemoveUserFromAdminTable } from '../services/deleteuserfromadmintable.service';

function AdminUsersData() {
    const [usersData, setUsersData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [rows, setRows] = useState([]);
    const [changesMade, setChangesMade] = useState(false);
    const [enabledRowId, setEnabledRowId] = useState(null); // To store the ID of the row for which the Save button should be enabled
    const [columns, setColumns] = useState([]);

    const getAllUsersData = async (name, email) => {
        setLoader(true);
        try {
            const response = await AdminUsersDataService(name, email);
            if (response.data.success) {
                setUsersData(response.data.users);
            }
        } catch (e) { }
        setLoader(false);
    }

    // Function to handle save action
    const handleSave = async (id) => {
        // Perform save action for the specified ID
        setChangesMade(false); // Reset changesMade state after saving
        setEnabledRowId(null); // Disable Save button after saving
        const changed = usersData.find(user => user._id === id);
        const approveAdmin = {
            id,
            approve: changed.apprve
        };
        const roleChange = {
            id,
            role: changed.role
        };
        let check = false;
        try {
            const response = await ApproveAdminService(approveAdmin);
            if (response.data.success === true) {
                check = true;
            }
        } catch (e) {
            console.log(e); toast.error('User approved status not updated', {
                position: 'top-right',
                autoClose: 3000, // Time in milliseconds for the notification to automatically close
            });
        }
        try {
            const response = await UpdateRoleService(roleChange);
            if (response.data.success === true) {
                check = true;
            }
            console.log(response);
        } catch (e) { console.log(e); }

        if (check === true) {
            toast.success('Updated successfully', {
                position: 'top-right',
                autoClose: 3000, // Time in milliseconds for the notification to automatically close
            });
        } else {
            toast.error('Oops try again later', {
                position: 'top-right',
                autoClose: 3000, // Time in milliseconds for the notification to automatically close
            });
        }
    };

    const refreshdata = async () => {
        await getAllUsersData();
    }

    const handleDelete = async (id) => {
        try {
            const response = await RemoveUserFromAdminTable(id);
            loginSubject.next({
                isAdminAuth: true
            });
            (
                async () => {
                    await getAllUsersData();
                }
            )();
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        loginSubject.next({
            isAdminAuth: true
        });
        (
            async () => {
                await getAllUsersData();
            }
        )();
    }, []);

    useEffect(() => {
        const rows = usersData.map((item) => {
            return {
                save: (
                    <>
                        <IconButton onClick={() => handleSave(item._id)} disabled={enabledRowId !== item._id}>
                            <SaveIcon sx={{ color: enabledRowId === item._id ? "#308e07" : '' }} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(item._id)}>
                            <DeleteIcon sx={{ color: "#df4242" }} />
                        </IconButton>
                    </>
                ),
                id: item._id,
                name: item.name,
                email: item.email,
                contact: item?.contact,
                company: item?.company,
                reminderCount: item.reminderCount,
                role: item.role,
                approve: item.apprve,
            }
        });
        setRows(rows);
    }, [usersData, changesMade]);

    useEffect(() => {
        const columns = [
            {
                field: 'save',
                headerName: 'Save/Delete',
                width: 120,
                renderCell: (params) => params.value,
                headerClassName: 'centered-header',
                cellClassName: 'centered-cell',
            },
            { field: '_id', headerName: 'ID', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
            { field: 'name', headerName: 'Name', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header', fontSize: "5rem" },
            { field: 'email', headerName: 'Email', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
            { field: 'contact', headerName: 'Contact', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
            { field: 'company', headerName: 'Company Name', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
            { field: 'reminderCount', headerName: 'Reminder Count', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
            {
                field: 'role',
                headerName: 'Role',
                width: 150,
                renderCell: (params) => (
                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                        <Select
                            value={params.value}
                            onChange={(e) => {
                                setChangesMade(true);
                                setEnabledRowId(params.row.id); // Enable Save button for this row
                                const updatedData = usersData.map((item) => {
                                    return item._id === params.row.id ? { ...item, role: e.target.value } : item
                                }
                                );
                                setUsersData([...updatedData]);
                            }}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                ),
                cellClassName: 'centered-cell', headerClassName: 'centered-header'
            },
            {
                field: 'approve',
                headerName: 'Approve Status',
                width: 150,
                renderCell: (params) => (
                    <Checkbox
                        checked={params.value}
                        onChange={(e) => {
                            setChangesMade(true);
                            setEnabledRowId(params.row.id); // Enable Save button for this row
                            const updatedData = usersData.map((item) => {
                                return item._id === params.row.id ? { ...item, apprve: e.target.checked } : item
                            }
                            );
                            setUsersData([...updatedData]);
                        }}
                    />
                ),
                cellClassName: 'centered-cell', headerClassName: 'centered-header'
            },
        ];
        setColumns(columns);
    });

    return <>
        <div style={{ marginTop: "60px" }}>
            <Button onClick={refreshdata}>Refresh</Button>
            <Grid container spacing={1} >
                <Grid item xs={12} sm={11.5} md={11} sx={{
                    ml: "auto", mr: "auto", mt: "20px"
                }}>
                    <Paper elevation={10} sx={{ padding: "10px" }}>
                        <DataGrid
                            disableSelectionOnClick={true}
                            rows={rows}
                            columns={columns}
                            pageSize={5}
                            className="header-bg-color"
                            style={{ fontFamily: "roboto" }}
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
        </div>
        {
            loader ? <Loader /> : <></>
        }
    </>
}

export default AdminUsersData