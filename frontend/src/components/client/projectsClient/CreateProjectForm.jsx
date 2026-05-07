'use client';

import { useState } from 'react';
import styles from '@/styles/client/projects/CreateProjectForm.module.css';

export default function CreateProjectForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    estimatedStartDate: '',
    estimatedEndDate: '',
    estimatedBudget: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du projet est requis';
    }

    if (formData.estimatedStartDate && formData.estimatedEndDate) {
      const startDate = new Date(formData.estimatedStartDate);
      const endDate = new Date(formData.estimatedEndDate);
      
      if (startDate >= endDate) {
        newErrors.estimatedEndDate = 'La date de fin doit être après la date de début';
      }
    }

    if (formData.estimatedBudget && (isNaN(formData.estimatedBudget) || parseFloat(formData.estimatedBudget) < 0)) {
      newErrors.estimatedBudget = 'Le budget doit être un nombre positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Prepare data for backend
    const projectData = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      type: formData.type.trim() || null,
      estimatedStartDate: formData.estimatedStartDate ? new Date(formData.estimatedStartDate).toISOString() : null,
      estimatedEndDate: formData.estimatedEndDate ? new Date(formData.estimatedEndDate).toISOString() : null,
      estimatedBudget: formData.estimatedBudget ? parseFloat(formData.estimatedBudget) : null
    };

    onSubmit(projectData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.grid}>
        {/* Project Name */}
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label htmlFor="name" className={styles.label}>
            Nom du projet <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            placeholder="Entrez le nom du projet"
            disabled={isSubmitting}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>

        {/* Description */}
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Décrivez votre projet (optionnel)"
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        {/* Project Type */}
        <div className={styles.field}>
          <label htmlFor="type" className={styles.label}>
            Type de projet
          </label>
          <input
            type="text"
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Ex: Web, Mobile, etc."
            disabled={isSubmitting}
          />
        </div>

        {/* Estimated Start Date */}
        <div className={styles.field}>
          <label htmlFor="estimatedStartDate" className={styles.label}>
            Date de début estimée
          </label>
          <input
            type="date"
            id="estimatedStartDate"
            name="estimatedStartDate"
            value={formData.estimatedStartDate}
            onChange={handleInputChange}
            className={styles.input}
            disabled={isSubmitting}
          />
        </div>

        {/* Estimated End Date */}
        <div className={styles.field}>
          <label htmlFor="estimatedEndDate" className={styles.label}>
            Date de fin estimée
          </label>
          <input
            type="date"
            id="estimatedEndDate"
            name="estimatedEndDate"
            value={formData.estimatedEndDate}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.estimatedEndDate ? styles.inputError : ''}`}
            disabled={isSubmitting}
          />
          {errors.estimatedEndDate && <span className={styles.error}>{errors.estimatedEndDate}</span>}
        </div>

        {/* Estimated Budget */}
        <div className={styles.field}>
          <label htmlFor="estimatedBudget" className={styles.label}>
            Budget estimé (€)
          </label>
          <input
            type="number"
            id="estimatedBudget"
            name="estimatedBudget"
            value={formData.estimatedBudget}
            onChange={handleInputChange}
            className={`${styles.input} ${errors.estimatedBudget ? styles.inputError : ''}`}
            placeholder="0.00"
            step="0.01"
            min="0"
            disabled={isSubmitting}
          />
          {errors.estimatedBudget && <span className={styles.error}>{errors.estimatedBudget}</span>}
        </div>
      </div>

      {/* Submit Button */}
      <div className={styles.submitContainer}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Création en cours...' : 'Créer le projet'}
        </button>
      </div>
    </form>
  );
}
