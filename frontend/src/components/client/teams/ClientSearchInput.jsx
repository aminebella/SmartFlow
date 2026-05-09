'use client';

import { useState, useEffect, useRef } from 'react';
import { searchClientsByEmail } from '@/services/usersService';
import styles from '@/styles/client/teams/teams.module.css';
import { Avatar } from '@/components/ui/Avatar';

export function ClientSearchInput({ projectId, memberIds, onAdd, addingId }) {
  const [query,     setQuery]     = useState('');
  const [results,   setResults]   = useState([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchClientsByEmail(projectId, query.trim());
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, projectId]);

  return (
    <div>
      {/* Input */}
      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#a08c4a" strokeWidth="2"/>
          <path d="M20 20l-3-3" stroke="#a08c4a" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          className={styles.searchInput}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher par email..."
        />
        {searching && <div className={styles.searchSpinner} />}
      </div>

      {/* Dropdown */}
      {results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map(client => {
            const alreadyAdded = memberIds.has(client.id);
            const isAdding     = addingId === client.id;

            return (
              <div key={client.id} className={styles.dropdownRow}>
                <Avatar src={client.profilePicture} name={client.fullName || client.email} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.dropdownName}>{client.fullName || '—'}</div>
                  <div className={styles.dropdownEmail}>{client.email}</div>
                </div>
                {alreadyAdded ? (
                  <span className={styles.alreadyBadge}>Déjà membre</span>
                ) : (
                  <button
                    className={styles.dropdownAddBtn}
                    disabled={isAdding}
                    onClick={() => onAdd(client.id)}
                  >
                    {isAdding ? '...' : '+ Ajouter'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* No result */}
      {query && !searching && results.length === 0 && (
        <p className={styles.noResult}>Aucun utilisateur trouvé pour « {query} »</p>
      )}
    </div>
  );
}