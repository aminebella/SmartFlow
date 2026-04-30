'use client';

import { useState, useEffect, useCallback } from "react";
import {
  getTickets, createTicket, updateTicket, deleteTicket,
} from "../services/taskService.js";
import { getSprintsByProject } from "../services/sprintService.js";
import { getProjectMembers } from "../services/projectService.js";
import API from "../api/axios.js";

export function useTickets(projectId) {
  const [tickets,     setTickets]     = useState([]);
  const [sprints,     setSprints]     = useState([]);
  const [members,     setMembers]     = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");

  const activeSprint = sprints.find((s) => s.status === "ACTIVE" || s.active);

  useEffect(() => {
    if (!projectId) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [ticketsData, sprintsData, membersData, meData] = await Promise.allSettled([
          getTickets(projectId),
          getSprintsByProject(projectId),
          getProjectMembers(projectId),
          API.get("/auth/me"),
        ]);

        // User connecté
        const me = meData.status === "fulfilled"
          ? (meData.value.data?.data || meData.value.data)
          : null;
        setCurrentUser(me);

        // Sprints
        setSprints(sprintsData.status === "fulfilled" && Array.isArray(sprintsData.value)
          ? sprintsData.value : []);

        // Membres
        setMembers(membersData.status === "fulfilled" && Array.isArray(membersData.value)
          ? membersData.value : []);

        // Tickets enrichis avec isAssignedToMe
        if (ticketsData.status === "fulfilled" && Array.isArray(ticketsData.value)) {
          const enriched = ticketsData.value.map((t) => ({
            ...t,
            isAssignedToMe: me
              ? String(t.assignedUserId) === String(me.id)
              : false,
          }));
          setTickets(enriched);
        } else {
          setTickets([]);
          if (ticketsData.status === "rejected") {
            const err = ticketsData.reason;
            setError(`Erreur chargement tickets : ${err.response?.status ?? ""} ${err.message}`);
          }
        }

      } catch (err) {
        setError(`Erreur : ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  const addTicket = useCallback(async (data) => {
    const newTicket = await createTicket(projectId, data);
    const enriched = {
      ...newTicket,
      isAssignedToMe: currentUser
        ? String(newTicket.assignedUserId) === String(currentUser.id)
        : false,
    };
    setTickets((prev) => [...prev, enriched]);
    return enriched;
  }, [projectId, currentUser]);

  const editTicket = useCallback(async (ticketId, data) => {
    const updated = await updateTicket(projectId, ticketId, data);
    const enriched = {
      ...updated,
      isAssignedToMe: currentUser
        ? String(updated.assignedUserId) === String(currentUser.id)
        : false,
    };
    setTickets((prev) => prev.map((t) => t.id === ticketId ? enriched : t));
    return enriched;
  }, [projectId, currentUser]);

  const removeTicket = useCallback(async (ticketId) => {
    await deleteTicket(projectId, ticketId);
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  }, [projectId]);

  return {
    tickets, sprints, members, currentUser,
    loading, error, activeSprint,
    addTicket, editTicket, removeTicket,
  };
}