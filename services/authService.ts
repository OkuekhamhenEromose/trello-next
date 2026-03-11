"use client";

/**
 * authService.ts
 *
 * Client-side auth service for the multi-step Trello login flow.
 * Manages:
 *  - Token storage (localStorage + in-memory)
 *  - Step-by-step login: email → password → MFA token
 *  - Google OAuth redirect flow
 *  - Password reset
 *  - User profile
 *  - Auth state subscription (simple pub/sub)
 *  - Automatic token refresh with request queuing
 *  - Logout from all devices
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const TOKEN_KEY = "trello_token";

/* ════════════════════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════════════════ */

export interface User {
  id: string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullname?: string;
  profile?: { fullname?: string; avatar?: string };
  profile_pix?: string; // for header avatar
  role?: "user" | "admin";
}

export interface LoginEmailResponse {
  nextStep: "password";
}

export interface LoginPasswordResponse {
  nextStep: "token-verification";
  message: string;
}

export interface LoginTokenResponse {
  accessToken: string;
  redirect: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type Listener = () => void;

/* ════════════════════════════════════════════════════════════
   HTTP HELPER
════════════════════════════════════════════════════════════ */

async function http<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: object,
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    credentials: "include", // send cookies for refresh token
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Attach status + backend error fields for caller handling
    throw Object.assign(new Error(data?.error ?? "Request failed"), { 
      status: res.status, 
      ...data 
    });
  }

  return data as T;
}

/* ════════════════════════════════════════════════════════════
   TOKEN REFRESH MANAGEMENT
════════════════════════════════════════════════════════════ */

// Singleton refresh promise to prevent multiple simultaneous refresh requests
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempts to refresh the access token.
 * Uses a singleton promise to prevent multiple simultaneous refresh requests.
 */
export async function refreshTokenIfNeeded(): Promise<boolean> {
  // If already refreshing, return that promise
  if (refreshPromise) return refreshPromise;
  
  refreshPromise = (async () => {
    try {
      const refreshed = await authService.refreshAccessToken();
      return refreshed;
    } finally {
      refreshPromise = null;
    }
  })();
  
  return refreshPromise;
}

/**
 * HTTP helper with automatic token refresh on 401 responses.
 * Use this for all authenticated API calls.
 */
export async function httpWithAuth<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: object
): Promise<T> {
  let token = authService.getToken();
  
  try {
    return await http<T>(method, path, body, token);
  } catch (error: any) {
    // If 401 (Unauthorized), try to refresh token and retry once
    if (error.status === 401) {
      console.log('Token expired, attempting refresh...');
      const refreshed = await refreshTokenIfNeeded();
      
      if (refreshed) {
        console.log('Token refreshed successfully, retrying request...');
        // Retry with new token
        return await http<T>(method, path, body, authService.getToken());
      } else {
        console.log('Token refresh failed, clearing auth state...');
        // Refresh failed, clear token and throw
        authService.clearToken();
      }
    }
    throw error;
  }
}

/* ════════════════════════════════════════════════════════════
   AUTH SERVICE CLASS
════════════════════════════════════════════════════════════ */

class AuthService {
  private _token: string | null = null;
  private _user: User | null = null;
  private _listeners: Set<Listener> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      this._token = localStorage.getItem(TOKEN_KEY);
      
