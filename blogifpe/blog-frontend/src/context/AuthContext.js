import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
/* global localStorage */
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        if (decoded.exp * 1000 > Date.now()) { 
          fetchUserProfile();
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('http://3.222.27.148:8081/user/user-panel/');
      setUser(response.data);
      setLoading(false);
    } catch (error) {
      logout();
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('http://3.222.27.148:8081/user/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      await fetchUserProfile();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      await api.post('http://3.222.27.148:8081/user/register/', userData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || 'Registration failed' 
      };
    }
  };

  const DeleteUser = async () => {
      try {
        await api.delete('http://3.222.27.148:8081/user/delete/');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null)
        return {
        success:true  
        };
      } catch (error) {
        console.error('Error deleting user:', error);
        return {
        success:false
        };
      }
    };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    DeleteUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};