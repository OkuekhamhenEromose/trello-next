'use client';

import React, { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService, type User } from '@/services/authService';
import { socketService } from '@/services/socket';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      if (!authService.getToken()) {
        const refreshed = await authService.refreshAccessToken();
        if (!refreshed) {
          setUser(null);
          return;
        }
      }
      const profile = await authService.loadProfile();
      setUser(profile);
      socketService.connect(authService.getToken() ?? undefined);
    } catch {
      authService.clearToken();
      authService.clearToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    return authService.subscribe(() => {
      setUser(authService.getUser());
    });
  }, []);

  useEffect(() => {
    if (!authService.getToken()) {
      setIsLoading(false);
      return;
    }

    void loadUser().finally(() => setIsLoading(false));
  }, [loadUser]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      socketService.disconnect();
      await authService.logout();
      setUser(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await authService.updateProfile(data);
      setUser(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated: Boolean(user),
    loadUser,
    logout,
    updateUser,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
