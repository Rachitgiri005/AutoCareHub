import axios from "axios";

const api = axios.create({
  // This tells the frontend to use the Render link when live, and the proxy when local
  baseURL: import.meta.env.MODE === "production" 
    ? "https://autocarehub-4.onrender.com/api" 
    : "/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;