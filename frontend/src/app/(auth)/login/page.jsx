'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { login, getCurrentUser } from "@/services/authService";
function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setGeneralError("");
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError("");

    try {
      // 1. Attendre la connexion
      await login(formData.email, formData.password);

      // 2. Attendre la récupération de l'utilisateur
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Session non trouvée");
      }

      // 3. Redirection conditionnelle
      if (user.roles?.includes('ADMIN')) {
        router.push("/EspaceAdmin/dashboard");
      } else if (user.roles?.includes('CLIENT')) {
        router.push("/EspaceClient/dashboard");
      }
    } catch (error) {
      setGeneralError("Erreur lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      {/* SECTION GAUCHE - FORMULAIRE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-900">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center">
             <h2 className="text-3xl font-bold text-white mb-2">Bon retour !</h2>
             <p className="text-slate-400">Connectez-vous pour accéder à votre espace</p>
          </div>

          {generalError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2 text-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votreEmail@gmail.com"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-white mb-2 text-sm">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg hover:from-orange-500 hover:to-red-500 transition-all font-medium disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="text-center text-slate-400">
            <p>
              Pas encore de compte ?{" "}
              <button 
                onClick={() => router.push("/register")}
                className="text-orange-500 hover:text-orange-400 transition-colors font-medium hover:underline"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;