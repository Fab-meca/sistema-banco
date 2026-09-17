import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Contas from './pages/Products.jsx';

function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <h1> Sistema de Banco </h1>
      <div className="topbar-user">
        <span>Olá, {user?.email}</span>
        <button className="btn btn-secondary btn-small" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}

function AppRoutes() {
  const { estaLogado } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/contas"
        element={
          <RotaProtegida>
            <div className="app-shell">
              <Topbar />
              <Contas />
            </div>
          </RotaProtegida>
        }
      />

      <Route
        path="*"
        element={<Navigate to={estaLogado ? '/contas' : '/login'} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}