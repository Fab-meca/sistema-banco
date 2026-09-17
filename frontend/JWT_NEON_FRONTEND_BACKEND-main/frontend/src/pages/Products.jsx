import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../services/api.js';
import ContaForm from '../components/ContaForm.jsx';

export default function Contas() {
  const { token } = useAuth();

  const [contas, setContas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [contaEmEdicao, setContaEmEdicao] = useState(null);

  useEffect(() => {
    carregarContas();
  }, []);

  async function carregarContas() {
    setCarregando(true);
    setErro('');
    try {
      const dados = await api.listarContas(token);
      setContas(dados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleSalvar(dadosDoFormulario) {
    setErro('');
    try {
      if (contaEmEdicao) {
        await api.atualizarConta(contaEmEdicao.id, dadosDoFormulario, token);
      } else {
        await api.criarConta(dadosDoFormulario, token);
      }
      setContaEmEdicao(null);
      await carregarContas();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function handleExcluir(conta) {
    const confirmou = window.confirm(
      `Excluir a conta "${conta.numero}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmou) return;

    setErro('');
    try {
      await api.deletarConta(conta.id, token);
      await carregarContas();
    } catch (err) {
      setErro(err.message);
    }
  }

  function formatarSaldo(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  return (
    <div className="container">
      {erro && <div className="alert-error">{erro}</div>}

      <ContaForm
        contaEmEdicao={contaEmEdicao}
        onSalvar={handleSalvar}
        onCancelar={() => setContaEmEdicao(null)}
      />

      <div className="table-wrapper">
        {carregando ? (
          <div className="loading-state">Carregando contas...</div>
        ) : contas.length === 0 ? (
          <div className="empty-state">Nenhuma conta cadastrada ainda.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Número</th>
                <th>Saldo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {contas.map((conta) => (
                <tr key={conta.id}>
                  <td>{conta.numero}</td>
                  <td>{formatarSaldo(conta.saldo)}</td>
                  <td className="actions">
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => setContaEmEdicao(conta)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => handleExcluir(conta)}
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