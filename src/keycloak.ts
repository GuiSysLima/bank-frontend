import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8180",
  realm: 'bank-realm',
  clientId: 'bank-frontend'
});

export default keycloak;