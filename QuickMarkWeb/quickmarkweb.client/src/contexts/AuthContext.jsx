import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('authToken');
        return token ? { isAuthenticated: true, token } : { isAuthenticated: false, token: null };
    });

    const login = (token) => {
        setAuth({ isAuthenticated: true, token });
        localStorage.setItem('authToken', token);
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, token: null });
        localStorage.removeItem('authToken');
    };

    const isAuthenticated = () => auth.isAuthenticated;

    return (
        <AuthContext.Provider value={{ auth, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);