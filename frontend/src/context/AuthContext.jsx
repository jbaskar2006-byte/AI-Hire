import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getUserStorageKey } from '../services/api';

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

  const initCandidateProfileIfNeeded = (userData) => {
    if (userData && (userData.role === 'candidate' || !userData.role)) {
      const key = getUserStorageKey('hireai_candidate_profile');
      if (!localStorage.getItem(key)) {
        const isBaskar = userData.email && userData.email.toLowerCase().includes('baskar');
        if (!isBaskar) {
          const cleanProfile = {
            full_name: userData.full_name || 'Candidate',
            email: userData.email,
            phone: '',
            location: '',
            education: '',
            experience_years: 0,
            linkedin_url: '',
            github_url: '',
            portfolio_url: '',
            profile_completion: 25
          };
          localStorage.setItem(key, JSON.stringify(cleanProfile));
        }
      }
    }
  };

  // Verify stored token on initial render
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('hireai_token');
      const savedUser = localStorage.getItem('hireai_user');
      if (storedToken && savedUser) {
        try {
          const res = await api.get('/auth/me');
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('hireai_user', JSON.stringify(res.data));
            initCandidateProfileIfNeeded(res.data);
          }
        } catch (err) {
          console.warn('Backend offline or unreachable, using local session state.');
          try {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            initCandidateProfileIfNeeded(parsed);
          } catch (e) {
            logout();
          }
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
      initCandidateProfileIfNeeded(userData);

      showToast(`Welcome back, ${userData.full_name}!`, 'success');
      return { success: true, user: userData };
    } catch (err) {
      // Fallback for static/offline deployment (e.g. GitHub Pages without backend API)
      console.warn('Backend unavailable, initiating client demo session fallback.');
      
      let role = 'candidate';
      let fullName = 'Demo Candidate';
      const lower = (email || '').toLowerCase();
      
      if (lower.includes('admin')) {
        role = 'admin';
        fullName = 'System Administrator';
      } else if (lower.includes('recruiter') || lower.includes('hr')) {
        role = 'recruiter';
        fullName = 'Lead Recruiter';
      } else if (email) {
        const namePart = email.split('@')[0];
        fullName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }

      const mockUser = {
        id: Date.now(),
        email: email || 'demo@hireai.com',
        full_name: fullName,
        role: role,
        is_active: true,
        created_at: new Date().toISOString()
      };
      const mockToken = `demo_token_${Date.now()}`;

      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('hireai_token', mockToken);
      localStorage.setItem('hireai_user', JSON.stringify(mockUser));
      initCandidateProfileIfNeeded(mockUser);

      showToast(`Welcome back, ${fullName}! (Demo Mode)`, 'success');
      return { success: true, user: mockUser };
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
      initCandidateProfileIfNeeded(userData);

      showToast(`Account created successfully! Welcome to HireAI, ${userData.full_name}.`, 'success');
      return { success: true, user: userData };
    } catch (err) {
      console.warn('Backend unavailable during registration, initiating client fallback session.');
      const mockUser = {
        id: Date.now(),
        email: registerData.email,
        full_name: registerData.full_name || 'New User',
        role: registerData.role || 'candidate',
        is_active: true,
        created_at: new Date().toISOString()
      };
      const mockToken = `demo_token_${Date.now()}`;

      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('hireai_token', mockToken);
      localStorage.setItem('hireai_user', JSON.stringify(mockUser));
      initCandidateProfileIfNeeded(mockUser);

      showToast(`Account created! Welcome to HireAI, ${mockUser.full_name}.`, 'success');
      return { success: true, user: mockUser };
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
      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      localStorage.setItem('hireai_user', JSON.stringify(updatedUser));
      showToast('Profile updated locally!', 'success');
      return { success: true, user: updatedUser };
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
