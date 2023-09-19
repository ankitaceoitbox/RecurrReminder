import React from 'react'
import { Navigate } from 'react-router-dom';

function AuthenticateProtected({ children }) {
    const isAuthenticated = localStorage.getItem("isAuth");
    if (isAuthenticated == 'true') {
        return <Navigate to="/" replace />
    }
    return children;
}

export default AuthenticateProtected