import Keycloak from 'keycloak-js';

// A configuração é a mesma
const keycloak = new Keycloak({
  url: 'http://localhost:8180',
  realm: 'bank-realm',
  clientId: 'bank-frontend' // O Client ID que você criou para o React
});

export default keycloak;