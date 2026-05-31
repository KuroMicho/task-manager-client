import axios from "axios";

const api = axios.create({
  baseURL:
    (import.meta as any).env?.VITE_API_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await axios.post(
          `${api.defaults.baseURL}/auth/logout`,
          {},
          { withCredentials: true },
        );
      } catch (logoutError) {
        console.error(
          "No se pudo notificar el logout al servidor, procediendo con purga local.",
        );
      }

      localStorage.clear();
      sessionStorage.clear();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
