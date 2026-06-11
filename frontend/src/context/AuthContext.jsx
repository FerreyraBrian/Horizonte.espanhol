import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  changePassword as changePasswordRequest,
  clearSession,
  ensureDemoAdminSession,
  fetchCurrentUser,
  getStoredSession,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  updateProfile as updateProfileRequest,
} from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const isAdminPreviewRoute = typeof window !== 'undefined'
    && (window.location.pathname === '/painel' || window.location.pathname.startsWith('/admin/'));

  const initialSession = getStoredSession() ?? (
    import.meta.env.DEV && isAdminPreviewRoute ? ensureDemoAdminSession() : null
  );

  const [user, setUser] = useState(initialSession?.user ?? null);
  const [token, setToken] = useState(initialSession?.token ?? null);
  const [loading, setLoading] = useState(Boolean(initialSession?.token));

  useEffect(() => {
    let ignore = false;

    const restoreSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        if (!ignore) {
          setUser(currentUser);
        }
      } catch {
        clearSession();
        if (!ignore) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      ignore = true;
    };
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login: async (email, password) => {
      const data = await loginRequest(email, password);
      setUser(data.user);
      setToken(data.token);
      return data;
    },
    register: async (payload) => registerRequest(payload),
    updateProfile: async (payload) => {
      const data = await updateProfileRequest(payload);
      setUser(data.user);
      setToken(data.token);
      return data.user;
    },
    changePassword: async (payload) => changePasswordRequest(payload),
    logout: () => {
      logoutRequest();
      setUser(null);
      setToken(null);
    },
    hasRole: (...roles) => Boolean(user && roles.includes(user.role)),
  }), [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
