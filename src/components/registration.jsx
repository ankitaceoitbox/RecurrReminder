import { Avatar, Button, CssBaseline, Grid, TextField, Typography, Paper, CircularProgress } from '@mui/material';
import { Box, Container } from '@mui/system';
import * as React from 'react';
import { UserRegister } from '../services/register.service';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import './sidenavbar.css';
import { isValidEmail } from '../utility/validations';
function RegistrationForm() {
    const navigate = useNavigate();
    const [emailInvalid, setEmailInvalid] = React.useState(false);
    const [showLoader, setShowLoader] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        companyName: '',
        contactNo: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowLoader(true);
        try {
            const response = await UserRegister(formData);
            toast.success('User registered successfully.', {
                position: 'top-right',
                autoClose: 3000, // Time in milliseconds for the notification to automatically close
            });
            navigate('/login');
        } catch (error) {
            toast.error('Registration failed. Please try again.', {
                position: 'top-right',
                autoClose: 3000, // Time in milliseconds for the notification to automatically close
            });
            setError('Registration failed. Please try again.'); // Handle registration error
        }
        setShowLoader(false);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                boxSizing: "border-box",
                alignItems: "center",
            }}
            className="registration-form"
        >
            <Container component="main" sx={{ marginTop: "60px" }}>
                <Box>
                    <Grid container sx={{ display: "flex", justifyContent: "center" }}>
                        <Grid item xs={12} sm={12} md={6} sx={{ alignItems: "center", mt: "auto" }}>
                            <Paper elevation={5} sx={{
                                padding: '20px', background: "transparent",
                                boxShadow: "rgb(204 227 238) 1px 1px 20px 4px",
                                boxSizing: "border-box",
                            }}>
                                <div style={{ display: 'flex', alignItems: "center", flexDirection: "column", marginBottom: "12px" }}>
                                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                        <PersonAddIcon />
                                    </Avatar>
                                    <Typography component="h1" variant="h5" style={{ color: "", fontFamily: "roboto" }}>
                                        Sign up
                                    </Typography>
                                </div>
                                <Box component="form" noValidate onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                autoComplete="given-name"
                                                name="firstName"
                                                required
                                                fullWidth
                                                id="firstName"
                                                label={<span style={{ fontFamily: "roboto" }}>First Name</span>}
                                                autoFocus
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                    inputProps: {
                                                        style: {
                                                            fontFamily: 'roboto',  // Change the font family for the input text
                                                        }
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="lastName"
                                                label={<span style={{ fontFamily: "roboto" }}>Last Name</span>}
                                                name="lastName"
                                                autoComplete="family-name"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                    inputProps: {
                                                        style: {
                                                            fontFamily: 'roboto',  // Change the font family for the input text
                                                        }
                                                    },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="contactNo"
                                                label={<span style={{ fontFamily: "roboto" }}>Contact No.</span>}
                                                name="contactNo"
                                                autoComplete="tel"
                                                value={formData.contactNo}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                    inputProps: {
                                                        style: {
                                                            fontFamily: 'roboto',  // Change the font family for the input text
                                                        }
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="email"
                                                label={<span style={{ fontFamily: "roboto" }}>Email Address</span>}
                                                name="email"
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={(e) => {
                                                    const response = isValidEmail(e.target.value);
                                                    if (response === false) {
                                                        setEmailInvalid(true);
                                                    } else {
                                                        setEmailInvalid(false);
                                                    }
                                                    handleInputChange(e);
                                                }}
                                                helperText={emailInvalid ? <span style={{ color: "red" }}>Invalid Email Id</span> : ''}
                                                InputProps={{
                                                    inputProps: {
                                                        style: {
                                                            fontFamily: 'roboto',  // Change the font family for the input text
                                                        }
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="company"
                                                label={<span style={{ fontFamily: "roboto" }}>Company Name</span>}
                                                name="companyName"
                                                autoComplete="company-name"
                                                value={formData.companyName}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                    inputProps: {
                                                        style: {
                                                            fontFamily: 'roboto',  // Change the font family for the input text
                                                        }
                                                    },
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="password"
                                                label={<span style={{ fontFamily: "roboto" }}>Password</span>}
                                                type="password"
                                                id="password"
                                                autoComplete="new-password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                InputProps={{
                                                    inputProps: {
                                                        style: {
                                                            fontFamily: 'roboto',  // Change the font family for the input text
                                                        }
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    {error && (
                                        <Typography variant="body2" color="error" sx={{ fontFamily: "roboto" }}>
                                            {error}
                                        </Typography>
                                    )}
                                    {
                                        showLoader === false ?
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2 }}
                                                style={{ background: "rgb(93 167 199)", color: "white", fontFamily: "roboto" }}
                                            >
                                                Sign Up
                                            </Button>
                                            :
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <CircularProgress color="primary" size={50} thickness={4} />
                                            </div>
                                    }
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <Link href="#" variant="body2" to="/login" style={{ fontFamily: "roboto" }} >
                                                Already have an account? Sign in
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </div >
    );
}

export default RegistrationForm;
