import React, { useEffect, useState } from 'react'
import { loginSubject } from './login';
import { AdminUsersDataService } from '../services/admin_userdata.service';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Loader from './loader';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './adminuserdata.css';

function AdminUsersData() {
    const [usersData, setUsersData] = useState([]);
    const [loader, setLoader] = useState(false);

    const getAllUsersData = async (name, email) => {
        setLoader(true);
        try {
            const response = await AdminUsersDataService(name, email);
            console.log(response);
            if (response.data.success) {
                setUsersData(response.data.users);
            }
        } catch (e) { }
        setLoader(false);
    }
    const columns = [
        { field: '_id', headerName: 'ID', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'name', headerName: 'Name', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header', fontSize: "5rem" },
        { field: 'email', headerName: 'Email', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'reminderCount', headerName: 'Reminder Count', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'role', headerName: 'Role', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'approve', headerName: 'Approve Status', width: 250, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
    ]
    const rows = usersData.map((item, index) => {
        return {
            id: item._id,
            name: item.name,
            email: item.email,
            reminderCount: item.reminderCount,
            role: item.role,
            approve: item.apprve
        }
    });
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

    return <>
        <div style={{ marginTop: "60px" }}>
            <Grid container spacing={1} >
                <Grid item xs={12} sm={11.5} md={10} sx={{
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