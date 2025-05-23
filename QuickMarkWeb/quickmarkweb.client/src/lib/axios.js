import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://localhost:7045",
    withCredentials: true,
    headers: {
        'Content-Type' : 'application/json'
    }
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    else {
        console.warn("No auth token available");
    }
    return config;
}, (error) => {
    return Promise.reject(error);
}
);

export default instance;