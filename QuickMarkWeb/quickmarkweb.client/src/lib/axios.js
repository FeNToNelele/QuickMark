import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5023",
    // withCredentials: true,
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
}
);

export default instance;