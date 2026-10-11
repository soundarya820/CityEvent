import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    const storedToken = authService.getToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password, role) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password, role });
      setUser(res.user);
      setToken(res.token);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // User registration handler
  const registerUser = async (userData) => {
    return await authService.registerUser(userData);
  };

  // Organizer registration handler
  const registerOrganizer = async (organizerData) => {
    return await authService.registerOrganizer(organizerData);
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!user && !!token,
    loading,
    login,
    logout,
    registerUser,
    registerOrganizer
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
