import React, { useEffect, useState } from 'react';

export default function ContaForm({ contaEmEdicao, onSalvar, onCancelar }) {
  const [numero, setNumero] = useState('');

  useEffect(() => {
    if (contaEmEdicao) {
      setNumero(contaEmEdicao.numero ?? '');
    } else {
      setNumero('');
    }
  }, [contaEmEdicao]);

  function handleSubmit(event) {
    event.preventDefault();
    onSalvar({ numero });
  }

  const modoEdicao = !!contaEmEdicao;

  return (
    <div className="card">
      <h2>{modoEdicao ? 'Editar conta' : 'Nova conta'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="numero">Número da conta</label>
            <input
              id="numero"
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="Ex: 0001-1"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" style={{ width: 'auto' }}>
            {modoEdicao ? 'Salvar alterações' : 'Adicionar conta'}
          </button>

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