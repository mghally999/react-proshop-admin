import { getAuthToken } from "./interceptors.js";

export async function httpClient(url, { method = "GET", body, headers } = {}) {
  const token = getAuthToken();

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  // ...same as before
}
