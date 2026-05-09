'use client';

import { useState } from 'react';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080').replace(/\/$/, '');

/**
 * Construit l'URL complète d'une image à partir d'un chemin relatif ou absolu.
 * Utilisable sans le hook si besoin (export nommé).
 */
export function buildImgUrl(path) {
  if (!path || typeof path !== 'string' || !path.trim()) return null;
  const trimmed = path.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `${BASE_URL}/${trimmed.replace(/^\//, '').split('/').map(encodeURIComponent).join('/')}`;
}


export function useImgUrl(path) {
  const [error, setError] = useState(false);

  return {
    src: error ? null : buildImgUrl(path),
    onError: () => setError(true),
  };
}