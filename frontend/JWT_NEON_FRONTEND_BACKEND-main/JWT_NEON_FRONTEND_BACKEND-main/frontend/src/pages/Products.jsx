import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../services/api_old.js';
import ProductForm from '../components/ProductForm.jsx';

export default function Products() {
  const { token } = useAuth();

  // Lista de produtos vinda do backend.
  const [produtos, setProdutos] = useState([]);
  // Controla a mensagem "Carregando..." enquanto a requisição não termina.
  const [carregando, setCarregando] = useState(true);
  // Guarda mensagens de erro para mostrar na tela.
  const [erro, setErro] = useState('');
  // Quando não é null, guarda o produto que está sendo editado no momento
  // (isso faz o ProductForm entrar em "modo edição").
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);

  // ------------------------------------------------------------------
  // useEffect com array de dependências [] -> roda só UMA vez, quando
  // o componente é montado na tela (parecido com "componentDidMount"
  // das classes antigas do React). É aqui que buscamos os dados iniciais.
  // ------------------------------------------------------------------
  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    setCarregando(true);
    setErro('');
    try {
      const dados = await api.listarProdutosporDono(token);
      setProdutos(dados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  // Chamado pelo <ProductForm> quando o usuário envia o formulário.
  // Decide, sozinho, se deve CRIAR ou ATUALIZAR, com base em
  // "produtoEmEdicao" estar preenchido ou não.
  async function handleSalvar(dadosDoFormulario) {
    setErro('');
    try {
      if (produtoEmEdicao) {
        await api.atualizarProduto(produtoEmEdicao.id, dadosDoFormulario, token);
      } else {
        await api.criarProduto(dadosDoFormulario, token);
      }
      setProdutoEmEdicao(null);
      await carregarProdutos(); // recarrega a lista para refletir a mudança
    } catch (err) {
      setErro(err.message);
    }
  }

  async function handleExcluir(produto) {
    // confirm() é uma forma simples (nativa do navegador) de pedir
    // confirmação antes de uma ação destrutiva, como excluir um registro.
    const confirmou = window.confirm(
      `Excluir o produto "${produto.descricao}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmou) return;

    setErro('');
    try {
      await api.deletarProduto(produto.id, token);
      await carregarProdutos();
    } catch (err) {
      setErro(err.message);
    }
  }

  function formatarPreco(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  return (
    <div className="container">
      {erro && <div className="alert-error">{erro}</div>}

      {/*
        O mesmo componente ProductForm serve para criar E editar.
        Passamos "produtoEmEdicao" para ele saber em qual modo está,
        e duas funções de callback: uma para salvar, outra para cancelar
        a edição (que apenas limpa o estado "produtoEmEdicao").
      */}
      <ProductForm
        produtoEmEdicao={produtoEmEdicao}
        onSalvar={handleSalvar}
        onCancelar={() => setProdutoEmEdicao(null)}
      />

      <div className="table-wrapper">
        {carregando ? (
          <div className="loading-state">Carregando produtos...</div>
        ) : produtos.length === 0 ? (
          <div className="empty-state">Nenhum produto cadastrado ainda.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {/*
                O .map() percorre o array "produtos" e transforma cada
                item em uma linha (<tr>) da tabela. A prop "key" é obrigatória
                em listas no React: ela ajuda o React a saber qual item mudou,
                foi adicionado ou removido, sem precisar redesenhar tudo.
              */}
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.descricao}</td>
                  <td>{formatarPreco(produto.preco)}</td>
                  <td>{produto.quantidade}</td>
                  <td className="actions">
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => setProdutoEmEdicao(produto)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleExcluir(produto)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
