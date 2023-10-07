import { Avatar, Button, CssBaseline, Grid, TextField, Typography, Paper } from '@mui/material';
import { Box, Container } from '@mui/system';
import * as React from 'react';
import { UserRegister } from '../services/register.service';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import './sidenavbar.css';
function RegistrationForm() {
    const navigate = useNavigate();
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
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: "29px"
            }}
            className="registartionForm"
        >
            <Container component="main" maxWidth="sm">
                <CssBaseline />
                <Paper elevation={6} sx={{
                    padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: "transparent", border: "1px solid rgb(180 180 180)",
                    boxShadow: "rgb(180 180 180) 1px 1px 14px 1px"
                }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <PersonAddIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" style={{ color: "rgb(180 180 180)" }}>
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    sx={{
                                        "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "rgb(180 180 180)",
                                            },
                                            "& input": {
                                                color: 'ghostwhite',
                                            },
                                        },
                                        "& label.MuiInputLabel-root": {
                                            color: 'rgb(180 180 180)', // Specify label color
                                        },

                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    sx={{
                                        "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "rgb(180 180 180)",
                                            },
                                            "& input": {
                                                color: 'ghostwhite',
                                            },
                                        },
                                        "& label.MuiInputLabel-root": {
                                            color: 'rgb(180 180 180)', // Specify label color
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="contactNo"
                                    label="Contact No."
                                    name="contactNo"
                                    autoComplete="tel"
                                    value={formData.contactNo}
                                    onChange={handleInputChange}
                                    sx={{
                                        "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "rgb(180 180 180)",
                                            },
                                            "& input": {
                                                color: 'ghostwhite',
                                            },
                                        },
                                        "& label.MuiInputLabel-root": {
                                            color: 'rgb(180 180 180)', // Specify label color
                                        },

                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    sx={{
                                        "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "rgb(180 180 180)",
                                            },
                                            "& input": {
                                                color: 'ghostwhite',
                                            },
                                        },
                                        "& label.MuiInputLabel-root": {
                                            color: 'rgb(180 180 180)', // Specify label color
                                        },

                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="company"
                                    label="Company Name"
                                    name="companyName"
                                    autoComplete="company-name"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    sx={{
                                        "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "rgb(180 180 180)",
                                            },
                                            "& input": {
                                                color: 'ghostwhite',
                                            },
                                        },
                                        "& label.MuiInputLabel-root": {
                                            color: 'rgb(180 180 180)', // Specify label color
                                        },

                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    sx={{
                                        "& .MuiInputLabel-root": { color: 'rgb(180 180 180)' },
                                        "& .MuiOutlinedInput-root": {
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&:hover fieldset": { borderColor: "rgb(180 180 180)" },
                                            "& > fieldset": { borderColor: "rgb(180 180 180)" },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "rgb(180 180 180)",
                                            },
                                            "& input": {
                                                color: 'ghostwhite',
                                            },
                                        },
                                        "& label.MuiInputLabel-root": {
                                            color: 'rgb(180 180 180)', // Specify label color
                                        },

                                    }}
                                />
                            </Grid>
                        </Grid>
                        {error && (
                            <Typography variant="body2" color="error">
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            style={{ background: "rgb(180 180 180)", color: "black" }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="#" variant="body2" to="/login" style={{ color: "rgb(180 180 180)" }} >
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
}

export default RegistrationForm;
