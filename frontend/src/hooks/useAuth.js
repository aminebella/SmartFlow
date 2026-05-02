'use client';

import { useState, useEffect } from "react";
import { logout,getCurrentUser } from "@/services/authService";

// Usage in any component: const { user, role, isLoggedIn, loading } = useAuth();
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // loading = true while we wait for /auth/me response
  // important: don't render protected content until loading=false

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  return {
    user,                           // { id, email, fullName, roles: [] }
    role: (user?.roles && user.roles.length > 0) ? user.roles[0] : null, // "ADMIN" or "CLIENT" or null
    isLoggedIn: !!user,
    loading,                        // true while checking auth
    logout,
  };
}