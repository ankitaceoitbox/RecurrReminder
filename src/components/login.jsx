import { Avatar, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import * as React from 'react';
import { UserAdminLogin } from '../services/login.service';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Subject } from 'rxjs';
import LockIcon from '@mui/icons-material/Lock'
import './global.css';

export const loginSubject = new Subject();
function LoginForm() {
    const navigate = useNavigate();
    const [showLoader, setShowLoader] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const userLogin = async () => {
        setShowLoader(true);
        try {
            const response = await UserAdminLogin(formData);
            console.log(response);
            if (response.data.success === true) {
                const { role, approve } = response.data.user;
                if (approve === true) {
                    if (role === "admin") {
                        navigate('/admin/userdata');
                        localStorage.setItem('isAdminAuth', true);
                        loginSubject.next({ isAdminAuth: true });
                    } else {
                        localStorage.setItem('isAuth', true);
                        loginSubject.next({ isAuth: true });
                        navigate('/');
                    }
                    toast.success('Logged In', {
                        position: 'top-right',
                        autoClose: 3000, // Time in milliseconds for the notification to automatically close
                    });
                } else {
                    toast.error('User not approved', {
                        position: 'top-right',
                        autoClose: 3000, // Time in milliseconds for the notification to automatically close
                    });
                }
            }
        } catch (error) {
            setShowLoader(false);
            toast.error('Invalid email or password', {
                position: 'top-right',
                autoClose: 2000, // Time in milliseconds for the notification to automatically close
            });
            console.log(error);
        }
        setShowLoader(false);
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    boxSizing: "border-box",
                    alignItems: "center",
                }}
                className="login-form"
            >
                <Container component="main" sx={{ justifyContent: "center", display: "flex" }}>
                    <Box>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12} sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
                                <Paper elevation={5} sx={{
                                    padding: '20px', background: "transparent",
                                    boxShadow: "rgb(204 227 238) 1px 1px 20px 4px",
                                    boxSizing: "border-box",
                                }}>
                                    <div style={{ display: 'flex', alignItems: "center", flexDirection: "column" }}>
                                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                            <LockIcon />
                                        </Avatar>
                                        <Typography component="h1" variant="h5" style={{ color: "", fontFamily: "roboto" }}>
                                            Sign in
                                        </Typography>
                                    </div>
                                    <Box component="form">
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label={<span style={{ fontFamily: "roboto" }}>Email Address</span>}
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            InputProps={{
                                                inputProps: {
                                                    style: {
                                                        fontFamily: 'roboto',  // Change the font family for the input text
                                                    }
                                                },
                                            }}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label={<span style={{ fontFamily: "roboto" }}>Password</span>}
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            inputProps={{
                                                autoComplete: 'new-password',
                                                form: {
                                                    autoComplete: 'off',
                                                }
                                            }}

                                            InputProps={{
                                                inputProps: {
                                                    style: {
                                                        fontFamily: 'roboto',  // Change the font family for the input text
                                                    }
                                                },
                                            }}
                                        />
                                        {
                                            showLoader === true ?
                                                <>
                                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                                        <CircularProgress color="primary" size={50} thickness={4} />
                                                    </div>
                                                </>
                                                :
                                                <Button
                                                    type="button" // Change to type="submit" if using form submission
                                                    fullWidth
                                                    variant="contained"
                                                    sx={{ mt: 3, mb: 2 }}
                                                    onClick={userLogin}
                                                    style={{ background: "rgb(93 167 199)", color: "white", fontFamily: "roboto" }}
                                                >
                                                    Log In
                                                </Button>
                                        }

                                        <Grid container>
                                            <Grid item xs>
                                                <Link href="#" variant="body2" to="/reset-password/" style={{ color: "", fontFamily: "roboto" }}>
                                                    Forgot password?
                                                </Link>
                                            </Grid>
                                            <Grid item>
                                                <Link href="#" variant="body2" to="/register" style={{ color: "", fontFamily: "roboto" }}>
                                                    {"Don't have an account? Sign Up"}
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </div>
        </>
    );
}

export default LoginForm;
