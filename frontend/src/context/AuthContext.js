import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    
    if (token && savedRole) {
      setRole(savedRole);
      setUser({ role: savedRole });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const { token, role: userRole } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      
      setUser({ role: userRole });
      setRole(userRole);
      
      return { success: true, role: userRole };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.msg || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
  };

  const isAdmin = () => role === 'admin';
  const isUser = () => role === 'user' || role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        logout,
        isAdmin,
        isUser,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


