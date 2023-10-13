import React, { useEffect, useState } from 'react'
import { loginSubject } from './login';
import { AdminUsersDataService } from '../services/admin_userdata.service';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Loader from './loader';

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
                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoFocus
                        size={'small'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="Name"
                        label="Name"
                        name="Name"
                        autoFocus
                        size={'small'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={1} sx={{ mt: 2.1 }}>
                    <Button
                        fullWidth
                        variant='outlined'
                        onClick={() => { searchByNameAndEmail(name, email) }}
                    >
                        Search
                    </Button>                </Grid>
                <Grid item xs={12} sm={6} md={1} sx={{ mt: 2.1 }}>
                    <Button
                        fullWidth
                        variant='outlined'
                        onClick={() => { searchByNameAndEmail('', '') }}
                    >
                        Reset
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={1} >
                <Grid item xs={12} md={11.5} sm={12} >
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Reminder Count</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usersData.map(user => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.reminderCount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
        {
            loader ? <Loader /> : <></>
        }
    </>
}

export default AdminUsersData