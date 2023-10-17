import { Button, Grid, Link, Paper, TextField, Typography } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ForgetPasswordService } from '../services/forgetPassword.service';
import { toast } from 'react-toastify';
import { UpdatePassword } from '../services/updatePassword.service';

function ForgetPassword() {
    const navigate = useNavigate();
    const { token } = useParams();
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const sendOTP = async () => {
        const response = await ForgetPasswordService(userEmail);
        if (response.data.success === true) {
            toast.success("Please check your email id");
        } else {
            toast.success("Try again");
        }
    }

    const updatePassword = async () => {
        if (password !== confirmPassword) {
            toast.error('Password not matching');
            return;
        }
        if (password.length < 3) {
            toast.error("Password too short");
            return;
        }
        const response = await UpdatePassword(password, token);
        if (response.data.success) {
            toast.success("Password updated successfully");
            navigate('/login')
        }
    }
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: "80px"
            }}
        >
            <Container component="main" maxWidth="sm">
                <Box>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12}>
                            <Paper elevation={5} style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: "center", flexDirection: "column" }}>
                                    <Typography component="h1" variant="h5" sx={{ fontFamily: "roboto" }}>
                                        Forget Password
                                    </Typography>
                                </div>
                                {
                                    token == undefined ?
                                        <>
                                            <Box component="form">
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    id="email"
                                                    label={<span style={{ fontFamily: "roboto" }}>Email</span>}
                                                    name="email"
                                                    autoFocus
                                                    onChange={(e) => setUserEmail(e.target.value)}
                                                    InputProps={{
                                                        inputProps: {
                                                            style: {
                                                                fontFamily: 'roboto',  // Change the font family for the input text
                                                            }
                                                        },
                                                    }}
                                                />
                                            </Box>
                                            <Grid container>
                                                <Grid item xs>
                                                    <Button onClick={sendOTP} sx={{ fontFamily: "roboto" }}>Send OTP</Button>
                                                </Grid>
                                            </Grid>

                                        </> :
                                        <>
                                            <Box component="form">
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    label="New Password"
                                                    name="email"
                                                    autoFocus
                                                    type='password'
                                                    onChange={(e) => {
                                                        setPassword(e.target.value);
                                                    }}
                                                />
                                            </Box>
                                            <Box component="form">
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    label=" Confirm Password"
                                                    autoFocus
                                                    onChange={(e) => {
                                                        setConfirmPassword(e.target.value);
                                                    }}
                                                />
                                            </Box>
                                            <Grid container>
                                                <Grid item xs>
                                                    <Button onClick={updatePassword}>
                                                        Update Password
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </>
                                }
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </div>
    )
}

export default ForgetPassword