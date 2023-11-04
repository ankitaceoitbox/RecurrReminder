import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import AddAlertOutlinedIcon from '@mui/icons-material/AddAlertOutlined';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import SmsSharpIcon from '@mui/icons-material/SmsSharp';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListIcon from '@mui/icons-material/List';
import LoginIcon from '@mui/icons-material/AccountCircle';
import SignUpIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import { loginSubject } from './login';
import { Link, Link as RouterLink } from 'react-router-dom'; // If you're using React Router
import Tooltip from '@mui/material/Tooltip';
import { Button, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import { ExpandLess } from "@mui/icons-material";
import { ExpandMore } from "@mui/icons-material";
import { UploadLogo, getLogo } from '../services/logo.service';
import { toast } from 'react-toastify';
import { Buffer } from 'buffer'
import DateChipsSelector from './multipledateselector';
import WeekdaySelector from './multipleweekselector';
import { AddHolidays } from '../services/addholidays.service';
import TableChartIcon from '@mui/icons-material/TableChart';
import { AdminLogoutService } from '../services/adminlogout.service';
import { useNavigate } from "react-router-dom"
import { SetUpEmailService } from '../services/emailsetup.service';
import { SetUpWhatsappService } from '../services/whatsappsetup.service';
import WhatsAppEmailDetails from './WhatsAppEmailDetails';
import { EmailWhatsAppDetailsService } from '../services/emailWhatsappdetails.service';
import { EmailManualTestingService } from '../services/emailmanualtesting.service';
import { WhatsAppManualTestingService } from '../services/whatsappmanualtesting.service';
import { isValidEmail } from '../utility/validations';
import { UserLogoutService } from '../services/userlogout.service';

const drawerWidth = 250;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),

}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        display: open ? 'block' : 'none',  // Hide when closed
        [theme.breakpoints.down('sm')]: {
            width: '80%',  // Adjust width for smaller screens
        },
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
        [theme.breakpoints.down('sm')]: {
            width: 0,
            '& .MuiDrawer-paper': {
                width: 0,
            },
        },
    }),
);


