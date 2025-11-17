// Em src/App.tsx
import React, { useEffect } from 'react';
import keycloak from './keycloak';
import api from './api';
import { useUser } from './contexts/UserContext';
import { CompleteProfile } from './components/CompleteProfile';

function Dashboard() {
  const { user } = useUser();
  
  return (
    <div>
      <h1>Bank Dashboard</h1>
      <p>Bem-vindo, {user?.name}!</p>
      <button onClick={() => keycloak.logout()}>Logout</button>
      <hr />
      <h2>Seu Perfil (do banco de dados):</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

function App() {
  const { user, setUser, isLoading, setIsLoading } = useUser();

  useEffect(() => {
    // 1. Função para checar o perfil no backend
    const checkUserProfile = async () => {
      try {
        // 2. Chama o GET /users/me
        const response = await api.get('/users/me');
        
        // 3. (Cenário A) Usuário existe! Salva no context.
        setUser(response.data);

      } catch (error: any) {
        // 4. (Cenário B) Usuário NÃO existe (404)
        if (error.response && error.response.status === 404) {
          setUser(null); // Garante que está nulo
        } else {
          // Outro erro (500, etc)
          console.error("Erro ao buscar perfil:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserProfile();
  }, [setUser, setIsLoading]); // Roda apenas uma vez no load

  // --- Lógica de Renderização ---

  // 1. Mostra "Carregando..." enquanto o Keycloak e o /users/me rodam
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // 2. Se terminou de carregar E o usuário é nulo, mostra o formulário
  if (!user) {
    return <CompleteProfile />;
  }

  // 3. Se terminou de carregar E o usuário existe, mostra o app principal
  return <Dashboard />;
}

export default App;