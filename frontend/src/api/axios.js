import axios from "axios";

const getBaseURL = () => {
  // Pour le développement local avec ASP.NET Core
  return process.env.NEXT_PUBLIC_API_URL || "https://localhost:7250/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/authentification/authenticate";
    }
    return Promise.reject(error);
  }
);

export default API;

// Instance publique : pour les appels sans authentification (register, login)
export const PublicAPI = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});