import axios from 'axios';

// URL base do backend
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ------------------------------------------------------------------
// Interceptor:
// Antes de toda requisição, se existir um token,
// ele é colocado automaticamente no Authorization.
// ------------------------------------------------------------------
api.interceptors.request.use((config) => {

  const token = config.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ------------------------------------------------------------------
// Tratamento único de erros.
// ------------------------------------------------------------------
async function request(config) {
  try {
    const response = await api(config);

    return response.data;

  } catch (error) {

    const mensagem =
      error.response?.data?.error ||
      'Erro ao comunicar com o servidor.';

    throw new Error(mensagem);
  }
}

// ===============================================================
// LOGIN
// ===============================================================

export function registrar({ email, username, password }) {

  return request({

    url: '/register',

    method: 'POST',

    data: { email, username, password },

  });

}

export function login({ username, password }) {

  return request({

    url: '/login',

    method: 'POST',

    data: { username, password },

  });

}

// ===============================================================
// PRODUTOS
// ===============================================================

export function listarProdutosporDono(token) {

  return request({

    url: '/api/me/products',

    token,

  });

}

export function buscarProdutoPorId(id, token) {

  return request({

    url: `/api/products/${id}`,

    token,

  });

}

export function criarProduto(produto, token) {

  return request({

    url: '/api/products',

    method: 'POST',

    data: produto,

    token,

  });

}

export function atualizarProduto(id, produto, token) {

  return request({

    url: `/api/products/${id}`,

    method: 'PUT',

    data: produto,

    token,

  });

}

export function deletarProduto(id, token) {

  return request({

    url: `/api/products/${id}`,

    method: 'DELETE',

    token,

  });

}