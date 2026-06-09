import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  login as loginRequest,
  refresh,
  register as registerRequest,
} from "../api/authApi";
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

const AuthContext = createContext(null);

function normalizeRole(role) {
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

function getRoleFromToken(token) {
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
    const claims = JSON.parse(payloadJson);
    const rawRole =
      claims.role ??
      claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    return normalizeRole(rawRole ?? null);
  } catch {
    return null;
  }
}

function readInitialState() {
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

function applySession(session) {
  const normalizedRole =
    getRoleFromToken(session.token) ?? normalizeRole(session.role);

  setAccessToken(session.token);
  setRefreshToken(session.refreshToken);
  setSessionEmail(session.email);
  setSessionRole(normalizedRole ?? "Customer");
}

export function AuthProvider({ children }) {
  const [state, setState] = useState(readInitialState());

  const login = useCallback(async (payload) => {
    const response = await loginRequest(payload);
    applySession(response);

    const normalizedRole =
      getRoleFromToken(response.token) ?? normalizeRole(response.role);

    if (import.meta.env.DEV) {
      console.debug("[Auth login]", {
        email: response.email,
        role: normalizedRole,
        hasToken: Boolean(response.token),
      });
    }

    setState({
      isAuthenticated: true,
      email: response.email,
      role: normalizedRole,
      token: response.token,
    });
  }, []);

  const register = useCallback(async (payload) => {
    const response = await registerRequest(payload);
    applySession(response);

    const normalizedRole =
      getRoleFromToken(response.token) ?? normalizeRole(response.role);

    if (import.meta.env.DEV) {
      console.debug("[Auth register]", {
        email: response.email,
        role: normalizedRole,
        hasToken: Boolean(response.token),
      });
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

      const normalizedRole =
        getRoleFromToken(response.token) ?? normalizeRole(response.role);

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

  const value = useMemo(
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
