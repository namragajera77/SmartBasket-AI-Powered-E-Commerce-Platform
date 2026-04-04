export const TOKEN_KEY = "ecommerceai_token";
export const REFRESH_TOKEN_KEY = "ecommerceai_refresh_token";
export const SESSION_EMAIL_KEY = "ecommerceai_email";
export const SESSION_ROLE_KEY = "ecommerceai_role";

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getSessionEmail(): string | null {
  return localStorage.getItem(SESSION_EMAIL_KEY);
}

export function setSessionEmail(email: string): void {
  localStorage.setItem(SESSION_EMAIL_KEY, email);
}

export function clearSessionEmail(): void {
  localStorage.removeItem(SESSION_EMAIL_KEY);
}

export function getSessionRole(): string | null {
  return localStorage.getItem(SESSION_ROLE_KEY);
}

export function setSessionRole(role: string): void {
  localStorage.setItem(SESSION_ROLE_KEY, role);
}

export function clearSessionRole(): void {
  localStorage.removeItem(SESSION_ROLE_KEY);
}

export function clearSessionStorage(): void {
  clearAccessToken();
  clearRefreshToken();
  clearSessionEmail();
  clearSessionRole();
}

