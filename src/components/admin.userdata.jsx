import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import React, { useEffect, useState } from 'react'
import { loginSubject } from './login';
import { AdminUsersDataService } from '../services/admin_userdata.service';
import { Checkbox, FormControl, Grid, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Loader from './loader';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './adminuserdata.css';
import { ApproveAdminService } from '../services/adminapprove.service';
import { UpdateRoleService } from '../services/adminrole.service';

function AdminUsersData() {
    const [usersData, setUsersData] = useState([]);
    const [loader, setLoader] = useState(false);
    const [rows, setRows] = useState([]);
    const [changesMade, setChangesMade] = useState(false);
    const [enabledRowId, setEnabledRowId] = useState(null); // To store the ID of the row for which the Save button should be enabled

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
    const columns = [
        {
            field: 'save',
            headerName: 'Update',
            width: 100,
            renderCell: (params) => params.value,
            headerClassName: 'centered-header',
            cellClassName: 'centered-cell',
        },
        { field: '_id', headerName: 'ID', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'name', headerName: 'Name', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header', fontSize: "5rem" },
        { field: 'email', headerName: 'Email', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'contact', headerName: 'Contact', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'company', headerName: 'Company Name', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'reminderCount', headerName: 'Reminder Count', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        {
            field: 'role',
            headerName: 'Role',
            width: 250,
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
                                // const updatedData = usersData.map(item => (item._id === id ? { ...item, role: e.target.value } : item));
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
            width: 250,
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
        try {
            const response = await ApproveAdminService(approveAdmin);
            console.log(response);
        } catch (e) { console.log(e); }
        try {
            const response = await UpdateRoleService(roleChange);
            console.log(response);
        } catch (e) { console.log(e); }

    };

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
                    <IconButton onClick={() => handleSave(item._id)} disabled={enabledRowId !== item._id}>
                        <SaveIcon />
                    </IconButton>
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

    return <>
        <div style={{ marginTop: "60px" }}>
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