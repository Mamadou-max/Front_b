import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../context/AuthContext';

/**
 * Hook personnalisé pour accéder facilement au contexte d'authentification.
 *
 * Ce hook permet à tout composant fonctionnel d'accéder
 * à l'état d'authentification global (utilisateur connecté, données utilisateur,
 * état de chargement initial) et aux actions (login, logout) définies dans le AuthContext.
 *
 * Il est crucial que les composants utilisant ce hook soient bien enveloppés
 * par le `AuthProvider` (défini dans `AuthContext.tsx`), sinon une erreur sera générée.
 *
 * @returns {AuthContextType} L'objet du contexte d'authentification contenant
 * `isAuthenticated`, `user`, `isLoading`, `login`, et `logout`.
 * @throws {Error} Lance une erreur si le hook est utilisé en dehors de son `AuthProvider`.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }

  return context;
};