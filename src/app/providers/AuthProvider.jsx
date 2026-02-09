import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "ps_auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStoredAuth(value) {
  try {
    if (!value) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());
  const token = auth?.token || null;
  const user = auth?.user || null;

  useEffect(() => {
    writeStoredAuth(auth);
  }, [auth]);

  const login = async ({ email, password }) => {
    // ✅ placeholder for API call later
    // Example: const res = await httpClient(endpoints.auth.login, { method:"POST", body:{email,password} })
    // setAuth({ token: res.token, user: res.user })
    if (!email || !password) throw new Error("Email and password are required");

    // mock login
    setAuth({
      token: "mock-token",
      user: { id: "u1", name: "Admin", email }
    });
  };

  const logout = () => {
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      isAuthed: !!token,
      token,
      user,
      login,
      logout
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
