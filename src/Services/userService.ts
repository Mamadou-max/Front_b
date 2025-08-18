// src/services/userService.ts
import api from './api'; // Importez votre instance Axios configurée
// Définition locale de l'interface User (à adapter selon vos besoins)
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Ajoutez d'autres champs selon votre modèle utilisateur
}

// --- Interfaces pour les données spécifiques aux utilisateurs ---

// Données pour la mise à jour d'un profil utilisateur
// Rend tous les champs optionnels car on ne met pas forcément tout à jour à la fois
export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  // Ajoutez d'autres champs que l'utilisateur peut modifier
  // Par exemple: profilePictureUrl?: string;
  // Ou des champs spécifiques à SportZen: preferredSports?: string[];
}

// --- Fonctions du Service Utilisateur ---

const userService = {
  /**
   * Récupère les détails du profil d'un utilisateur spécifique.
   * Cette route nécessitera généralement une authentification.
   * @param {string} userId L'ID de l'utilisateur à récupérer.
   * @returns {Promise<User>} Les données complètes de l'utilisateur.
   * @throws {Error} En cas d'échec de la récupération (ex: utilisateur non trouvé, non autorisé).
   */
  getUserProfile: async (userId: string): Promise<User> => {
    try {
      const response = await api.get<User>(`/users/${userId}/profile`);
      return response.data;
    } catch (error: unknown) {
      let errorMessage = 'Échec de la récupération du profil utilisateur.';
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
      ) {
        errorMessage = (error.response.data as { message?: string }).message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Met à jour le profil de l'utilisateur connecté ou d'un utilisateur spécifique (si autorisé).
   * @param {string} userId L'ID de l'utilisateur à mettre à jour.
   * @param {UpdateUserPayload} data Les données à mettre à jour.
   * @returns {Promise<User>} Les données de l'utilisateur mises à jour.
   * @throws {Error} En cas d'échec de la mise à jour.
   */
  updateUserProfile: async (userId: string, data: UpdateUserPayload): Promise<User> => {
    try {
      const response = await api.put<User>(`/users/${userId}/profile`, data);
      return response.data;
    } catch (error: unknown) {
      let errorMessage = 'Échec de la mise à jour du profil.';
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
      ) {
        errorMessage = (error.response.data as { message?: string }).message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Supprime le compte de l'utilisateur connecté ou d'un utilisateur spécifique (si autorisé).
   * Soyez très prudent avec cette fonction ! Elle doit être sécurisée côté backend.
   * @param {string} userId L'ID de l'utilisateur à supprimer.
   * @returns {Promise<void>} Une promesse résolue si la suppression est réussie.
   * @throws {Error} En cas d'échec de la suppression.
   */
  deleteUserAccount: async (userId: string): Promise<void> => {
    try {
      await api.delete(`/users/${userId}`);
      // Aucune donnée spécifique n'est généralement retournée pour une suppression réussie
    } catch (error: unknown) {
      let errorMessage = 'Échec de la suppression du compte utilisateur.';
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        errorMessage = (error.response.data as { message?: string }).message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Vous pouvez ajouter d'autres fonctions ici, comme :
  // getAllUsers: async (): Promise<User[]> => { /* Pour les admins */ },
  // searchUsers: async (query: string): Promise<User[]> => { /* Fonction de recherche */ },
};

export default userService;