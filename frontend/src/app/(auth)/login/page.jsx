'use client';

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/services/authService";

function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- ANIMATIONS ---
  const binaryRainData = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      left: `${(i * 7) % 100}%`,
      top: `-${Math.random() * 20}%`,
      animationDuration: `${2 + Math.random()}s`,
      animationDelay: `${Math.random() * 3}s`,
      text: Array.from({length: 20}, () => Math.random() > 0.5 ? '1' : '0').join('')
    }))
  , []);

  const particlesData = useMemo(() =>
    Array.from({ length: 20 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${Math.random() * 2 + 1}s`
    }))
  , []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setGeneralError("");
  };

  // Redirection vers espace client
  const redirectToClientSpace = () => {
    router.push("/EspaceClient");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError("");

    try {
      // Appel API backend
      const response = await login(formData.email, formData.password);

      console.log("Connexion réussie:", response);

      // Token stocké dans les cookies (HTTPOnly)
      // Redirection vers espace client
      redirectToClientSpace();

    } catch (error) {
      console.error("Erreur de connexion:", error);

      // Gestion des erreurs de validation ASP.NET Core
      if (error.response?.data?.errors) {
        // Extraire les messages d'erreur de validation
        const validationErrors = error.response.data.errors;
        const errorMessages = Object.values(validationErrors)
          .flat()
          .join(' • ');
        setGeneralError(errorMessages);
      }
      // Erreur 401 - Credentials incorrects
      else if (error.response?.status === 401) {
        setGeneralError("Email ou mot de passe incorrect");
      }
      // Erreur 403 - Compte non activé
      else if (error.response?.status === 403) {
        setGeneralError("Compte non activé. Veuillez vérifier votre email.");
      }
      // Message d'erreur personnalisé du backend
      else if (error.response?.data?.message) {
        setGeneralError(error.response.data.message);
      }
      // Titre ou message alternatif
      else if (error.response?.data?.title) {
        setGeneralError(error.response.data.title);
      }
      // Erreur réseau ou autre
      else if (error.message) {
        setGeneralError(error.message);
      }
      else {
        setGeneralError("Une erreur est survenue. Veuillez réessayer.");
      }
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

          {/* Affichage des erreurs générales */}
          {generalError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
              {generalError}
            </div>
          )}

          <div className="space-y-6">
            
            {/* Champ Email */}
            <div>
              <label className="block text-white mb-2 text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votreEmail@gmail.com"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-white mb-2 text-sm">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg hover:from-orange-500 hover:to-red-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Connexion...
                </div>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>

          {/* Lien vers Inscription */}
          <div className="text-center text-slate-400">
            <p>
              Pas encore de compte ?{" "}
              <button 
                onClick={() => router.push("/authentification/register")}
                className="text-orange-500 hover:text-orange-400 transition-colors font-medium hover:underline"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* SECTION DROITE - VISUELS */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-800 via-slate-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-2xl shadow-orange-500/50 animate-pulse">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={`orbit-${i}`}
                className="absolute w-3 h-3 bg-orange-400 rounded-full top-1/2 left-1/2 animate-spin"
                style={{
                  animationDuration: `${3 + i * 0.5}s`,
                  animationDelay: `${i * 0.3}s`,
                  transformOrigin: '0 0',
                  transform: `rotate(${i * 45}deg) translateX(80px)`
                }}
              ></div>
            ))}
          </div>

          <div className="absolute inset-0">
             <div className="absolute top-20 left-20 animate-bounce" style={{animationDuration: '3s'}}>
               <div className="w-16 h-16 rounded-lg bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 flex items-center justify-center">
                 <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
               </div>
             </div>
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {binaryRainData.map((data, i) => (
              <div
                key={`binary-${i}`}
                className="absolute text-orange-500/30 font-mono text-xs whitespace-nowrap animate-pulse"
                style={{
                  left: data.left,
                  top: data.top,
                  animationDuration: data.animationDuration,
                  animationDelay: data.animationDelay
                }}
              >
                {data.text}
              </div>
            ))}
          </div>

          <div className="relative text-center space-y-4 mt-8">
            <h2 className="text-3xl font-bold text-white">IT Community</h2>
            <p className="text-slate-300 max-w-md">
              Heureux de vous revoir parmi nous.
            </p>
          </div>
        </div>

        {particlesData.map((data, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-ping"
            style={{
              left: data.left,
              top: data.top,
              animationDelay: data.animationDelay,
              animationDuration: data.animationDuration
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default LoginPage;