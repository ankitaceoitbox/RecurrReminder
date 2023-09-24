import React, { useEffect, useState } from 'react'
import { loginSubject } from './login';
import { AdminUsersDataService } from '../services/admin_userdata.service';
import { Button, Card, CardContent, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
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
        } catch (e) {

        }
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
            <Grid container spacing={1} justifyContent="center">
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
            <Grid container spacing={2} justifyContent="center">
                {usersData.map(user => (
                    <Grid item key={user._id} xs={12} sm={6} md={3}>
                        <Paper elevation={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {user.name}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        {user.email}
                                    </Typography>
                                    <Typography>
                                        Reminder Count: {user.reminderCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </div>
        {
            loader ? <Loader /> : <></>
        }
    </>
}

export default AdminUsersData