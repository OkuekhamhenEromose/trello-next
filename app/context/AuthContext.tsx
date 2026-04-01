'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User, LoginCredentials, RegisterData } from '@/services/api';
import { socketService } from '@/services/socket';

// Define error type
interface ApiError {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await api.getProfile();
      setUser(response.user);
      socketService.connect(api.getToken() || undefined);
    } catch {
      // Remove unused 'err' variable
      api.clearToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.login(credentials);
      setUser(response.user);
      socketService.connect(response.token);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.startRegistration(data.email);
      await api.verifyEmail(data.email, '123456');
      const response = await api.completeRegistration(data);
      setUser(response.user);
      socketService.connect(response.token);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      socketService.disconnect();
      setUser(null);
      api.clearToken();
    }
  };

  const updateUser = async (data: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.updateProfile(data);
      setUser(response.user);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.error || 'Update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};