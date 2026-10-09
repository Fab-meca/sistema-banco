import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../services/api.js';

const selectStyle = {
  padding: '0.65rem 0.75rem',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  fontSize: 'inherit',
};

const mensagemSucesso = {
  deposito: 'Depósito realizado!',
  saque: 'Saque realizado!',
  transferencia: 'Transferência realizada!',
};

const textoBotao = {
  deposito: 'Depositar',
  saque: 'Sacar',
  transferencia: 'Transferir',
};

export default function Transacoes() {
  const { token } = useAuth();

  const [contas, setContas] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [contaId, setContaId] = useState('');
  const [tipo, setTipo] = useState('deposito');
  const [valor, setValor] = useState('');
  const [numeroDestino, setNumeroDestino] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setCarregando(true);
    setErro('');
    try {
      const [listaContas, listaTransacoes] = await Promise.all([
        api.listarContas(token),
        api.listarTransacoes(token),
      ]);
      setContas(listaContas);
      setTransacoes(listaTransacoes);
      if (listaContas.length > 0) {
        setContaId((atual) => atual || String(listaContas[0].id));
      }
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');
    setSucesso('');
    try {
      const dados = {
        contaId: Number(contaId),
        tipo,
        valor: parseFloat(valor),
      };
      if (tipo === 'transferencia') {
        dados.numeroDestino = numeroDestino.trim();
      }

      await api.criarTransacao(dados, token);
      setValor('');
      setNumeroDestino('');
      setSucesso(mensagemSucesso[tipo]);
      await carregarDados();
    } catch (err) {
      setErro(err.message);
    }
  }

  function formatarValor(v) {
    return Number(v).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  function formatarData(d) {
    return new Date(d).toLocaleString('pt-BR');
  }

  const minhasContasIds = contas.map((c) => c.id);

  function descrever(t) {
    if (t.tipo === 'deposito') {
      return { descricao: 'Depósito', entrada: true, conta: t.conta?.numero };
    }
    if (t.tipo === 'saque') {
      return { descricao: 'Saque', entrada: false, conta: t.conta?.numero };
    }

    const enviada = minhasContasIds.includes(t.conta?.id);
    if (enviada) {
      return {
        descricao: t.contaDestino
          ? `Transferência enviada para ${t.contaDestino.numero}`
          : 'Transferência enviada',
        entrada: false,
        conta: t.conta?.numero,
      };
    }
    return {
      descricao: `Transferência recebida de ${t.conta?.numero}`,
      entrada: true,
      conta: t.contaDestino?.numero,
    };
  }

  const contaSelecionada = contas.find((c) => String(c.id) === contaId);

  return (
    <div className="container">
      {erro && <div className="alert-error">{erro}</div>}
      {sucesso && (
        <div
          className="alert-error"
          style={{ color: '#16a394', backgroundColor: '#e6f7f4', borderColor: '#bfe8e0' }}
        >
          {sucesso}
        </div>
      )}

      <div className="card">
        <h2>Nova movimentação</h2>

        {!carregando && contas.length === 0 ? (
          <p>Você ainda não tem conta. Crie uma na tela de Contas primeiro.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="conta">Conta</label>
                <select
                  id="conta"
                  value={contaId}
                  onChange={(e) => setContaId(e.target.value)}
                  style={selectStyle}
                  required
                >
                  {contas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.numero}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Tipo</label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  style={selectStyle}
                >
                  <option value="deposito">Depósito</option>
                  <option value="saque">Saque</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>

              {tipo === 'transferencia' && (
                <div className="form-group">
                  <label htmlFor="destino">Conta de destino</label>
                  <input
                    id="destino"
                    type="text"
                    value={numeroDestino}
                    onChange={(e) => setNumeroDestino(e.target.value)}
                    placeholder="Ex: 6767-6"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="valor">Valor (R$)</label>
                <input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {contaSelecionada && (
              <p>
                Saldo atual: <strong>{formatarValor(contaSelecionada.saldo)}</strong>
              </p>
            )}

            <div className="form-actions">
              <button className="btn btn-primary" type="submit" style={{ width: 'auto' }}>
                {textoBotao[tipo]}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="table-wrapper">
        {carregando ? (
          <div className="loading-state">Carregando extrato...</div>
        ) : transacoes.length === 0 ? (
          <div className="empty-state">Nenhuma transação ainda.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Conta</th>
                <th>Descrição</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((t) => {
                const info = descrever(t);
                return (
                  <tr key={t.id}>
                    <td>{formatarData(t.data)}</td>
                    <td>{info.conta}</td>
                    <td>{info.descricao}</td>
                    <td style={{ color: info.entrada ? '#16a34a' : '#dc2626' }}>
                      {info.entrada ? '+ ' : '- '}
                      {formatarValor(t.valor)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}