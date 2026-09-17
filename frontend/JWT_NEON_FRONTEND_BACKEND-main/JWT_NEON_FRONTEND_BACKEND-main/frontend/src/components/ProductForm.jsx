import React, { useEffect, useState } from 'react';

// ==========================================================================
// FORMULÁRIO DE PRODUTO — reutilizável para CRIAR e para EDITAR
// ==========================================================================
// Em vez de criar um formulário para "novo produto" e outro, quase igual,
// para "editar produto", criamos UM componente que serve para os dois casos.
//
// Como ele sabe se é criação ou edição? Pela prop "produtoEmEdicao":
// - Se for null/undefined -> formulário vazio, modo "criar".
// - Se vier um produto     -> formulário preenchido, modo "editar".
//
// A prop "onSalvar" é uma função passada pelo componente pai (Products.jsx),
// que decide o que fazer com os dados (chamar a API de criar ou de editar).
// Esse padrão, de o componente filho "avisar" o pai por meio de uma função
// recebida via props, é chamado de "callback" e é muito comum em React.
export default function ProductForm({ produtoEmEdicao, onSalvar, onCancelar }) {
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  // useEffect roda sempre que "produtoEmEdicao" mudar. É assim que
  // preenchemos o formulário automaticamente quando o usuário clica
  // em "Editar" numa linha da tabela.
  useEffect(() => {
    if (produtoEmEdicao) {
      setDescricao(produtoEmEdicao.descricao ?? '');
      setPreco(String(produtoEmEdicao.preco ?? ''));
      setQuantidade(String(produtoEmEdicao.quantidade ?? ''));
    } else {
      // Modo criação: garante que o formulário comece vazio.
      setDescricao('');
      setPreco('');
      setQuantidade('');
    }
  }, [produtoEmEdicao]);

  function handleSubmit(event) {
    event.preventDefault();

    // Convertendo os campos de texto para número antes de enviar,
    // já que <input type="number"> ainda entrega valores como string.
    onSalvar({
      descricao,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade, 10),
    });
  }

  const modoEdicao = !!produtoEmEdicao;

  return (
    <div className="card">
      <h2>{modoEdicao ? 'Editar produto' : 'Novo produto'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <input
              id="descricao"
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Teclado mecânico"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preco">Preço (R$)</label>
            <input
              id="preco"
              type="number"
              step="0.01"
              min="0"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantidade">Quantidade</label>
            <input
              id="quantidade"
              type="number"
              min="0"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" style={{ width: 'auto' }}>
            {modoEdicao ? 'Salvar alterações' : 'Adicionar produto'}
          </button>

          {/* O botão de cancelar só faz sentido no modo edição */}
          {modoEdicao && (
            <button type="button" className="btn btn-secondary" onClick={onCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
