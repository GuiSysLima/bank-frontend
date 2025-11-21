import React, { useEffect } from 'react';
import keycloak from './keycloak';
import api from './api';
import { useUser } from './contexts/UserContext';
import { CompleteProfile } from './components/CompleteProfile';

import { Dashboard } from './components/Dashboard'; 

function App() {
  const { user, setUser, isLoading, setIsLoading } = useUser();

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          setUser(null);
        } else {
          console.error("Erro ao buscar perfil:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserProfile();
  }, [setUser, setIsLoading]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <CompleteProfile />;
  }
  
  return <Dashboard />; 
}

export default App;