import axios from 'axios';

// Centralized axios instance
const instance = axios.create({
   baseURL: import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000" 
  // withCredentials: true, // cookies/JWT use
});

// Add token automatically to all requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;  
  },
  (error) => Promise.reject(error)
);

export default instance; 