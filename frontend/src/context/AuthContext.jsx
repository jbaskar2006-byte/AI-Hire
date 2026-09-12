import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hireai_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hireai_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Verify stored token on initial render
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('hireai_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('hireai_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Invalid or expired token, resetting session.');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      logout();
      showToast('Session expired. Please sign in again.', 'error');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const extractErrorMessage = (err, fallbackMsg) => {
    const detail = err.response?.data?.detail;
    if (!detail) return err.message || fallbackMsg;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const item = detail[0];
      if (typeof item === 'string') return item;
      if (item?.msg) {
        const field = item?.loc ? item.loc.filter((l) => l !== 'body').join(' -> ') : '';
        return field ? `${field}: ${item.msg}` : item.msg;
      }
    }
    if (typeof detail === 'object' && detail !== null) {
      return detail.message || detail.msg || JSON.stringify(detail);
    }
    return fallbackMsg;
  };

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = res.data;

      setToken(access_token);
      setUser(userData);
      localStorage.setItem('hireai_token', access_token);
      localStorage.setItem('hireai_user', JSON.stringify(userData));

      showToast(`Welcome back, ${userData.full_name}!`, 'success');
      return { success: true, user: userData };
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to authenticate. Please check your credentials.');
      setAuthError(msg);
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const register = async (registerData) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/register', registerData);
      const { access_token, user: userData } = res.data;

      setToken(access_token);
      setUser(userData);
      localStorage.setItem('hireai_token', access_token);
      localStorage.setItem('hireai_user', JSON.stringify(userData));

      showToast(`Account created successfully! Welcome to HireAI, ${userData.full_name}.`, 'success');
      return { success: true, user: userData };
    } catch (err) {
      const msg = extractErrorMessage(err, 'Registration failed. Please try again.');
      setAuthError(msg);
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const updateProfile = async (updatedFields) => {
    try {
      const res = await api.put('/auth/profile', updatedFields);
      setUser(res.data);
      localStorage.setItem('hireai_user', JSON.stringify(res.data));
      showToast('Profile updated successfully!', 'success');
      return { success: true, user: res.data };
    } catch (err) {
      const msg = extractErrorMessage(err, 'Failed to update profile.');
      showToast(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hireai_token');
    localStorage.removeItem('hireai_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        authError,
        toast,
        login,
        register,
        logout,
        updateProfile,
        showToast,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
