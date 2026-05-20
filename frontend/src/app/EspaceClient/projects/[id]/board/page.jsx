// ← kanban (manager: move all, member: move own)

'use client';

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useTickets } from "@/hooks/useTickets";
import { useRole } from "@/hooks/useRole";
import { getSprintsByProject } from "@/services/sprintService";
import KanbanBoard from "@/components/client/boardClient/KanbanBoard";
import TicketModal from "@/components/client/tasksClient/TicketModal";

export default function EspaceClientProjectBoard() {
  const { id } = useParams();
  const { tickets, members, currentUser, loading, error, addTicket, editTicket, changeTicketStatus } = useTickets(id);
  const { isManager } = useRole(id);
  const [sprints, setSprints] = useState([]);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterAssignee, setFilterAssignee] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // Charger les sprints pour le sélecteur
  useEffect(() => {
    const loadSprints = async () => {
      try {
        const data = await getSprintsByProject(id);
        setSprints(data || []);
      } catch (err) {
        console.error('Erreur chargement sprints:', err);
      }
    };
    if (id) loadSprints();
  }, [id]);

  // Derive stable fields from backend shape: use `assignedUserId` (backend) and map to `assigneeId`/`assigneeName`
  const derivedTickets = tickets.map(t => {
    const assigneeId = t.assigneeId ?? t.assignedUserId ?? null;
    const member = (members || []).find(m => String(m.clientId ?? m.id) === String(assigneeId));
    const assigneeName = member ? (member.fullName || member.name) : (t.assignedUserFullName || t.assigneeName || null);
    return { ...t, assigneeId, assigneeName };
  });

  // Filtrer les tâches selon les critères (operate on derived tickets)
  const filteredTickets = derivedTickets.filter((t) => {
    // Sprint filter
    if (selectedSprint && String(t.sprintId) !== String(selectedSprint)) return false;

    // Status filter
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;

    // Assignee filter
    if (filterAssignee !== 'ALL' && String(t.assigneeId) !== String(filterAssignee)) return false;

    // Priority filter
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;

    return true;
  });

  const handleMoveTicket = useCallback(async (ticketId, newStatus) => {
    try {
      await changeTicketStatus(ticketId, newStatus);
    } catch (err) {
      console.error('Erreur mise à jour statut :', err);
    }
  }, [changeTicketStatus]);

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setEditModalOpen(true);
  };

  const handleSaveTicket = async (data) => {
    try {
      if (editingTicket) {
        await editTicket(editingTicket.id, data);
      } else {
        await addTicket(data);
      }
      setEditModalOpen(false);
      setEditingTicket(null);
    } catch (err) {
      console.error('Erreur sauvegarde ticket:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#faf8f2" }}>
        <div className="text-[#a08c4a]">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#faf8f2" }}>
        <div className="text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf8f2" }}>
      {/* Header */}
      <div className="bg-white border-b border-[#e8e0cc] px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-[#1a2030]">Board du projet</h1>
          
          {/* Sprint selector */}
          <select
            value={selectedSprint || ''}
            onChange={(e) => setSelectedSprint(e.target.value || null)}
            className="px-3 py-2 border border-[#e8e0cc] rounded-lg text-sm bg-white"
            style={{ color: '#334155' }}
          >
            <option value="">Tous les sprints</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mt-4">
          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-[#e8e0cc] rounded-lg text-sm bg-white"
            style={{ color: '#334155' }}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="REVIEW">Revue</option>
            <option value="DONE">Terminé</option>
          </select>

          {/* Assignee filter */}
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-2 border border-[#e8e0cc] rounded-lg text-sm bg-white"
            style={{ color: '#334155' }}
          >
            <option value="ALL">Tous les assignés</option>
            {members.map((m) => (
              <option key={m.clientId ?? m.id} value={m.clientId ?? m.id}>
                {m.fullName}
              </option>
            ))}
          </select>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-[#e8e0cc] rounded-lg text-sm bg-white"
            style={{ color: '#334155' }}
          >
            <option value="ALL">Toutes les priorités</option>
            <option value="CRITICAL">Critique</option>
            <option value="HIGH">Haute</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="LOW">Basse</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-4">
        <KanbanBoard
          tickets={filteredTickets}
          members={members}
          currentUser={currentUser}
          onEditTicket={handleEditTicket}
          onMoveTicket={handleMoveTicket}
          isManager={isManager}
        />
      </div>

      {/* Edit/Create Modal */}
      {editModalOpen && (
        <TicketModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingTicket(null);
          }}
          initial={editingTicket}
          onSubmit={handleSaveTicket}
          members={members}
          sprints={sprints}
        />
      )}
    </div>
  );
}