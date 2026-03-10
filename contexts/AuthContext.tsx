'use client';

import React, {
  createContext, useContext, useState,
  useEffect, useCallback, ReactNode
} from 'react';
import { authService, User } from '@/services/authService';
import { socketService } from '@/services/socket';

/* ── Types ── */
interface AuthContextType {
  user:            User | null;
  isLoading:       boolean;
  error:           string | null;
  isAuthenticated: boolean;
  loadUser:        () => Promise<void>;
  logout:          () => Promise<void>;
  updateUser:      (data: Partial<User>) => Promise<void>;
  clearError:      () => void;
}

/* ── Context ── */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

/* ── Provider ── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<User | null>(authService.getUser());
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  /* Subscribe to authService changes (login/logout from anywhere) */
  useEffect(() => {
    const unsub = authService.subscribe(() => {
      setUser(authService.getUser());
    });
    return unsub;
  }, []);

  /* On mount: if a token exists in localStorage, load the profile */
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      loadUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const profile = await authService.loadProfile();
      setUser(profile);
      // Connect socket once user is confirmed
      socketService.connect(authService.getToken() ?? undefined);
    } catch {
      // Token was invalid or expired — try refreshing
      const refreshed = await authService.refreshAccessToken();
      if (!refreshed) {
        authService.clearToken();
        setUser(null);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      socketService.disconnect();
      await authService.logout();   // clears token + notifies subscribers
      setUser(null);
    } catch (err: any) {
      setError(err?.message ?? 'Logout failed');
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
    } catch (err: any) {
      setError(err?.message ?? 'Update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      isAuthenticated: !!user,
      loadUser,
      logout,
      updateUser,
      clearError: () => setError(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
}