import { Avatar, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import * as React from 'react';
import { UserLogin } from '../services/login.service';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { Subject } from 'rxjs';
import LockIcon from '@mui/icons-material/Lock'
import { AdminLogin } from '../services/adminlogin.service';
import './global.css';
import { ClassNames } from '@emotion/react';



export const loginSubject = new Subject();
function LoginForm() {
    const navigate = useNavigate();
    const [showLoader, setShowLoader] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });
    const [selectAdminOrUser, setSelectOrAdminUser] = React.useState("");

    const [error, setError] = React.useState('');

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
            if (selectAdminOrUser == 'admin') {
                const response = await AdminLogin(formData);
                toast.success('Logged In', {
                    position: 'top-right',
                    autoClose: 3000, // Time in milliseconds for the notification to automatically close
                });
                localStorage.setItem('isAdminAuth', true);
                loginSubject.next({ isAdminAuth: true });
                navigate('/admin/userdata');
            } else if (selectAdminOrUser == 'user') {
                const response = await UserLogin(formData);
                toast.success('Logged In', {
                    position: 'top-right',
                    autoClose: 3000, // Time in milliseconds for the notification to automatically close
                });
                localStorage.setItem('isAuth', true);
                loginSubject.next({ isAuth: true });
                navigate('/');
            } else {
                setShowLoader(false);
                toast.error("Please select user or admin.");
            }
        } catch (error) {
            setShowLoader(false);
            toast.error('Invalid email or password', {
                position: 'top-right',
                autoClose: 2000, // Time in milliseconds for the notification to automatically close
            });
            setError('Invalid email or password'); // Handle authentication error
        }
    };

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
                className="login-form"
            >
                <Container component="main" maxWidth="sm">
                    <Box>
                        <Grid container>
                            <Grid item xs={12} sm={12} md={12}>
                                <Paper elevation={5} style={{
                                    padding: '20px', marginTop: "165px", background: "transparent",
                                    border: "1px solid rgb(180 180 180)",
                                    boxShadow: "rgb(180 180 180) 1px 1px 14px 1px"
                                }}>
                                    <div style={{ display: 'flex', alignItems: "center", flexDirection: "column" }}>
                                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                            <LockIcon />
                                        </Avatar>
                                        <Typography component="h1" variant="h5" style={{ color: "rgb(180 180 180)" }}>
                                            Sign in
                                        </Typography>
                                    </div>
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            aria-label="login"
                                            name="login"
                                            sx={{ display: 'flex', flexDirection: 'row' }} // Apply styles using sx prop
                                            onChange={(e) => {
                                                setSelectOrAdminUser(e.target.value);
                                            }}

                                        >
                                            <FormControlLabel value="admin" control={<Radio sx={{ color: '#97d19a', "& .Mui-checked": { background: "#97d19a" } }} />} label="Admin"
                                                style={{ color: "rgb(180 180 180)" }}

                                            />
                                            <FormControlLabel value="user" control={<Radio sx={{ color: '#97d19a', "& .Mui-checked": { background: "#97d19a" } }} />}
                                                label="User" style={{ color: "rgb(180 180 180)" }} />
                                        </RadioGroup>
                                    </FormControl>
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
                                            sx={{
                                                "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                                "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "rgb(180 180 180)",
                                                    },
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "& input": {
                                                        color: 'ghostwhite',
                                                    },
                                                },
                                                "& label.MuiInputLabel-root": {
                                                    color: 'rgb(180 180 180)', // Specify label color
                                                },
                                            }}
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
                                                }
                                            }}
                                            sx={{
                                                "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                                "& .MuiOutlinedInput-root": {
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "rgb(180 180 180)",
                                                    },
                                                    "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                                    "& input": {
                                                        color: 'ghostwhite',
                                                    },
                                                },
                                                "& label.MuiInputLabel-root": {
                                                    color: 'rgb(180 180 180)', // Specify label color
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
                                                    style={{ background: "rgb(180 180 180)", color: "black" }}
                                                >
                                                    Log In
                                                </Button>
                                        }

                                        <Grid container>
                                            <Grid item xs>
                                                <Link href="#" variant="body2" to="/reset-password/" style={{ color: "rgb(180 180 180)" }}>
                                                    Forgot password?
                                                </Link>
                                            </Grid>
                                            <Grid item>
                                                <Link href="#" variant="body2" to="/register" style={{ color: "rgb(180 180 180)" }}>
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
