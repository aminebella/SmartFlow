'use client';

import { useState, useEffect } from 'react';
import { getProjectById, updateProject } from '@/services/projectService';

export default function ProjectSettingsForm({ projectId, isManager, onUpdate }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    estimatedStartDate: '',
    estimatedEndDate: '',
    realStartDate: '',
    realEndDate: '',
    estimatedBudget: '',
    realBudget: '',
  });

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const project = await getProjectById(projectId);
      setFormData({
        name: project.name || '',
        description: project.description || '',
        type: project.type || '',
        estimatedStartDate: project.estimatedStartDate?.split('T')[0] || '',
        estimatedEndDate: project.estimatedEndDate?.split('T')[0] || '',
        realStartDate: project.realStartDate?.split('T')[0] || '',
        realEndDate: project.realEndDate?.split('T')[0] || '',
        estimatedBudget: project.estimatedBudget?.toString() || '',
        realBudget: project.realBudget?.toString() || '',
      });
    } catch (err) {
      setError('Impossible de charger les informations du projet');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear messages on change
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isManager) {
      setError('Seul le manager peut modifier les paramètres du projet');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
        const formatToLocalDateTime = (dateString) => {
            if (!dateString) return null;
            // Ajoute l'heure à minuit (00:00:00) pour que Spring Boot puisse parser
            return `${dateString}T00:00:00`;
        };

      const dataToSend = {
        name: formData.name || undefined,
        description: formData.description || undefined,
        type: formData.type || undefined,
        estimatedStartDate: formatToLocalDateTime(formData.estimatedStartDate),
        estimatedEndDate: formatToLocalDateTime(formData.estimatedEndDate),
        realStartDate: formatToLocalDateTime(formData.realStartDate),
        realEndDate: formatToLocalDateTime(formData.realEndDate),
        estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : null,
        realBudget: formData.realBudget ? parseFloat(formData.realBudget) : null,
      };

      await updateProject(projectId, dataToSend);
      setSuccess('Projet mis à jour avec succès');
      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="settings-form">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Section: Informations générales */}
      <div className="form-section">
        <h3 className="form-section-title">Informations générales</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nom du projet *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isManager}
              placeholder="Nom du projet"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Type de projet</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={!isManager}
              placeholder="Ex: Web, Mobile, Desktop"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={!isManager}
            rows="4"
            placeholder="Description détaillée du projet..."
          />
        </div>
      </div>

      {/* Section: Dates */}
      <div className="form-section">
        <h3 className="form-section-title">Dates du projet</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="estimatedStartDate">Date de début estimée</label>
            <input
              type="date"
              id="estimatedStartDate"
              name="estimatedStartDate"
              value={formData.estimatedStartDate}
              onChange={handleChange}
              disabled={!isManager}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="estimatedEndDate">Date de fin estimée</label>
            <input
              type="date"
              id="estimatedEndDate"
              name="estimatedEndDate"
              value={formData.estimatedEndDate}
              onChange={handleChange}
              disabled={!isManager}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="realStartDate">Date de début réelle</label>
            <input
              type="date"
              id="realStartDate"
              name="realStartDate"
              value={formData.realStartDate}
              onChange={handleChange}
              disabled={!isManager}
            />
            <span className="form-hint">Définie automatiquement au premier sprint, modifiable manuellement</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="realEndDate">Date de fin réelle</label>
            <input
              type="date"
              id="realEndDate"
              name="realEndDate"
              value={formData.realEndDate}
              onChange={handleChange}
              disabled={!isManager}
            />
            <span className="form-hint">Définie automatiquement à la fin du projet</span>
          </div>
        </div>
      </div>

      {/* Section: Budget */}
      <div className="form-section">
        <h3 className="form-section-title">Budget</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="estimatedBudget">Budget estimé (MAD)</label>
            <input
              type="number"
              id="estimatedBudget"
              name="estimatedBudget"
              value={formData.estimatedBudget}
              onChange={handleChange}
              disabled={!isManager}
              step="0.01"
              placeholder="0.00"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="realBudget">Budget réel (MAD)</label>
            <input
              type="number"
              id="realBudget"
              name="realBudget"
              value={formData.realBudget}
              onChange={handleChange}
              disabled={!isManager}
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      {isManager && (
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      )}

      {!isManager && (
        <div className="form-readonly-notice">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3v6M8 11h.01" strokeLinecap="round" />
            <circle cx="8" cy="8" r="6" />
          </svg>
          <span>Mode lecture seule - Seul le manager peut modifier ces informations</span>
        </div>
      )}
    </form>
  );
}