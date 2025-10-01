// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          // *** FIX: Use the standard endpoint provided by get_users_router ***
          const response = await axios.get(`${API_URL}/auth/users/me`);
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    }
    
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await axios.post(`${API_URL}/auth/jwt/login`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // *** FIX: Use the standard endpoint provided by get_users_router ***
      const userResponse = await axios.get(`${API_URL}/auth/users/me`);
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        error: error.response?.data?.detail || "Login failed" 
      };
    }
  };

  const register = async (email, password, userData = {}) => {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        ...userData
      });
      
      return await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      return { 
        success: false, 
        error: error.response?.data?.detail || "Registration failed" 
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/google/authorize`);
      const { authorization_url } = response.data;
      window.location.href = authorization_url;
    } catch (error) {
      console.error("Google OAuth initiation failed:", error);
      return { 
        success: false, 
        error: "Failed to start Google authentication" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    try {
      // *** FIX: Use the standard endpoint provided by get_users_router ***
      const response = await axios.patch(`${API_URL}/auth/users/me`, profileData);
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Profile update failed:", error);
      return { 
        success: false, 
        error: error.response?.data?.detail || "Profile update failed" 
      };
    }
  };

  const handleOAuthCallback = async (accessToken) => {
    try {
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
      // *** FIX: Use the standard endpoint provided by get_users_router ***
      const userResponse = await axios.get(`${API_URL}/auth/users/me`);
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      console.error("OAuth callback failed:", error);
      logout();
      return { 
        success: false, 
        error: error.response?.data?.detail || "Failed to complete OAuth login" 
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
    token,
    handleOAuthCallback
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}