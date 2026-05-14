import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true, // Para las cookies de sesión
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
