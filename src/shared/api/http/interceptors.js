export function getAuthToken() {
  try {
    const raw = localStorage.getItem("ps_auth");
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.token || null;
  } catch {
    return null;
  }
}
