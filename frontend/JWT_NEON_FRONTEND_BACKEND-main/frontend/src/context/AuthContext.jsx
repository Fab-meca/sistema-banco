import React, { createContext, useContext, useState } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'my_neon_token';
const STORAGE_USER_KEY = 'my_neon_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(() => {
    const salvo = localStorage.getItem(STORAGE_USER_KEY);
    return salvo ? JSON.parse(salvo) : null;
  });

  async function login(email, senha) {
    const data = await api.login({ email, senha });
    setToken(data.token);
    localStorage.setItem(STORAGE_KEY, data.token);

    const infoUsuario = { email };
    setUser(infoUsuario);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(infoUsuario));
  }

  async function registrar(nome, email, senha) {
    await api.registrar({ nome, email, senha });
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
  }

  const value = {
    token,
    user,
    estaLogado: !!token,
    login,
    registrar,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider>');
  }
  return context;
}