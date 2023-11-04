import React, { useEffect, useState } from 'react'
import './global.css'
import { AppBar, Toolbar, Typography } from '@mui/material'
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom'; // If you're using React Router
import { loginSubject } from './login';
function Navbar() {
    const [isAuth, setIsAuth] = useState('false');

    useEffect(() => {
        const subscription = loginSubject.subscribe((data) => {
            setIsAuth(data.isAuth);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <AppBar position="static" style={{
            color: 'Black',
            backgroundColor: '#eee'
        }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Recurring Reminder
                </Typography>
                {
                    isAuth == true ? <>
                        <Link component={RouterLink} to={'/'} style={{
                            marginRight: "20px", textDecoration: 'none', // Remove underline
                            color: 'inherit', // Inherit the color from the parent element
                        }}>Add Reminder</Link>
                        <Link component={RouterLink} to={'/allforms'} style={{
                            marginRight: "20px", textDecoration: 'none', // Remove underline
                            color: 'inherit', // Inherit the color from the parent element
                        }}>All Forms</Link>
                        <Link component={RouterLink} to={'/login'} onClick={() => {
                            localStorage.removeItem('isAuth'); loginSubject.next({ isAuth: false });
                        }} style={{
                            marginRight: "20px", textDecoration: 'none', // Remove underline
                            color: 'inherit', // Inherit the color from the parent element
                        }}>Logout</Link>
                    </>
                        :
                        <></>
                }

            </Toolbar>
        </AppBar>
    )
}

export default Navbar