import axios from 'axios';
import useAuthStore from '../store/auth';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const http = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

http.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default http;


