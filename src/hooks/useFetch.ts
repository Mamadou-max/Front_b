// src/hooks/useFetch.ts
import { useState, useEffect, useCallback, useRef } from 'react';

// Interface pour l'état retourné par useFetch
export interface UseFetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void; // Fonction pour relancer la récupération des données
}

/**
 * Hook personnalisé pour la récupération de données depuis une API.
 * Gère les états de chargement, les erreurs et fournit un mécanisme de re-fetch.
 * @template T Le type attendu des données.
 * @param {string} url L'URL de l'API.
 * @param {RequestInit} [options] Options standard de fetch API.
 * @returns {UseFetchState<T>} Objet contenant les données, l'état de chargement, l'erreur et la fonction refetch.
 */
export const useFetch = <T>(
  url: string,
  options?: RequestInit
): UseFetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const optionsRef = useRef(options); // Utilise useRef pour optimiser les dépendances des options

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, optionsRef.current);
      if (!response.ok) {
        let errorMessage = `Erreur HTTP ! Statut : ${response.status}`;
        try {
          const errorJson = await response.json();
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch { /* Ignorer si non-JSON */ }
        throw new Error(errorMessage);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [url]); // Dépend de l'URL uniquement pour la recréation de la fonction

  useEffect(() => {
    fetchData(); // Déclenche le fetch initial et les re-fetches basés sur fetchData
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData(); // Permet de déclencher un fetch manuel
  }, [fetchData]);

  return { data, isLoading, error, refetch };
};