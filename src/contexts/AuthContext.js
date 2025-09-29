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

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/users/me`); // Corrected to use the /users/me endpoint
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

      // Corrected to use the /auth/login endpoint based on our earlier fix
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      const { access_token } = response.data;

      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Get user data
      const userResponse = await axios.get(`${API_URL}/users/me`); // Corrected to use the /users/me endpoint
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
      
      // Auto login after registration
      return await login(email, password);
    } catch (error) {
      // Provide more specific error feedback if available
      const errorDetail = error.response?.data?.detail;
      if (typeof errorDetail === 'string' && errorDetail.includes('REGISTER_USER_ALREADY_EXISTS')) {
          return { success: false, error: 'A user with this email already exists.' };
      }
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    }
  };

  // --- THIS IS THE CORRECTED FUNCTION ---
  const loginWithGoogle = async () => {
    try {
      // Step 1: Fetch the authorization URL from the backend
      const response = await axios.get(`${API_URL}/auth/google/authorize`);
      const { authorization_url } = response.data;

      // Step 2: Redirect the user's browser to the URL provided by the backend
      window.location.href = authorization_url;
    } catch (error) {
      console.error("Failed to initiate Google login:", error);
      // Optionally, you can set an error state here to show a message to the user
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
      // Corrected to use the /users/me endpoint
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
    token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
