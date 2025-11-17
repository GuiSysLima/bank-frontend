// Em src/main.tsx

import React from 'react';
import { UserProvider } from './contexts/UserContext';
import ReactDOM from 'react-dom/client';
import App from './App';
import keycloak from './keycloak';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// 1. Tela de "Carregando..."
root.render(
  <React.StrictMode>
    <div>Carregando...</div>
  </React.StrictMode>
);

// 2. Inicializa o Keycloak
keycloak.init({ onLoad: 'login-required' })
  .then((authenticated) => {
    
    if (authenticated) {
      root.render(
        <React.StrictMode>
          <UserProvider> {/* <-- Adicione aqui */}
            <App />
          </UserProvider> {/* <-- E aqui */}
        </React.StrictMode>
      );
    } else {
      // 4. Falha ao autenticar
      root.render(
        <React.StrictMode>
          <div>Falha ao autenticar. Por favor, tente novamente.</div>
        </React.StrictMode>
      );
    }
  })
  .catch((error) => {
    console.error("Falha na inicialização do Keycloak", error);
    root.render(
      <React.StrictMode>
        <div>Erro ao conectar com o Keycloak.</div>
      </React.StrictMode>
    );
  });