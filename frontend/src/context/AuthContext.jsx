import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Ask the server for the customer's current business model (wholesale /
  // dropshipping) and update the stored user if it changed.
  const refreshBusinessModel = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/auth/me');
      const model = data.business_model || 'wholesale';
      setUser((prev) => {
        if (!prev || prev.role !== 'customer' || prev.business_model === model) {
          return prev;
        }
        const updated = { ...prev, business_model: model };
        localStorage.setItem('user', JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error('Could not refresh business model:', e);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('AuthProvider - Checking stored data:', { hasUser: !!storedUser, hasToken: !!token });
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.role === 'customer') {
          refreshBusinessModel();
        }
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, [refreshBusinessModel]);

  // Customers: re-check when they come back to this browser tab, so a model
  // change made by the owner shows up without logging in again.
  useEffect(() => {
    if (user?.role !== 'customer') return;
    const onFocus = () => refreshBusinessModel();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [user?.role, refreshBusinessModel]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      
      const response = await axiosInstance.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      const { access_token, ...userData } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      console.log('Login successful, role:', userData.role);
      
      // Redirect based on role
      if (userData.role === 'customer') {
        navigate('/customer/dashboard');
      } else if (userData.role === 'employee') {
        navigate('/employee/dashboard');
      } else {
        navigate('/owner/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};