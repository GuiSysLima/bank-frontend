import React, { useState } from 'react';
import api from '../api';
import keycloak from '../keycloak';
import { useUser } from '../contexts/UserContext';

interface UserCreateRequest {
  name: string;
  cpf: string;
  email: string;
}

export const CompleteProfile = () => {
  const { setUser } = useUser(); 

  const [submitting, setSubmitting] = useState(false);
  
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');

  const emailFromToken = keycloak.tokenParsed?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const cleanCpf = cpf.replace(/\D/g, '');

    const userData: UserCreateRequest = {
      name,
      cpf: cleanCpf,
      email: emailFromToken
    };

    try {
      const response = await api.post('/users', userData);
      
      setUser(response.data); 

    } catch (err: any) {
      setSubmitting(false);
      console.error('Erro no cadastro:', err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Falha ao conectar com o servidor.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '50px auto' }}>
      <h2>Complete seu Perfil</h2>
      <p>Bem-vindo! Vimos que é seu primeiro acesso. Por favor, complete seu cadastro.</p>
      
      {error && (
        <div style={{ 
            backgroundColor: '#ffdddd', 
            color: '#d32f2f', 
            padding: '15px', 
            marginBottom: '20px',
            border: '1px solid #d32f2f',
            borderRadius: '4px',
            fontWeight: 'bold'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block' }}>Nome:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
            disabled={submitting} 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block' }}>CPF:</label>
          <input 
            type="text" 
            value={cpf} 
            onChange={(e) => setCpf(e.target.value)} 
            required 
            disabled={submitting}
            placeholder="000.000.000-00"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block' }}>Email (do Keycloak):</label>
          <input 
            type="email" 
            value={emailFromToken} 
            disabled 
            style={{ width: '100%', padding: '8px', backgroundColor: '#eee' }}
          />
        </div>
        
        <button 
            type="submit"
            disabled={submitting}
            style={{ 
                padding: '10px 20px', 
                backgroundColor: submitting ? '#ccc' : '#007bff',
                color: 'white', 
                border: 'none', 
                cursor: submitting ? 'not-allowed' : 'pointer' 
            }}
        >
            {submitting ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </form>
    </div>
  );
};