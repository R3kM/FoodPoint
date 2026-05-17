/**
 * useAuth
 * ────────
 * Gerencia autenticação: login, registro e logout.
 *
 * SEGURANÇA:
 * - O token JWT é armazenado em sessionStorage["fp_token"] (isolado por aba/sessão)
 * - Os dados do usuário em sessionStorage["fp_user"] NUNCA incluem senha
 * - Em produção, considere cookies HttpOnly para maior segurança
 */

import { useState, useCallback } from "react";
import { login, registerClient, registerSeller } from "../services/api";

const USER_KEY  = "fp_user";

function loadUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    // Garante que nenhuma senha ou dado sensível está no objeto
    const { senha, password, confirma_senha, ...safe } = u;
    return safe;
  } catch {
    return null;
  }
}

function saveUser(user) {
  if (!user) return;
  // Nunca persiste campos de senha
  const { senha, password, confirma_senha, ...safe } = user;
  sessionStorage.setItem(USER_KEY, JSON.stringify(safe));
}

export function useAuth() {
  const [user,    setUser]    = useState(loadUser);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleLogin = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await login(credentials);
    setLoading(false);
    if (err) { setError(err); return null; }
    saveUser(data);
    setUser(data);
    return data;
  }, []);

  const handleRegister = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    const { tipo, ...payload } = formData;
    const fn = tipo === "seller" ? registerSeller : registerClient;
    const { data, error: err } = await fn(payload);
    setLoading(false);
    if (err) { setError(err); return null; }
    saveUser(data);
    setUser(data);
    return data;
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem("fp_token");
    sessionStorage.removeItem("fp_cart");
    setUser(null);
    setError(null);
  }, []);

  const updateUser = useCallback((updated) => {
    const merged = { ...user, ...updated };
    saveUser(merged);
    setUser(merged);
  }, [user]);

  return { user, loading, error, login: handleLogin, register: handleRegister, logout: handleLogout, updateUser };
}
