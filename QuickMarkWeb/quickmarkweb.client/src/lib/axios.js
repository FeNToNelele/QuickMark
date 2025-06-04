import axios from "axios";

// Create an Axios instance with custom config
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 30000, // 30 seconds
  // Comment this out if issues arise with CORS
  headers: {
    "Content-Type": "application/json"
  }
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    console.log(`Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response);
    return response;
  },
  (error) => {
    console.error("Response error:", error);
    
    if (error.response) {
      // Server responded with non-2xx status
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Request setup error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;