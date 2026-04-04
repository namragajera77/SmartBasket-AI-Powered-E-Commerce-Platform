import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { login as loginRequest, refresh, register as registerRequest } from "../api/authApi";
import type { AuthResponse, LoginRequest, RegisterRequest, UserRole } from "../types/domain";
import {
  clearSessionStorage,
  getAccessToken,
  getRefreshToken,
  getSessionEmail,
  getSessionRole,
  setAccessToken,
  setRefreshToken,
  setSessionEmail,
  setSessionRole,
} from "../utils/storage";

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  role: UserRole | null;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeRole(role: string | null | undefined): UserRole | null {
  if (!role) {
    return null;
  }

  const normalized = role.trim().toLowerCase();
  if (normalized === "admin") {
    return "Admin";
  }

  if (normalized === "customer") {
    return "Customer";
  }

  if (normalized === "delivery") {
    return "Delivery";
  }

  return null;
}

function getRoleFromToken(token: string | null): UserRole | null {
  if (!token) {
    return null;
  }

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) {
      return null;
    }

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`;
    const payloadJson = atob(paddedBase64);
    const claims = JSON.parse(payloadJson) as Record<string, unknown>;
    const rawRole = (claims.role ?? claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) as
      | string
      | undefined;

    return normalizeRole(rawRole ?? null);
  } catch {
    return null;
  }
}

function readInitialState(): AuthState {
  const token = getAccessToken();
  const email = getSessionEmail();
  const role = getRoleFromToken(token) ?? normalizeRole(getSessionRole());

  if (import.meta.env.DEV) {
    console.debug("[Auth init]", { email, role, hasToken: Boolean(token) });
  }

  return {
    isAuthenticated: Boolean(token && email && role),
    token,
    email,
    role,
  };
}

function applySession(session: AuthResponse) {
  const normalizedRole = getRoleFromToken(session.token) ?? normalizeRole(session.role);

  setAccessToken(session.token);
  setRefreshToken(session.refreshToken);
  setSessionEmail(session.email);
  setSessionRole(normalizedRole ?? "Customer");
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>(readInitialState());

  const login = useCallback(async (payload: LoginRequest) => {
    const response = await loginRequest(payload);
    applySession(response);

    const normalizedRole = getRoleFromToken(response.token) ?? normalizeRole(response.role);

    if (import.meta.env.DEV) {
      console.debug("[Auth login]", { email: response.email, role: normalizedRole, hasToken: Boolean(response.token) });
    }

    setState({
      isAuthenticated: true,
      email: response.email,
      role: normalizedRole,
      token: response.token,
    });
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    const response = await registerRequest(payload);
    applySession(response);

    const normalizedRole = getRoleFromToken(response.token) ?? normalizeRole(response.role);

    if (import.meta.env.DEV) {
      console.debug("[Auth register]", { email: response.email, role: normalizedRole, hasToken: Boolean(response.token) });
    }

    setState({
      isAuthenticated: true,
      email: response.email,
      role: normalizedRole,
      token: response.token,
    });
  }, []);

  const logout = useCallback(() => {
    clearSessionStorage();
    setState({
      isAuthenticated: false,
      email: null,
      role: null,
      token: null,
    });
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await refresh(refreshToken);
      applySession(response);

      const normalizedRole = getRoleFromToken(response.token) ?? normalizeRole(response.role);

      setState({
        isAuthenticated: true,
        email: response.email,
        role: normalizedRole,
        token: response.token,
      });
    } catch {
      logout();
    }
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      register,
      logout,
      refreshSession,
    }),
    [login, logout, refreshSession, register, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}