const ImageDialog = ({ open, onClose, setProfileImage }) => {
    const [imagePreview, setImagePreview] = React.useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.onload = () => {
            if (Reader.readyState === 2) {
                setImagePreview(Reader.result);
            }
        };
        Reader.readAsDataURL(file);
    };

    const uploadLogoHandler = async () => {
        const { data } = await UploadLogo(imagePreview);
        toast.success(data?.message);
        onClose(imagePreview);
    }

    React.useEffect(() => {
        (async () => {
            const { data } = await getLogo()
            setProfileImage(data?.logo?.logo?.data
                ? `data:image/png;base64,${Buffer.from(
                    data?.logo?.logo?.data
                ).toString("base64")}`
                : "https://drive.google.com/uc?export=view&id=1WEptUger6Bqs1OHLN9znAqtF06x9OJRk")
        })()
    }, [])

    return (
        <Dialog open={open} onClose={() => { onClose(); setImagePreview(null); }}>
            <DialogTitle>Change Image</DialogTitle>
            <DialogContent>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ marginBottom: '20px' }}
                />
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ width: '100%', height: 'auto' }}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={uploadLogoHandler} color="primary">
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const HolidaysDialog = ({ open, onClose }) => {
    const [showLoader, setShowLoader] = React.useState(false);
    const [skipDates, setSkipDates] = React.useState([]);
    const [skipDays, setSkipDays] = React.useState([]);
    const [skipDatesSave, setSkipDatesSave] = React.useState([]);
    const [skipDaysSave, setSkipDaysSave] = React.useState([]);

    const handleSelectedDates = (dates) => {
        setSkipDatesSave(dates);
    }

    const handleSelectedWeeks = (weeks) => {
        setSkipDaysSave(weeks);
    }

    const saveHoldiays = async () => {
        setShowLoader(true);
        try {
            const response = await AddHolidays(skipDatesSave, skipDaysSave);
            toast.success('Added Holidays Successfully', {
                position: 'top-right',
                autoClose: 2000, // Time in milliseconds for the notification to automatically close
            });
        } catch (e) {
            toast.error(e, {
                position: 'top-right',
                autoClose: 2000, // Time in milliseconds for the notification to automatically close
            });
        }
        setShowLoader(false);
        onClose();
    }

    React.useEffect(() => {
        (async () => {
            try {
                const response = await EmailWhatsAppDetailsService();
                const data = response.data;
                if (data.success === true) {
                    setSkipDates(data.user.skipDates);
                    setSkipDays(data.user.skipDays);
                }
            } catch (e) { }
        })();
    }, []);
    return <>
        <Dialog
            open={open}
            onClose={() => { onClose(); }}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle><span style={{ fontFamily: "roboto" }}>Add Dates/Weekdays</span></DialogTitle>
            <DialogContent>
                <Typography component={"div"} sx={{ display: "flex", flexDirection: "column", alignContent: "center", gap: 2 }}>
                    <Typography component={"div"}>
                        <DateChipsSelector
                            onHandleSelectedDates={handleSelectedDates}
                            preSelectedDates={skipDates}
                        />
                    </Typography>
                    <Typography>
                        <WeekdaySelector
                            onHandleSelectedWeekDay={handleSelectedWeeks}
                            preSelectedDays={skipDays}
                        />
                    </Typography>
                </Typography>
                {
                    showLoader ?
                        <Typography sx={{ mt: "2px" }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <CircularProgress color="primary" size={50} thickness={4} />
                            </div>
                        </Typography>
                        :
                        <></>
                }
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={saveHoldiays}
                    sx={{ fontFamily: "roboto" }}
                >
                    Save
                </Button>
                <Button
                    color="primary"
                    onClick={onClose}
                    sx={{ fontFamily: "roboto" }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </>
}
const EmailWhatsAppDialog = ({ open, onClose }) => {
    const [email, setEmail] = React.useState('');
    const [emailPassword, setEmailPassword] = React.useState('');
    const [emailLoader, setEmailLoader] = React.useState(false);
    const [whatsapp, setWhatsapp] = React.useState('');
    const [whatsappPassword, setWhatsappPassword] = React.useState('');
    const [whatsappLoader, setWhatsappLoader] = React.useState(false);
    const [emailTestingLoader, setEmailTestingLoader] = React.useState(false);
    const [whatsAppTestingLoader, setWhatsAppTestingLoader] = React.useState(false);
    const [emailError, setEmailError] = React.useState('');
    const emailSetup = async () => {
        setEmailLoader(true);
        try {
            const response = await SetUpEmailService({ email, password: emailPassword });
            if (response.data.success) {
                toast.success("Email Setup is successfull");
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            toast.error('Email and password are not valid for sending emails,please enter correct credentials.');
        }
        setEmailLoader(false);
    }

    const whatsappSetup = async () => {
        setWhatsappLoader(true);
        try {
            const response = await SetUpWhatsappService({ username: whatsapp, password: whatsappPassword });
            if (response.data.success) {
                toast.success("Whatsapp Setup is successfull");
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
        }
        setWhatsappLoader(false);
    }

    const emailManualTestingService = async () => {
        setEmailTestingLoader(true);
        try {
            const response = await EmailManualTestingService(email, emailPassword);
            if (response.data.success == "true") {
                toast.success(response.data.message);
            }
        } catch (e) { console.log(e); toast.error("Wrong credentials"); }
        setEmailTestingLoader(false);
    }

    const whatsappManualTestingService = async () => {
        setWhatsAppTestingLoader(true)
        try {
            const response = await WhatsAppManualTestingService(whatsapp, whatsappPassword);
            if (response.data.success == true) {
                toast.success(response.data.message);
            }
        } catch (e) { console.log(e); toast.error("Wrong credentials"); }
        setWhatsAppTestingLoader(false);
    }

    return <>
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle><span style={{ fontFamily: "roboto" }}>Email & WhatsApp Credentials</span></DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={<span style={{ fontFamily: 'roboto' }}>Email Address</span>}
                            autoFocus
                            size={"small"}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                const res = isValidEmail(e.target.value);
                                if (res) {
                                    setEmailError(false);
                                } else {
                                    setEmailError(true);
                                }
                            }}
                            InputProps={{
                                inputProps: {
                                    style: {
                                        fontFamily: 'roboto',  // Change the font family for the input text
                                    }
                                },
                            }}
                            helperText={emailError ? 'Please enter a valid email address' : ''}
                            FormHelperTextProps={{
                                sx: { color: 'red' }, // Set the color for the helper text when there's an error
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label={<span style={{ fontFamily: 'roboto' }}>WhatsApp Api</span>}
                            size={"small"}
                            value={whatsapp}
                            onChange={(e) => { setWhatsapp(e.target.value) }}
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
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <TextField
                            margin="normal"
                            type='password'
                            required
                            fullWidth
                            label={<span style={{ fontFamily: 'roboto' }}>Email Password</span>}
                            size={"small"}
                            value={emailPassword}
                            onChange={(e) => { setEmailPassword(e.target.value) }}
                            InputProps={{
                                inputProps: {
                                    style: {
                                        fontFamily: 'roboto',  // Change the font family for the input text
                                    }
                                },
                            }}
                        />
                        <div style={{ textAlign: "left" }}>
                            <Button sx={{ padding: "0 0" }} component="a" href="https://myaccount.google.com/security" target="_blank">
                                CLICK HERE
                            </Button>
                            <span> to get App password</span>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            margin="normal"
                            type='password'
                            required
                            fullWidth
                            label={<span style={{ fontFamily: 'roboto' }}>WhatsApp Password</span>}
                            size={"small"}
                            value={whatsappPassword}
                            onChange={(e) => { setWhatsappPassword(e.target.value) }}
                            InputProps={{
                                inputProps: {
                                    style: {
                                        fontFamily: 'roboto',  // Change the font family for the input text
                                    }
                                },
                            }}
                        />
                        <div style={{ textAlign: "left" }}>
                            <Button sx={{ padding: "0 0" }} component="a" href="https://live.ceoitbox.com/buy-credits" target="_blank">
                                CLICK HERE
                            </Button>
                            <span> to purchase</span>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        {
                            emailLoader == false ? <>
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, fontFamily: "roboto" }}
                                    onClick={emailSetup}
                                    disabled={emailSetup == '' || emailPassword == ''}
                                >
                                    Email SetUp
                                </Button>
                            </> : <div style={{ display: "flex", justifyContent: "center", marginTop: "2px" }}>
                                <CircularProgress color="primary" size={50} thickness={4} />
                            </div>
                        }
                    </Grid>
                    <Grid item xs={6}>
                        {
                            whatsappLoader == false ? <>
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, fontFamily: "roboto" }}
                                    onClick={whatsappSetup}
                                    disabled={whatsappPassword == '' || whatsapp == ''}
                                >
                                    Whatsapp SetUp
                                </Button>
                            </> : <div style={{ display: "flex", justifyContent: "center", marginTop: "2px" }}>
                                <CircularProgress color="primary" size={50} thickness={4} />
                            </div>
                        }
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        {
                            emailTestingLoader == false ? <>
                                <Button
                                    variant='contained'
                                    fullWidth
                                    disabled={emailSetup == '' || emailPassword == ''}
                                    onClick={emailManualTestingService}
                                >
                                    Test Credentials
                                </Button>
                            </> : <>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: "2px" }}>
                                    <CircularProgress color="primary" size={50} thickness={4} />
                                </div>
                            </>
                        }
                    </Grid>
                    <Grid item xs={6}>
                        {
                            whatsAppTestingLoader == false ? <>
                                <Button variant='contained' fullWidth disabled={whatsappPassword == '' || whatsapp == ''}
                                    onClick={whatsappManualTestingService}
                                >
                                    Manual Test Send
                                </Button>
                            </> : <>
                                <div style={{ display: "flex", justifyContent: "center", marginTop: "2px" }}>
                                    <CircularProgress color="primary" size={50} thickness={4} />
                                </div>
                            </>
                        }
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={onClose}
                    sx={{ fontFamily: "roboto" }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </>
}
const EmailWhatsAppDetails = ({ open, onClose }) => {
    return <>
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle><span style={{ fontFamily: "roboto" }}>Email & Whatsapp Settings</span></DialogTitle>
            <DialogContent>
                <WhatsAppEmailDetails />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={onClose}
                    sx={{ fontFamily: "roboto" }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    </>
}



export default function SideNavBar() {
    const theme = useTheme();
    const defaultImg = "https://drive.google.com/uc?export=view&id=1WEptUger6Bqs1OHLN9znAqtF06x9OJRk";

    const [open, setOpen] = React.useState(false);
    const [isAuth, setIsAuth] = React.useState('false');
    const [isAdminAuth, setIsAdminAuth] = React.useState('false');
    const [taskMenu, setTaskMenu] = React.useState(false);
    const [holidays, setHolidays] = React.useState(false);
    const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
    const [profileImage, setProfileImage] = React.useState(defaultImg);
    const [isHolidayDialogOpen, setIsHolidayDialogOpen] = React.useState(false);
    const [isEmailWhatsAppDialogOpen, setIsEmailWhatsAppDialogOpen] = React.useState(false);
    const [isEmailWatsAppDetailsTableOpen, setEmailWatsAppDetailsTableOpen] = React.useState(false);
    const navigate = useNavigate();
    const [userDialogOpen, setUserDialogOpen] = React.useState(false);

    /** This is for handling Holidays dialog */
    const handleHolidayDialogOpen = () => {
        setIsHolidayDialogOpen(true);
    };
    const handleHolidayDialogClose = () => {
        setIsHolidayDialogOpen(false);
    };
    /** this is for email whatsapp settings */
    const handleEmailWatsAppDialogOpen = () => {
        setIsEmailWhatsAppDialogOpen(true);
    }
    const handleEmailWatsAppDialogclose = () => {
        setIsEmailWhatsAppDialogOpen(false);
    }

    const handleProfileImageClick = () => {
        setImageDialogOpen(true);
    }
    const handleEmailWatsAppDetailsTableOpen = () => {
        setEmailWatsAppDetailsTableOpen(true);
    }
    const handleEmailWatsAppDetailsTableClose = () => {
        setEmailWatsAppDetailsTableOpen(false);
    }
    const handleProfileCloseDialog = (img) => {
        setImageDialogOpen(false);
        const response = String(img) === "[object Object]" ? defaultImg : img;
        setProfileImage(response);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setTaskMenu(false);
    };

    const adminLogOut = async () => {
        // const response = await AdminLogoutService();
        // if (response.data.success == true) {
        //     toast.success("logged out");
        //     localStorage.removeItem('isAdminAuth');
        //     loginSubject.next({ isAdminAuth: false });
        //     navigate("/login");
        // }
    }

    const userLogOut = async () => {
        const response = await UserLogoutService();
        console.log(response);
        if (response.data.success == true) {
            toast.success("logged out");
            localStorage.removeItem('isAuth');
            localStorage.removeItem('isAdminAuth');
            loginSubject.next({ isAuth: false });
            loginSubject.next({ isAdminAuth: false });
            navigate("/login");
        }
    }

    React.useEffect(() => {
        const subscription = loginSubject.subscribe((data) => {
            if (data.isAuth == false || data.isAuth == true) {
                setIsAuth(data.isAuth);
            }
            if (data.isAdminAuth == false || data.isAdminAuth == true) {
                setIsAdminAuth(data.isAdminAuth);
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open} sx={{ background: "#64acc8" }}>
                    <Toolbar style={{ width: '100%', display: 'flex', zIndex: "1111" }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                                color: "black"
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        {
                            (isAuth == true || isAdminAuth == true) ?
                                <>
                                    <Typography variant="h6" noWrap component="div">
                                        <Tooltip title="Edit" arrow>
                                            <>
                                                <img
                                                    src={profileImage}
                                                    style={{
                                                        width: "100%",
                                                        objectFit: "contain",
                                                        height: "55px",
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={handleProfileImageClick}
                                                />
                                                <ImageDialog
                                                    open={imageDialogOpen}
                                                    onClose={handleProfileCloseDialog}
                                                    setProfileImage={setProfileImage}
                                                />
                                            </>
                                        </Tooltip>
                                    </Typography>
                                    {
                                        (isAuth == true || isAdminAuth == true) &&
                                        <div style={{ marginLeft: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                            onClick={() => {
                                                userLogOut();
                                            }}>
                                            <Link to="/login" >
                                                <Tooltip title="Logout" arrow placement="right">
                                                    <div style={{ display: "flex", justifyContent: "space-between", color: "#222" }}>
                                                        <LogoutIcon />
                                                        <span>Logout</span>
                                                    </div>
                                                </Tooltip>
                                            </Link>
                                        </div>
                                    }
                                    {/* {
                                        isAdminAuth == true &&
                                        <div style={{ marginLeft: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                            onClick={() => {
                                                adminLogOut();
                                            }}>
                                            <Link to="/login" >
                                                <Tooltip title="Logout" arrow placement="right">
                                                    <div style={{ display: "flex", justifyContent: "space-between", color: "#222" }}>
                                                        <LogoutIcon />
                                                        <span>Logout</span>
                                                    </div>
                                                </Tooltip>
                                            </Link>
                                        </div>
                                    } */}


                                </>
                                : <></>
                        }
                    </Toolbar>
                    {isAuth == true ? (
                        <Typography variant="h4" noWrap component="div" style={{
                            fontFamily: "roboto",
                            color: "black", display: "flex", justifyContent: "center", marginTop: "-60px",
                            background: "transparent", zIndex: 0, padding: "5px 5px"
                        }}>
                            Tasks
                        </Typography>
                    ) : null}
                    {isAdminAuth == true ? (
                        <Typography variant="h4" noWrap component="div" style={{
                            color: "black", display: "flex", justifyContent: "center", marginTop: "-60px",
                            background: "transparent", zIndex: 0, padding: "5px 5px"
                        }}>
                            Company Details
                        </Typography>
                    ) : null}
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {
                            isAuth == true ?
                                <>
                                    <ListItem key="Common Settings" disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                setHolidays(!holidays);
                                                if (holidays === false) {
                                                    setOpen(true);
                                                }
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Tooltip title="Common Settings" arrow placement="right">
                                                    <SettingsIcon
                                                        sx={{ marginLeft: "3px" }}
                                                    />
                                                </Tooltip>
                                            </ListItemIcon>
                                            <ListItemText primary={<span style={{ fontFamily: "roboto" }}>Common Settings</span>} />
                                            {holidays ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                    <Collapse
                                        in={holidays}
                                        timeout="auto"
                                        unmountOnExit
                                        sx={{ marginLeft: '30px' }}
                                    >
                                        <List component="div" disablePadding>
                                            <ListItem
                                                disablePadding sx={{ display: 'block' }}
                                                component={RouterLink} to={'/'}
                                            >
                                                <ListItemButton
                                                    sx={{
                                                        minHeight: 48,
                                                        justifyContent: open ? 'initial' : 'center',
                                                        px: 2.5,
                                                    }}
                                                    onClick={handleHolidayDialogOpen}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 0,
                                                            mr: open ? 3 : 'auto',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Tooltip title="Add Dates/Weeks" arrow placement="right">
                                                            <CalendarMonthRoundedIcon sx={{ opacity: open ? 1 : 0 }} />
                                                        </Tooltip>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={<span style={{ fontFamily: "roboto" }}>Holidays</span>}
                                                        sx={{ opacity: open ? 1 : 0, color: "#333" }}
                                                    />
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{
                                                        minHeight: 48,
                                                        justifyContent: open ? 'initial' : 'center',
                                                        px: 2.5,
                                                    }}
                                                    onClick={handleEmailWatsAppDialogOpen}

                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 0,
                                                            mr: open ? 3 : 'auto',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Tooltip title="Email WhatsApp" arrow placement="right">
                                                            <SmsSharpIcon sx={{ opacity: open ? 1 : 0 }} />
                                                        </Tooltip>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={<span style={{ fontFamily: "roboto" }}>Email/WhatsApp</span>}
                                                        sx={{ opacity: open ? 1 : 0, color: "#333" }}
                                                    />
                                                </ListItemButton>

                                                {/*  */}
                                                <ListItemButton
                                                    sx={{
                                                        minHeight: 48,
                                                        justifyContent: open ? 'initial' : 'center',
                                                        px: 2.5,
                                                    }}
                                                    onClick={handleEmailWatsAppDetailsTableOpen}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 0,
                                                            mr: open ? 3 : 'auto',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Tooltip title="User Table" arrow placement="right">
                                                            <TableChartIcon sx={{ opacity: open ? 1 : 0 }} />
                                                        </Tooltip>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={<span style={{ fontFamily: "roboto" }}>User Table</span>}
                                                        sx={{ opacity: open ? 1 : 0, color: "#333" }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                    </Collapse>
                                    <Divider />
                                    <ListItem key="TaskMenu" disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                setTaskMenu(!taskMenu);
                                                if (taskMenu === false) {
                                                    setOpen(true);
                                                }
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Tooltip title="Recurring Task" arrow placement="right">
                                                    <EventRepeatIcon
                                                        sx={{ marginLeft: "3px" }}
                                                    />
                                                </Tooltip>
                                            </ListItemIcon>
                                            <ListItemText primary={<span style={{ fontFamily: "roboto" }}>Recurring Task</span>} />
                                            {taskMenu ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                    </ListItem>
                                    <Collapse
                                        in={taskMenu}
                                        timeout="auto"
                                        unmountOnExit
                                        sx={{ marginLeft: '30px' }}
                                    >
                                        <List component="div" disablePadding>
                                            <ListItem
                                                disablePadding sx={{ display: 'block' }}
                                                component={RouterLink} to={'/'}
                                            >
                                                <ListItemButton
                                                    sx={{
                                                        minHeight: 48,
                                                        justifyContent: open ? 'initial' : 'center',
                                                        px: 2.5,
                                                    }}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 0,
                                                            mr: open ? 3 : 'auto',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Tooltip title="Add Reminder" arrow placement="right">
                                                            <AddAlertOutlinedIcon sx={{ opacity: open ? 1 : 0 }} />
                                                        </Tooltip>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={<span style={{ fontFamily: "roboto" }}>Add Reminder</span>}
                                                        sx={{ opacity: open ? 1 : 0, color: "#333" }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                            <ListItem
                                                disablePadding
                                                sx={{ display: 'block' }}
                                                component={RouterLink} to={'/allforms'}
                                            >
                                                <ListItemButton
                                                    sx={{
                                                        minHeight: 48,
                                                        justifyContent: open ? 'initial' : 'center',
                                                        px: 2.5,
                                                    }}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 0,
                                                            mr: open ? 3 : 'auto',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Tooltip title="Add Forms" arrow placement="right">
                                                            <ListIcon sx={{ opacity: open ? 1 : 0 }} />
                                                        </Tooltip>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={<span style={{ fontFamily: "roboto" }}>All Reminder</span>}
                                                        sx={{ opacity: open ? 1 : 0, color: "#333" }} />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                    </Collapse>
                                </>
                                :
                                isAdminAuth == true ?
                                    <>
                                        <List component="div" disablePadding>
                                            <ListItem
                                                disablePadding sx={{ display: 'block' }}
                                                component={RouterLink} to={'/admin/userdata'}
                                            >
                                                <ListItemButton
                                                    sx={{
                                                        minHeight: 48,
                                                        justifyContent: open ? 'initial' : 'center',
                                                        px: 2.5,
                                                    }}
                                                >
                                                    <ListItemIcon
                                                        sx={{
                                                            minWidth: 0,
                                                            mr: open ? 3 : 'auto',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Tooltip title="Users Data" arrow placement="right">
                                                            <TableChartIcon />
                                                        </Tooltip>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Users Data"
                                                        sx={{ opacity: open ? 1 : 0, color: "#333" }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                    </>
                                    :
                                    <>
                                        <ListItem
                                            disablePadding
                                            sx={{ display: 'block' }}
                                            component={RouterLink}
                                            to={'/login'}
                                        >
                                            <ListItemButton
                                                sx={{
                                                    minHeight: 48,
                                                    justifyContent: open ? 'initial' : 'center',
                                                    px: 2.5,
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 0,
                                                        mr: open ? 3 : 'auto',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Tooltip title="Login" arrow placement="right">
                                                        <LoginIcon />
                                                    </Tooltip>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<span style={{ fontFamily: "roboto" }}>LogIn</span>}
                                                    sx={{ opacity: open ? 1 : 0, color: "#333" }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem
                                            disablePadding
                                            sx={{ display: 'block' }}
                                            component={RouterLink}
                                            to={'/register'}
                                        >
                                            <ListItemButton
                                                sx={{
                                                    minHeight: 48,
                                                    justifyContent: open ? 'initial' : 'center',
                                                    px: 2.5,
                                                }}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 0,
                                                        mr: open ? 3 : 'auto',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Tooltip title="Sign Up" arrow placement="right">
                                                        <SignUpIcon />
                                                    </Tooltip>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={<span style={{ fontFamily: "roboto" }}>Sign Up</span>}
                                                    sx={{ opacity: open ? 1 : 0, color: "#333" }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    </>
                        }
                    </List>
                    <Divider />
                </Drawer>
            </Box >
            {
                isHolidayDialogOpen && (
                    <HolidaysDialog
                        open={isHolidayDialogOpen}
                        onClose={handleHolidayDialogClose}
                    />
                )
            }
            {/* this is for email settings */}
            {
                isEmailWhatsAppDialogOpen && (
                    <EmailWhatsAppDialog
                        open={isEmailWhatsAppDialogOpen}
                        onClose={handleEmailWatsAppDialogclose}
                    />
                )
            }
            {/* this is for email whatsappDetailse */}
            {
                isEmailWatsAppDetailsTableOpen && (
                    <EmailWhatsAppDetails
                        open={isEmailWatsAppDetailsTableOpen}
                        onClose={handleEmailWatsAppDetailsTableClose}
                    />
                )
            }
        </>
    );
}