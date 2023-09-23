import React from 'react'
import { Navigate } from 'react-router-dom';

function AuthenticateProtected({ children }) {
    const isAuthenticated = localStorage.getItem("isAuth");
    const isAdminAuthenticated = localStorage.getItem("isAdminAuth");
    if (isAuthenticated == 'true') {
        return <Navigate to="/" replace />
    }
    if (isAdminAuthenticated == 'true') {
        return <Navigate to="/admin/userdata" replace />
    }

    return children;
}

export default AuthenticateProtected