import React, { useState, useEffect } from 'react';
import api from '../api';
import keycloak from '../keycloak';
import { useUser } from '../contexts/UserContext';
import { AccountType } from '../model/enums/AccountType';


interface Account {
  id: number;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
}

export const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccountType, setNewAccountType] = useState<AccountType>(AccountType.CHECKING_ACCOUNT);
  
  // Estados de UI
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/accounts')
      .then(response => {
        setAccounts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Não foi possível carregar suas contas.");
        setLoading(false);
      });
  }, []);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const request = { accountType: newAccountType };
      
      const response = await api.post('/accounts', request);
      
      setAccounts([...accounts, response.data]);
      alert("Conta criada com sucesso!");

    } catch (err: any) {
      console.error("Erro capturado:", err);

      // --- LÓGICA DE TRATAMENTO DE ERRO ---
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); 
      } else {
        setError("Erro desconhecido ao comunicar com o servidor.");
      }
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Cabeçalho */}
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Olá, {user?.name}</h1>
        <button onClick={() => keycloak.logout()} style={{ padding: '5px 10px' }}>
          Sair
        </button>
      </header>

      {/* Bloco de Erro (Aparece só se tiver erro) */}
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          border: '1px solid #ef9a9a', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px' 
        }}>
          <strong>Atenção:</strong> {error}
        </div>
      )}

      {/* Lista de Contas */}
      <section style={{ marginBottom: '30px' }}>
        <h2>Minhas Contas</h2>
        {accounts.length === 0 ? (
          <p>Você não possui contas ativas.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {accounts.map(acc => (
              <li key={acc.id} style={{ 
                border: '1px solid #ddd', 
                padding: '15px', 
                marginBottom: '10px', 
                borderRadius: '8px',
                backgroundColor: '#f9f9f9'
              }}>
                <strong>{acc.accountType === AccountType.CHECKING_ACCOUNT ? 'Conta Corrente' : 'Poupança'}</strong>
                <br />
                <span style={{ color: '#666' }}>Nº: {acc.accountNumber}</span>
                <br />
                <strong style={{ fontSize: '1.2em', color: '#2e7d32' }}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(acc.balance)}
                </strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <hr />

      {/* Formulário de Criação */}
      <section style={{ marginTop: '20px' }}>
        <h3>Abrir Nova Conta</h3>
        <form onSubmit={handleCreateAccount} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>Tipo:</label>
          <select 
            value={newAccountType} 
            onChange={(e) => setNewAccountType(e.target.value as AccountType)}
            style={{ padding: '8px' }}
          >
            <option value={AccountType.CHECKING_ACCOUNT}>Conta Corrente</option>
            <option value={AccountType.SAVINGS_ACCOUNT}>Conta Poupança</option>
          </select>
          
          <button type="submit" style={{ 
            padding: '8px 16px', 
            backgroundColor: '#1976d2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Confirmar Abertura
          </button>
        </form>
      </section>
    </div>
  );
};