// src/services/authService.ts
import api from './api'; // Importez votre instance Axios configurée
// Définissez ici l'interface User si vous ne pouvez pas l'importer depuis AuthContext
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    // Ajoutez d'autres champs selon votre modèle utilisateur
    token: string;
}

// --- Interfaces pour les requêtes et les réponses spécifiques à l'authentification ---

// Données requises pour la connexion
interface LoginPayload {
  email: string;
  password: string;
}

// Données requises pour l'inscription
interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  // Ajoutez d'autres champs si votre inscription le demande (ex: role par défaut)
}

// Réponse attendue de l'API après une connexion/inscription réussie
// Elle devrait correspondre à l'interface User que votre AuthContext attend.
interface AuthResponse {
  user: User; // Le backend renvoie les données de l'utilisateur incluant le token
  // Ajoutez d'autres champs si votre API renvoie plus d'informations à ce niveau
}

// --- Fonctions du Service d'Authentification ---

const authService = {
  /**
   * Tente de connecter un utilisateur.
   * @param {LoginPayload} credentials L'email et le mot de passe de l'utilisateur.
   * @returns {Promise<User>} Les données de l'utilisateur si la connexion réussit.
   * @throws {Error} En cas d'échec de la connexion (ex: identifiants invalides).
   */
  login: async (credentials: LoginPayload): Promise<User> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      // L'API est censée renvoyer un objet { user: UserData }.
      // C'est pourquoi nous accédons à response.data.user.
      return response.data.user;
    } catch (error: unknown) {
      // Gérer les erreurs spécifiques de l'API (ex: 401 Unauthorized, 400 Bad Request)
      // L'intercepteur de réponse dans api.ts gère déjà les cas globaux (comme le 401 global).
      // Ici, nous pouvons extraire un message d'erreur plus spécifique du backend.
      let errorMessage = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  /**
   * Tente d'inscrire un nouvel utilisateur.
   * @param {RegisterPayload} userData Les informations du nouvel utilisateur.
   * @returns {Promise<User>} Les données de l'utilisateur si l'inscription réussit.
   * @throws {Error} En cas d'échec de l'inscription (ex: email déjà utilisé).
   */
  register: async (userData: RegisterPayload): Promise<User> => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      // Similaire à la connexion, le backend doit renvoyer les données de l'utilisateur
      // incluant le token après une inscription réussie.
      return response.data.user;
    } catch (error: unknown) {
      let errorMessage = 'Échec de l\'inscription. Veuillez réessayer.';
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Vous pouvez ajouter d'autres fonctions ici, comme :
  // refreshToken: async (token: string): Promise<string> => { /* ... */ },
  // forgotPassword: async (email: string): Promise<void> => { /* ... */ },
};

export default authService;