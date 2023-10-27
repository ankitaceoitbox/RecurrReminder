import React, { useEffect, useState } from 'react'
import { loginSubject } from './login';
import { AdminUsersDataService } from '../services/admin_userdata.service';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Loader from './loader';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

function AdminUsersData() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [usersData, setUsersData] = useState([]);
    const [loader, setLoader] = useState(false);

    const searchByNameAndEmail = async (name, email) => {
        await getAllUsersData(name, email);
        setName('');
        setEmail('');
    }

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
        { field: 'name', headerName: 'Name', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'email', headerName: 'Email', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
        { field: 'reminderCount', headerName: 'Reminder Count', width: 150, cellClassName: 'centered-cell', headerClassName: 'centered-header' },
    ]
    const rows = usersData.map((item, index) => {
        return {
            id: item._id,
            name: item.name,
            email: item.email,
            reminderCount: item.reminderCount
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