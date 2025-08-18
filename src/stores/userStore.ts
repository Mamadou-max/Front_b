

// src/services/userService.ts
import api from '../Services/api'; // Importe votre instance Axios configurée
// import { User } from '../types/user'; // Importe l'interface User pour le typage
type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Ajoutez ici d'autres champs selon la structure réelle de votre utilisateur
};
import { AxiosError } from 'axios'; // Importe AxiosError pour un typage d'erreur plus précis

// --- Interfaces pour les données spécifiques aux requêtes utilisateur ---

/**
 * Interface pour les données de mise à jour d'un profil utilisateur.
 * Tous les champs sont optionnels car une mise à jour peut ne concerner qu'une partie des informations.
 */
export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  // Ajoutez ici d'autres champs que l'utilisateur pourrait modifier via l'API,
  // par exemple:
  // profilePictureUrl?: string;
  // preferredSports?: string[];
  // bio?: string;
}

// --- Fonctions du Service Utilisateur ---

const userService = {
  /**
   * Récupère les détails du profil d'un utilisateur spécifique via l'API.
   * Cette fonction nécessitera généralement que l'utilisateur soit authentifié
   * et autorisé à accéder aux données de l'ID demandé.
   *
   * @param {string} userId L'ID unique de l'utilisateur dont on veut récupérer le profil.
   * @returns {Promise<User>} Une promesse qui se résout avec les données complètes de l'utilisateur.
   * @throws {Error} Lance une erreur si la récupération du profil échoue (ex: utilisateur non trouvé, non autorisé).
   */
  getUserProfile: async (userId: string): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/${userId}/profile`);
      return response.data; // Retourne les données de l'utilisateur depuis la réponse
    } catch (error: unknown) {
      // AxiosError est le type d'erreur le plus courant pour les erreurs réseau/API avec Axios
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === 'object' &&
        axiosError.response?.data !== null &&
        'message' in axiosError.response.data
          ? (axiosError.response.data as { message?: string }).message
          : 'Échec de la récupération du profil utilisateur.';    throw new Error(errorMessage); // Propage l'erreur pour être gérée par le composant appelant
    }
  },

  /**
   * Met à jour le profil de l'utilisateur spécifié.
   * L'API vérifiera généralement si l'utilisateur authentifié a les droits
   * de modifier ce profil (typiquement, son propre profil ou si c'est un administrateur).
   *
   * @param {string} userId L'ID unique de l'utilisateur dont le profil doit être mis à jour.
   * @param {UpdateUserPayload} data Les champs du profil à mettre à jour.
   * @returns {Promise<User>} Une promesse qui se résout avec les données de l'utilisateur mises à jour.
   * @throws {Error} Lance une erreur si la mise à jour échoue.
   */
  updateUserProfile: async (userId: string, data: UpdateUserPayload): Promise<User> => {
    try {
      const response = await api.put<User>(`/users/${userId}/profile`, data);
      return response.data; // Retourne les données de l'utilisateur mises à jour
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === 'object' && axiosError.response?.data !== null && 'message' in axiosError.response.data
          ? (axiosError.response.data as { message?: string }).message
          : 'Échec de la mise à jour du profil.';    throw new Error(errorMessage);
    }
  },

  /**
   * Supprime le compte d'un utilisateur.
   * Cette fonction est critique et doit être utilisée avec la plus grande prudence.
   * Assurez-vous que des confirmations et des vérifications d'autorisation robustes
   * sont en place côté client et serveur.
   *
   * @param {string} userId L'ID unique de l'utilisateur dont le compte doit être supprimé.
   * @returns {Promise<void>} Une promesse qui se résout sans valeur si la suppression est réussie.
   * @throws {Error} Lance une erreur si la suppression échoue.
   */
  deleteUserAccount: async (userId: string): Promise<void> => {
    try {
      await api.delete(`/users/${userId}`);
      // Pour une suppression réussie, l'API ne retourne généralement pas de corps de réponse significatif.
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage =
        typeof axiosError.response?.data === 'object' &&
        axiosError.response?.data !== null &&
        'message' in axiosError.response.data
          ? (axiosError.response.data as { message?: string }).message
          : 'Échec de la suppression du compte utilisateur.';    throw new Error(errorMessage);
    }
  },

  // --- Fonctions supplémentaires que vous pourriez ajouter selon vos besoins ---
  /**
   * (Exemple pour les administrateurs) Récupère une liste de tous les utilisateurs.
   * Nécessitera des droits d'administrateur côté backend.
   *
   * // getAllUsers: async (): Promise<User[]> => {
   * //   try {
   * //     const response = await api.get<User[]>('/admin/users');
   * //     return response.data;
   * //   } catch (error: unknown) {
   * //     const axiosError = error as AxiosError;
   * //     throw new Error(axiosError.response?.data?.message || 'Échec de la récupération de tous les utilisateurs.');
   * //   }
   * // },
   */
};

export default userService;