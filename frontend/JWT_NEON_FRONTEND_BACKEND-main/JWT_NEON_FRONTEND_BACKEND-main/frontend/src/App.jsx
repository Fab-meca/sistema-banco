import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import RotaProtegida from './components/RotaProtegida.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Products from './pages/Products.jsx';

// Barra superior, exibida apenas nas telas internas (depois do login).
// Mostra o nome do usuário logado e o botão de sair.
function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <h1> Trekko's Shop </h1>
      <div className="topbar-user">
        <span>Olá, {user?.username}</span>
        <button className="btn btn-secondary btn-small" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}

// Componente interno que decide o que renderizar em cada rota.
// Ele fica DENTRO do <AuthProvider> para poder usar useAuth().
function AppRoutes() {
  const { estaLogado } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/products"
        element={
          <RotaProtegida>
            <div className="app-shell">
              <Topbar />
              <Products />
            </div>
          </RotaProtegida>
        }
      />

      {/*
        Rota "coringa": qualquer caminho não mapeado acima cai aqui.
        Mandamos o usuário para /products (se logado) ou /login (se não).
      */}
      <Route
        path="*"
        element={<Navigate to={estaLogado ? '/products' : '/login'} replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    // AuthProvider envolve TODA a aplicação, para que qualquer tela
    // (login, registro, produtos, etc.) possa acessar o contexto de
    // autenticação usando o hook useAuth().
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
