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
          const response = await axios.get(`${API_URL}/users/me`);
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
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post(`${API_URL}/auth/login`, formData);
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      const userResponse = await axios.get(`${API_URL}/users/me`);
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const register = async (email, password, fullName) => {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        full_name: fullName,
        username: email.split('@')[0]
      });
      
      return await login(email, password);
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/google/authorize`);
      const { authorization_url } = response.data;
      window.location.href = authorization_url;
    } catch (error) {
      console.error("Failed to get Google auth URL", error);
    }
  };
  
  const handleOAuthCallback = async (accessToken) => {
    try {
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      const userResponse = await axios.get(`${API_URL}/users/me`);
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      console.error("Failed to handle OAuth callback:", error);
      logout();
      return { success: false, error: "Failed to fetch user data after login." };
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
      const response = await axios.patch(`${API_URL}/users/me`, profileData);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Profile update failed' 
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
    handleOAuthCallback // Add the new function here
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}