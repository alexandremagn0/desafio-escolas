import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 30000,
});

// Interceptador pra mandar o token JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Timeout específico para uploads de arquivo
  if (config.data instanceof FormData) {
    config.timeout = 60000; // 60 segundos para uploads
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptador de resposta para tratar erros
api.interceptors.response.use(response => {
  return response;
}, error => {
  console.error('Erro na requisição:', error);
  
  if (error.code === 'ECONNABORTED') {
    console.error('Timeout na requisição:', error.message);
  }
  
  return Promise.reject(error);
});

export default api;
