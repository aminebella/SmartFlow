import API, { PublicAPI } from "../api/axios";

// Connexion (Login)
export const login = async (email, password) => {
  const response = await PublicAPI.post("/auth/login", { email, password });
  return response.data;
};

// Inscription (Register)
export const register = async (userData) => {
  const response = await PublicAPI.post("/auth/register", {
    firstname: userData.firstname,
    lastname: userData.lastname,
    email: userData.email,
    password: userData.password,
    bio: userData.bio,
    isClient: userData.isClient,
  });
  return response.data;
};
// authService.js — ajoute cette fonction
export const activateAccount = async (token) => {
  const response = await PublicAPI.get(`/auth/activate-account?token=${token}`);
  return response.data;
};

// Déconnexion (Logout)
export const logout = async () => {
  try {
    await API.post("/auth/logout");
  } finally {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
};


export const getCurrentUser = async () => {
  try {
    const response = await API.get("/auth/me");
    return response.data;
    // Expected response from Spring Boot:
    // { id: 1, email: "ali@test.com", fullName: "Ali Hassan", role: "CLIENT" }
  } catch {
    return null; // 401 = not logged in
  }
};

// Vérifier si connecté
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return user !== null;
};