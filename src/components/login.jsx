import { Avatar, Button, CircularProgress, Grid, Paper, TextField, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import * as React from 'react';
import { UserLogin } from '../services/login.service';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Subject } from 'rxjs';
import LockIcon from '@mui/icons-material/Lock';

export const loginSubject = new Subject();
function LoginForm() {
    const navigate = useNavigate();
    const [showLoader, setShowLoader] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });

    const [error, setError] = React.useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const userLogin = async () => {
        try {
            setShowLoader(true);
            const response = await UserLogin(formData);
            toast.success('Logged In', {
                position: 'top-right',
                autoClose: 3000, // Time in milliseconds for the notification to automatically close
            });
            localStorage.setItem('isAuth', true);
            loginSubject.next({ isAuth: true });
            navigate('/');
        } catch (error) {
            setShowLoader(false);
            toast.error('Invalid email or password', {
                position: 'top-right',
                autoClose: 2000, // Time in milliseconds for the notification to automatically close
            });
            setError('Invalid email or password'); // Handle authentication error
        }
    };

    React.useEffect(() => {
        console.log(showLoader)
    }, [])

    return (
        <>
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
                                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                            <LockIcon />
                                        </Avatar>
                                        <Typography component="h1" variant="h5" >
                                            Sign in
                                        </Typography>
                                    </div>
                                    <Box component="form">
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            autoFocus
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            inputProps={{
                                                autoComplete: 'new-password',
                                                form: {
                                                    autoComplete: 'off',
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
                                                >
                                                    Log In
                                                </Button>
                                        }
                                        <Link style={{ color: "#444" }} to="/forgetpassword">Forget Password</Link>
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
