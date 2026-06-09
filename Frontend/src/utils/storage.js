export const TOKEN_KEY = "ecommerceai_token";
export const REFRESH_TOKEN_KEY = "ecommerceai_refresh_token";
export const SESSION_EMAIL_KEY = "ecommerceai_email";
export const SESSION_ROLE_KEY = "ecommerceai_role";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getSessionEmail() {
  return localStorage.getItem(SESSION_EMAIL_KEY);
}

export function setSessionEmail(email) {
  localStorage.setItem(SESSION_EMAIL_KEY, email);
}

export function clearSessionEmail() {
  localStorage.removeItem(SESSION_EMAIL_KEY);
}

export function getSessionRole() {
  return localStorage.getItem(SESSION_ROLE_KEY);
}

export function setSessionRole(role) {
  localStorage.setItem(SESSION_ROLE_KEY, role);
}

export function clearSessionRole() {
  localStorage.removeItem(SESSION_ROLE_KEY);
}

export function clearSessionStorage() {
  clearAccessToken();
  clearRefreshToken();
  clearSessionEmail();
  clearSessionRole();
}
