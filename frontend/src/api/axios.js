import axios from "axios";

const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
};

// Instance principale — authentifiée via cookie HttpOnly automatiquement
const 
API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //  Envoie le cookie jwt automatiquement
});

// Plus besoin d'intercepteur de requête — le cookie est envoyé automatiquement par le navigateur

// Intercepteur de réponse — gère les 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;

// Instance publique — pour register, login (aussi withCredentials pour recevoir le cookie)
export const PublicAPI = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //  Nécessaire pour que le Set-Cookie du login soit accepté
});