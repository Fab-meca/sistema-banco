import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = config.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function request(config) {
  try {
    const response = await api(config);
    return response.data;
  } catch (error) {
    const mensagem =
      error.response?.data?.erro ||
      'Erro ao comunicar com o servidor.';

    throw new Error(mensagem);
  }
}

// ===============================================================
// LOGIN / REGISTRO
// ===============================================================

export function registrar({ nome, email, senha }) {
  return request({
    url: '/register',
    method: 'POST',
    data: { nome, email, senha },
  });
}

export function login({ email, senha }) {
  return request({
    url: '/login',
    method: 'POST',
    data: { email, senha },
  });
}

// ===============================================================
// CONTAS
// ===============================================================

export function listarContas(token) {
  return request({
    url: '/contas',
    token,
  });
}

export function buscarContaPorId(id, token) {
  return request({
    url: `/contas/${id}`,
    token,
  });
}

export function criarConta(conta, token) {
  return request({
    url: '/contas',
    method: 'POST',
    data: conta,
    token,
  });
}

export function atualizarConta(id, conta, token) {
  return request({
    url: `/contas/${id}`,
    method: 'PUT',
    data: conta,
    token,
  });
}

export function deletarConta(id, token) {
  return request({
    url: `/contas/${id}`,
    method: 'DELETE',
    token,
  });
}