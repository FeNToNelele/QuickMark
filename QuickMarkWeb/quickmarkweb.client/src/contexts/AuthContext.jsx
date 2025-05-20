import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '../lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('authToken');
        return token ? { isAuthenticated: true, token } : { isAuthenticated: false, token: null };
    });

    const login = async (neptun, password) => {
        const response = await axios.post('/Auth/login', {
            username: neptun,
            password,
        });
        const { token } = response.data;
        setAuth({ isAuthenticated: true, token });
        localStorage.setItem('authToken', token);
    };

    const register = async ({ username, fullName, password, isAdmin }) => {
        await axios.post('/Auth/register', {
            username,
            password,
            fullName,
            isAdmin,
        });
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, token: null });
        localStorage.removeItem('authToken');
    };

    const isAuthenticated = () => auth.isAuthenticated;

    return (
        <AuthContext.Provider value={{ auth, login, logout, register, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);