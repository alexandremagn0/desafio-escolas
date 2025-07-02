import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Interceptador pra mandar o token JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
