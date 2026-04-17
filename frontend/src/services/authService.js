import { PublicAPI } from "../api/axios";
import { getUserFromToken } from "@/lib/auth"; // Importer la fonction

const authService = {
  // Connexion (Login)
  login: async (email, password) => {
    try {
      const response = await PublicAPI.post("/Auth/login", {
        email: email,
        password: password,
      });

      // Sauvegarder le token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        
        // Décoder le token pour extraire l'ID
        const userFromToken = getUserFromToken();
        
        if (userFromToken) {
          // Sauvegarder les infos complètes incluant l'ID du token
          localStorage.setItem("user", JSON.stringify({
            userId: userFromToken.id,  // ID extrait du token
            nom: response.data.nom,
            email: response.data.email,
          }));
        }
      }

      return response.data;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw error;
    }
  },

  // Inscription (Register)
  register: async (userData) => {
    try {
      const response = await PublicAPI.post("/Auth/register", {
        nom: userData.nom,
        email: userData.email,
        password: userData.password,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  },

  // Déconnexion (Logout)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (typeof window !== "undefined") {
      window.location.href = "/authentification/authenticate";
    }
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser: () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  },
};

export const loginUser = async (email, password) => {
  return await authService.login(email, password);
};

export default authService;