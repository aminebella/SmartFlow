'use client';
import { useState, useEffect } from 'react';
import '@/styles/client/ListSprintsOfMyProject/sprints.css';

// ✅ corrigé: name → title
const INITIAL = { title: '', startDate: '', endDate: '', goal: '', status: 'PLANNED' };

export default function SprintForm({ open, initial, onClose, onSubmit, loading }) {
  const [form,  setForm]  = useState(INITIAL);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initial) {
      setForm({
        // ✅ corrigé: initial.name → initial.title
        title:     initial.title               || '',
        startDate: initial.startDate?.slice(0, 10) || '',
        endDate:   initial.endDate?.slice(0, 10)   || '',
        goal:      initial.goal               || '',
        status:    initial.status             || 'PLANNED',
      });
    } else {
      setForm(INITIAL);
    }
    setError('');
  }, [initial, open]);

  if (!open) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ corrigé: form.name → form.title
    if (!form.title)     return setError('Nom requis');
    if (!form.startDate) return setError('Date début requise');
    if (!form.endDate)   return setError('Date fin requise');
    setError('');
    onSubmit(form);
  }

  return (
    <>
      <div className="sprint-overlay" onClick={onClose} />

      <div className="sprint-modal">

        <div className="sprint-modal-header">
          <h2 className="sprint-modal-title">
            {initial ? 'Modifier le sprint' : 'Nouveau sprint'}
          </h2>
          <button className="sprint-modal-close" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="sprint-form-error">⚠️ &nbsp;{error}</div>
        )}

        <form className="sprint-form" onSubmit={handleSubmit}>

          <div>
            <label className="form-label">Nom du sprint *</label>
            <input
              className="form-input"
              name="title"                          // ✅ corrigé
              value={form.title}                    // ✅ corrigé
              onChange={handleChange}
              placeholder="ex: Sprint 1 – Auth & Setup"
            />
          </div>

          <div className="form-row">
            <div className="form-col">
              <label className="form-label">Date de début *</label>
              <input
                className="form-input"
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-col">
              <label className="form-label">Date de fin *</label>
              <input
                className="form-input"
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Objectif (optionnel)</label>
            <textarea
              className="form-textarea"
              name="goal"
              value={form.goal}
              onChange={handleChange}
              rows={3}
              placeholder="Décrivez l'objectif de ce sprint..."
            />
          </div>

          {initial && (
            <div>
              <label className="form-label">Statut</label>
              <select
                className="form-select"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="PLANNED">Planifié</option>
                <option value="ACTIVE">En cours</option>
                <option value="COMPLETED">Terminé</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Enregistrement...' : initial ? 'Enregistrer' : 'Créer le sprint'}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
          </div>

        </form>
      </div>
    </>
  );
}