      // If we have a token but no user, try to load profile on next tick
      if (this._token && !this._user) {
        setTimeout(() => {
          this.loadProfile().catch(() => {
            // If profile load fails, token might be invalid
            this.refreshAccessToken().catch(() => {
              this.clearToken();
            });
          });
        }, 0);
      }
    }
  }

  /* ── Pub/Sub ── */
  subscribe(fn: Listener): () => void {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  private _notify() {
    this._listeners.forEach(fn => fn());
  }

  /* ── Token ── */
  getToken(): string | null { return this._token; }
  getUser(): User | null    { return this._user; }

  setToken(token: string) {
    this._token = token;
    if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken() {
    this._token = null;
    this._user  = null;
    if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
    this._notify();
  }

  isAuthenticated(): boolean {
    return !!this._token && !!this._user;
  }

  /* ══════════════════════════════════════════════════════════
     MULTI-STEP LOGIN
  ══════════════════════════════════════════════════════════ */

  /**
   * Step 1 — POST /auth/login/email
   * Always returns { nextStep: "password" } regardless of email existence
   * (security: prevents email enumeration).
   */
  async loginEmail(email: string): Promise<LoginEmailResponse> {
    return http<LoginEmailResponse>("POST", "/auth/login/email", { email });
  }

  /**
   * Step 2 — POST /auth/login/password
   * On success: backend sends 6-digit code to user's email.
   * Returns { nextStep: "token-verification" }.
   * Throws on 401 INVALID_CREDENTIALS with code field.
   */
  async loginPassword(
    email: string,
    password: string
  ): Promise<LoginPasswordResponse> {
    return http<LoginPasswordResponse>("POST", "/auth/login/password", { email, password });
  }

  /**
   * Step 3 — POST /auth/login/verify-token
   * Verifies the 6-digit code.
   * On success: stores access token + loads user profile.
   */
  async loginVerifyToken(
    email: string,
    token: string,
    rememberMe = false
  ): Promise<LoginTokenResponse> {
    const res = await http<LoginTokenResponse>(
      "POST", "/auth/login/verify-token",
      { email, token, rememberMe }
    );

    // Persist access token
    this.setToken(res.accessToken);

    // Load user profile immediately
    try {
      await this.loadProfile();
    } catch {
      // Non-fatal: profile load may fail on first request
    }

    this._notify();
    return res;
  }

  /* ══════════════════════════════════════════════════════════
     GOOGLE OAUTH
  ══════════════════════════════════════════════════════════ */

  /**
   * Redirects browser to backend Google OAuth entry point.
   * Backend will redirect back to /oauth-callback?token=...
   */
  initiateGoogleLogin() {
    if (typeof window !== "undefined") {
      window.location.href = `${API_BASE}/auth/google`;
    }
  }

  /**
   * Called from /oauth-callback page with token from query string.
   */
  async handleOAuthCallback(accessToken: string): Promise<void> {
    this.setToken(accessToken);
    try {
      await this.loadProfile();
    } catch {
      // profile load is best-effort
    }
    this._notify();
  }

  /* ══════════════════════════════════════════════════════════
     TOKEN REFRESH
  ══════════════════════════════════════════════════════════ */

  /**
   * POST /auth/refresh-token
   * Uses HttpOnly cookie (refresh token) — no body needed.
   * Updates stored access token on success.
   */
  async refreshAccessToken(): Promise<boolean> {
    try {
      const res = await http<{ accessToken: string; user: User }>(
        "POST", "/auth/refresh-token", undefined, undefined // No token needed, uses cookie
      );
      
      this.setToken(res.accessToken);
      this._user = {
        ...res.user,
        fullname: res.user.profile?.fullname ?? res.user.firstName,
        profile_pix: res.user.profile?.avatar,
      };
      this._notify();
      return true;
    } catch (error) {
      console.error('Refresh token failed:', error);
      this.clearToken();
      return false;
    }
  }

  /* ══════════════════════════════════════════════════════════
     PROFILE
  ══════════════════════════════════════════════════════════ */

  async loadProfile(): Promise<User> {
    const { user } = await http<{ user: User }>(
      "GET", "/auth/profile", undefined, this._token
    );
    // Normalise profile_pix for header avatar
    this._user = {
      ...user,
      fullname: user.profile?.fullname ?? user.firstName,
      profile_pix: user.profile?.avatar,
    };
    this._notify();
    return this._user;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const { user } = await http<{ message: string; user: User }>(
      "PUT", "/auth/profile", data, this._token
    );
    this._user = { ...this._user, ...user };
    this._notify();
    return this._user;
  }

  /* ══════════════════════════════════════════════════════════
     PASSWORD MANAGEMENT
  ══════════════════════════════════════════════════════════ */

  /**
   * POST /auth/forgot-password
   * Always returns success message (prevents email enumeration).
   */
  async forgotPassword(email: string): Promise<string> {
    const res = await http<{ message: string }>(
      "POST", "/auth/forgot-password", { email }
    );
    return res.message;
  }

  /**
   * POST /auth/reset-password
   * token: 64-char hex from reset email link.
   */
  async resetPassword(token: string, newPassword: string): Promise<string> {
    const res = await http<{ message: string }>(
      "POST", "/auth/reset-password", { token, newPassword }
    );
    return res.message;
  }

  /* ══════════════════════════════════════════════════════════
     LOGOUT
  ══════════════════════════════════════════════════════════ */

  /**
   * POST /auth/logout
   * Logs out from current device only.
   */
  async logout(): Promise<void> {
    try {
      await http("POST", "/auth/logout", undefined, this._token);
    } catch {
      // ignore network errors — still clear local state
    } finally {
      this.clearToken();
    }
  }

  /**
   * POST /auth/logout-all
   * Logs out from all devices by revoking all refresh tokens.
   */
  async logoutAll(): Promise<void> {
    try {
      await http("POST", "/auth/logout-all", undefined, this._token);
    } catch {
      // Ignore network errors
    } finally {
      this.clearToken();
    }
  }

  /* ══════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════ */

  async checkEmail(email: string): Promise<{ available: boolean; exists: boolean }> {
    return http<{ email: string; available: boolean; exists: boolean }>(
      "POST", "/auth/check-email", { email }
    );
  }
}

/* ════════════════════════════════════════════════════════════
   SINGLETON EXPORT
════════════════════════════════════════════════════════════ */

export const authService = new AuthService();
export default authService;