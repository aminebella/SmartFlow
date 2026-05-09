'use client';

import { useState } from 'react';
import styles from '@/styles/client/tasks/ProjectTasksList.module.css';

export default function ProjectTasksList({ tasks = [], projectId, projectName }) {
  const [filter, setFilter] = useState('all'); // 'all', 'TODO', 'IN_PROGRESS', 'DONE'
  const [search, setSearch] = useState('');

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = !search || 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  // Count tasks by status
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return '#8A857F';
      case 'IN_PROGRESS': return '#B8860B';
      case 'DONE': return '#639922';
      default: return '#8A857F';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'TODO': return 'À faire';
      case 'IN_PROGRESS': return 'En cours';
      case 'DONE': return 'Terminé';
      default: return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#D85A30';
      case 'MEDIUM': return '#B8860B';
      case 'LOW': return '#639922';
      default: return '#8A857F';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'HIGH': return 'Haute';
      case 'MEDIUM': return 'Moyenne';
      case 'LOW': return 'Basse';
      default: return priority;
    }
  };

  return (
    <div className={styles.container}>
      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.statusFilters}>
          {[
            { key: 'all', label: 'Tous', count: tasks.length },
            { key: 'TODO', label: 'À faire', count: statusCounts.TODO || 0 },
            { key: 'IN_PROGRESS', label: 'En cours', count: statusCounts.IN_PROGRESS || 0 },
            { key: 'DONE', label: 'Terminé', count: statusCounts.DONE || 0 }
          ].map(status => (
            <button
              key={status.key}
              className={`${styles.statusFilter} ${filter === status.key ? styles.active : ''}`}
              onClick={() => setFilter(status.key)}
            >
              {status.label}
              <span className={styles.count}>{status.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className={styles.tasksList}>
        {filteredTasks.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📋</span>
            <p className={styles.emptyText}>
              {search || filter !== 'all' 
                ? 'Aucune tâche ne correspond à vos filtres' 
                : 'Aucune tâche dans ce projet'
              }
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={styles.taskCard}>
              <div className={styles.taskHeader}>
                <div className={styles.taskTitleSection}>
                  <h3 className={styles.taskTitle}>{task.title}</h3>
                  <div className={styles.taskMeta}>
                    <span 
                      className={styles.status}
                      style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                      {getStatusLabel(task.status)}
                    </span>
                    <span 
                      className={styles.priority}
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>
                </div>
                
                {task.assignedUserFullName && (
                  <div className={styles.assignee}>
                    <span className={styles.assigneeLabel}>Assigné à:</span>
                    <span className={styles.assigneeName}>{task.assignedUserFullName}</span>
                  </div>
                )}
              </div>

              {task.description && (
                <div className={styles.taskDescription}>
                  <p>{task.description}</p>
                </div>
              )}

              <div className={styles.taskFooter}>
                <div className={styles.taskDates}>
                  {task.estimatedStartDate && (
                    <div className={styles.dateInfo}>
                      <span className={styles.dateLabel}>Début:</span>
                      <span className={styles.dateValue}>
                        {new Date(task.estimatedStartDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                  {task.estimatedEndDate && (
                    <div className={styles.dateInfo}>
                      <span className={styles.dateLabel}>Fin:</span>
                      <span className={styles.dateValue}>
                        {new Date(task.estimatedEndDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
