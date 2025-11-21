import { useEffect } from 'react';
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
    const checkUserProfile = async () => {
      try {
        
        const response = await api.get('/users/me');
        
        //(Cenário A) Usuário existe!
        setUser(response.data);

      } catch (error: any) {
        //(Cenário B) Usuário NÃO existe (404)
        if (error.response && error.response.status === 404) {
          setUser(null);
        } else {
          //Outro erro (500, etc)
          console.error("Erro ao buscar perfil:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserProfile();
  }, [setUser, setIsLoading]);

  // --- Lógica de Renderização ---

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <CompleteProfile />;
  }

  return <Dashboard />;
}

export default App;