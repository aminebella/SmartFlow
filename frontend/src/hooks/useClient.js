'use client';

import { useState, useEffect } from "react";
import { getAllClients } from "@/services/usersService";

// Usage: const { clients, loading, error, refetch } = useClients(role);

export function useClients(role) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    try {
      setLoading(true);

      if (role === "ADMIN") {
        const data = await getAllClients();
        setClients(data);
      } else {
        setClients([]); 
      }

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role) fetchClients();
  }, [role]);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
    count: clients.length,
  };
}