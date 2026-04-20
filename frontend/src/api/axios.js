// ← configured axios instance (fix base URL here)

import axios from "axios";

// This function reads the backend URL from your .env.local file
// NEXT_PUBLIC_ prefix = accessible in browser (client-side)
// Fallback: if .env.local is missing, use localhost directly
const getBaseURL = () => {
  // For the backend : Spring Boot app
  return process.env.NEXT_PUBLIC_API_BACKENDSPRINGBOOT_URL || "http://localhost:8080/api/v1";
};

// Create a configured axios instance
// Think of it as a "pre-configured fetch" — base URL already set,
// Content-Type already set, so you don't repeat it in every call
const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //  Envoie le cookie jwt automatiquement
});

// Plus besoin d'intercepteur de requête — le cookie est envoyé automatiquement par le navigateur


// INTERCEPTOR on RESPONSE — runs on every response that comes back
API.interceptors.response.use(
  (response) => response, // if response is OK (2xx), just pass it through unchanged
  (error) => {
    // If backend returns 401 Unauthorized = token expired or invalid
    if (error.response?.status === 401 && typeof window !== "undefined") {
      window.location.href = "/login"; // force redirect to login
    }
    return Promise.reject(error); // always re-throw so the calling code can catch it too
  }
);

export default API; // use this for PROTECTED routes (needs login)

// Instance publique : pour les appels sans authentification (register, login)
// Second instance — NO interceptors, NO token attached
// Use this for login and register (user doesn't have a token yet)
export const PublicAPI = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //  Nécessaire pour que le Set-Cookie du login soit accepté
});