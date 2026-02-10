import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { httpClient } from "@shared/api/http/httpClient.js";
import { endpoints } from "@shared/api/http/endpoints.js";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  async function refreshMe() {
    try {
      const res = await httpClient.get(endpoints.auth.me);
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setBooting(false);
    }
  }

  useEffect(() => {
    refreshMe();

    const on401 = () => {
      setUser(null);
    };
    window.addEventListener("ps:unauthorized", on401);
    return () => window.removeEventListener("ps:unauthorized", on401);
  }, []);

  const login = async ({ email, password }) => {
    const res = await httpClient.post(endpoints.auth.login, {
      email,
      password,
    });
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await httpClient.post(endpoints.auth.logout);
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      booting,
      isAuthed: !!user,
      user,
      login,
      logout,
      refreshMe,
    }),
    [booting, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
