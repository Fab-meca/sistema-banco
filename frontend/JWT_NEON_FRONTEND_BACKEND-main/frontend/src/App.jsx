import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Contas from './pages/Products.jsx';
import Transacoes from './pages/Transacoes.jsx';

const linkStyle = { color: 'inherit', textDecoration: 'none', fontWeight: 600 };

function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <h1> Sistema de Banco </h1>
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/contas" style={linkStyle}>Contas</Link>
        <Link to="/transacoes" style={linkStyle}>Transações</Link>
      </nav>
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
        path="/transacoes"
        element={
          <RotaProtegida>
            <div className="app-shell">
              <Topbar />
              <Transacoes />
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