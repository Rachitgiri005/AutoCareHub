import { createContext, useContext, useState, useCallback } from "react";
import api from "../utils/api";

const Ctx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });

  const login = useCallback((userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
  }, []);

  const updateUser = useCallback((data) => {
    const u = { ...user, ...data };
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
  }, [user]);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      updateUser(data);
    } catch (_) {}
  }, [updateUser]);

  return (
    <Ctx.Provider value={{ user, login, logout, updateUser, refreshUser }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);