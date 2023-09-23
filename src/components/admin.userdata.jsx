import React, { useEffect, useState } from 'react'
import { loginSubject } from './login';
import { AdminUsersDataService } from '../services/admin_userdata.service';
import { Card, CardContent, Grid, Paper, TextField, Typography } from '@mui/material';

function AdminUsersData() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        loginSubject.next({
            isAdminAuth: true
        });
        (
            async () => {
                const response = await AdminUsersDataService();
                console.log(response);
                if (response.data.success) {
                    setUsersData(response.data.users);
                }
            }
        )()
    }, []);

    return <>
        <div style={{ marginTop: "60px" }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="Name"
                        label="Name"
                        name="Name"
                        autoFocus
                    />

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
    </>
}

export default AdminUsersData