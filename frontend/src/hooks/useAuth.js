'use client'; // hooks use React state = client side only

import { useState, useEffect } from "react";
import { getUserFromToken, getUserRoleFromToken } from "@/lib/auth";
import authService from "@/services/authService";

// This hook gives any component access to current user info
// Usage in any component: const { user, role, isLoggedIn } = useAuth();
export function useAuth() {
  const [user, setUser] = useState(null);
  // user = { email, fullName, authorities } or null

  useEffect(() => {
    // On component mount, read token from localStorage and decode it
    // This runs ONCE when the component first renders
    const userData = getUserFromToken();
    setUser(userData);
  }, []); // [] = run once only

  return {
    user,                          // full user object
    role: getUserRoleFromToken(),  // "ADMIN" or "CLIENT" or null
    isLoggedIn: !!user,            // true/false
    logout: authService.logout,    // function to call when clicking logout button
  };
}