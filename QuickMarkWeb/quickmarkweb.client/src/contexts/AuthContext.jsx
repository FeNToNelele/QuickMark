import axios from "@/lib/axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in sessionStorage instead of localStorage
    const token = sessionStorage.getItem("authToken");
    const userData = sessionStorage.getItem("user");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (neptun, password) => {
    try {
      const response = await axios.post("/api/Auth/login", { neptun, password });
      const { token, user } = response.data;
      
      // Store in sessionStorage instead of localStorage
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    // Clear from sessionStorage
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);