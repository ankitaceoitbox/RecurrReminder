import React from 'react'
import { Navigate } from 'react-router-dom'

function AdminProtected({ children }) {
    const isAuthenticated = localStorage.getItem("isAdminAuth");
    if (isAuthenticated == null) {
        return <Navigate to="/login" replace />
    }
    return children;
}
export default AdminProtected

// admin credentials - email:rsuneel47@gmail.com,password:suneel