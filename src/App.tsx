import { useEffect } from 'react';
import api from './api';
import { useUser } from './contexts/UserContext';
import { Dashboard } from './components/Dashboard'; 

function App() {
  const { user, setUser, isLoading, setIsLoading } = useUser();

  useEffect(() => {
    const initUser = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
        
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          try {
            console.log("Usuário novo detectado. Sincronizando com o banco...");
            
            await api.post('/users');

            const newResponse = await api.get('/users/me');
            setUser(newResponse.data);

          } catch (createError) {
            console.error("Erro ao criar usuário automaticamente:", createError);
          }
        } else {
          console.error("Erro ao buscar perfil:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initUser();
  }, [setUser, setIsLoading]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Sincronizando perfil...</div>;
  }

  if (!user) {
    return <div>Erro ao carregar perfil. Tente logar novamente.</div>;
  }
  
  return <Dashboard />; 
}

export default App;