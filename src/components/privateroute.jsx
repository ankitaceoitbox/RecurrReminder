import React from 'react'
import { Navigate } from 'react-router-dom'

function Protected({ children, admin }) {
    const isAuthenticated = localStorage.getItem("isAuth");
    const isAdminAuthenticated = localStorage.getItem("isAdminAuth");
    if (admin == true) {
        return isAdminAuthenticated == null ? <Navigate to="/login" replace /> : children;
    }
    if (isAuthenticated == null) {
        return <Navigate to="/login" replace />
    }
    return children;
}
export default Protected

