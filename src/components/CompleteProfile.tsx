import React, { useState } from 'react';
import api from '../api';
import keycloak from '../keycloak';
import { useUser } from '../contexts/UserContext';

// Tipo para o DTO de criação
interface UserCreateRequest {
  name: string;
  cpf: string;
  email: string;
}

export const CompleteProfile = () => {
  const { setUser, setIsLoading } = useUser();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');

  // Pega o email do token do Keycloak
  const emailFromToken = keycloak.tokenParsed?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const userData: UserCreateRequest = {
      name,
      cpf,
      email: emailFromToken
    };

    try {
      setIsLoading(true);
      // 1. Chama o POST /users (que já fizemos no backend)
      const response = await api.post('/users', userData);
      
      // 2. Se deu certo, salva o usuário no Context e "libera" o app
      setUser(response.data); 

    } catch (err: any) {
      console.error(err);
      setError('Falha ao criar perfil. ' + (err.response?.data?.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Complete seu Perfil</h2>
      <p>Bem-vindo! Vimos que é seu primeiro acesso. Por favor, complete seu cadastro.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>CPF:</label>
          <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
        </div>
        <div>
          <label>Email (do Keycloak):</label>
          <input type="email" value={emailFromToken} disabled />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Salvar Perfil</button>
      </form>
    </div>
  );
};