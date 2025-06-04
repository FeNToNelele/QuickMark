import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute_old({ children }) {
    const { isAuthenticated } = useAuth();
    console.log('ProtectedRoute', isAuthenticated());
    
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute_old;