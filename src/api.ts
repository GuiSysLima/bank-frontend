import axios from 'axios';
import keycloak from './keycloak';

// 1. Cria a instância do axios
const api = axios.create({
  baseURL: 'http://localhost:8080' // Sua API Spring Boot
});

// 2. Interceptor (o código é o mesmo)
api.interceptors.request.use(
  (config) => {
    if (keycloak.authenticated && keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;