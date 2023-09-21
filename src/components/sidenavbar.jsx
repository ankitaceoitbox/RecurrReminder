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
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import ListIcon from '@mui/icons-material/List';
import LoginIcon from '@mui/icons-material/AccountCircle';
import SignUpIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import { loginSubject } from './login';
import { Link as RouterLink } from 'react-router-dom'; // If you're using React Router
import Tooltip from '@mui/material/Tooltip';
import { Button, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ExpandLess } from "@mui/icons-material";
import { ExpandMore } from "@mui/icons-material";
import { UploadLogo, getLogo } from '../services/logo.service';
import { toast } from 'react-toastify';
import { Buffer } from 'buffer'
import { DateRangeIcon } from '@mui/x-date-pickers';
import DateChipsSelector from './multipledateselector';
import WeekdaySelector from './multipleweekselector';
import { AddHolidays } from '../services/addholidays.service';
const drawerWidth = 240;

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
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
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

    const handleSelectedDates = (dates) => {
        setSkipDates(dates);
    }

    const handleSelectedWeeks = (weeks) => {
        setSkipDays(weeks);
    }


    const saveHoldiays = async () => {
        setShowLoader(true);
        try {
            const response = await AddHolidays(skipDates, skipDays);
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

    return <>
        <Dialog
            open={open}
            onClose={() => { onClose(); }}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>Add Dates/Weeks</DialogTitle>
            <DialogContent>
                <Typography component={"div"} sx={{ display: "flex", flexDirection: "column", alignContent: "center", gap: 2 }}>
                    <Typography component={"div"}>
                        <DateChipsSelector
                            onHandleSelectedDates={handleSelectedDates}
                            preSelectedDates={[]}
                        />
                    </Typography>
                    <Typography>
                        <WeekdaySelector
                            onHandleSelectedWeekDay={handleSelectedWeeks}
                            preSelectedDays={[]}
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
                >
                    Save
                </Button>
                <Button
                    color="primary"
                    onClick={onClose}
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
    const [taskMenu, setTaskMenu] = React.useState(false);
    const [holidays, setHolidays] = React.useState(false);
    const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
    const [profileImage, setProfileImage] = React.useState(defaultImg);
    const [isHolidayDialogOpen, setIsHolidayDialogOpen] = React.useState(false);

    /** This is for handling Holidays dialog */
    const handleHolidayDialogOpen = () => {
        setIsHolidayDialogOpen(true);
    };
    const handleHolidayDialogClose = () => {
        setIsHolidayDialogOpen(false);
    };

    const handleProfileImageClick = () => {
        setImageDialogOpen(true);
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

    React.useEffect(() => {
        const subscription = loginSubject.subscribe((data) => {
            setIsAuth(data.isAuth);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" open={open} sx={{ background: "#eee" }}>
                    <Toolbar>
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
                            isAuth == true ?
                                <Typography sx={{ marginLeft: "auto" }}>
                                    <ListItem
                                        disablePadding
                                        sx={{ display: 'block' }}
                                        component={RouterLink}
                                        to={'/login'}
                                        onClick={() => {
                                            localStorage.removeItem('isAuth');
                                            loginSubject.next({ isAuth: false });
                                        }}
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
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <LogoutIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="LogOut"
                                                sx={{ color: "#333", marginLeft: "6px" }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </Typography>
                                :
                                ''
                        }
                    </Toolbar>
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
                                                <Tooltip title="Task Menu" arrow placement="right">
                                                    <EventIcon
                                                        sx={{ marginLeft: "3px" }}
                                                    />
                                                </Tooltip>
                                            </ListItemIcon>
                                            <ListItemText primary="Task Menu" />
                                            {taskMenu ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
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
                                                            <AssignmentIcon sx={{ opacity: open ? 1 : 0 }} />
                                                        </Tooltip>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Add Reminder"
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
                                                        primary="All Form"
                                                        sx={{ opacity: open ? 1 : 0, color: "#333" }} />
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                    </Collapse>
                                    <Divider />
                                    <ListItem key="Holidays" disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                setHolidays(!holidays);
                                                if (holidays === false) {
                                                    setOpen(true);
                                                }
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Tooltip title="Holidays" arrow placement="right">
                                                    <DateRangeIcon
                                                        sx={{ marginLeft: "3px" }}
                                                    />
                                                </Tooltip>
                                            </ListItemIcon>
                                            <ListItemText primary="Holidays" />
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
                                                            <EventIcon sx={{ opacity: open ? 1 : 0 }} />
                                                        </Tooltip>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Dates/Weeks"
                                                        sx={{ opacity: open ? 1 : 0, color: "#333" }}
                                                    />
                                                    {/* <HolidaysDialog
                                                    open={isHolidayDialogOpen}
                                                    onClose={handleHolidayDialogClose}
                                                /> */}
                                                </ListItemButton>
                                            </ListItem>
                                        </List>
                                    </Collapse>
                                    <Divider />
                                    <ListItem
                                        disablePadding
                                        sx={{ display: 'block' }}
                                        component={RouterLink}
                                        to={'/login'}
                                        onClick={() => {
                                            localStorage.removeItem('isAuth');
                                            loginSubject.next({ isAuth: false });
                                        }}
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
                                                <Tooltip title="Logout" arrow placement="right">
                                                    <LogoutIcon />
                                                </Tooltip>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="LogOut"
                                                sx={{ opacity: open ? 1 : 0, color: "#333", marginLeft: "6px" }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
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
                                                primary="Login"
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
                                                primary="Sign Up"
                                                sx={{ opacity: open ? 1 : 0, color: "#333" }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                </>
                        }
                    </List>
                    <Divider />
                </Drawer>
            </Box>
            {
                isHolidayDialogOpen && (
                    <HolidaysDialog
                        open={isHolidayDialogOpen}
                        onClose={handleHolidayDialogClose}
                    />
                )
            }
        </>
    );
}