// src/services/api.ts
import axios from 'axios';

// 1. Définir l'URL de base de votre API
// Utilisez une variable d'environnement pour la flexibilité (meilleure pratique)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'; // Exemple

// 2. Créer une instance Axios personnalisée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Durée maximale d'attente pour une réponse (10 secondes)
  headers: {
    'Content-Type': 'application/json', // Type de contenu par défaut pour les requêtes
  },
});

// 3. Configurer les intercepteurs de requêtes
// Cet intercepteur est exécuté avant chaque requête.
// Il est parfait pour ajouter le token d'authentification aux en-têtes.
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('sportzen_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.token) {
          // Si un token existe, ajoutez-le à l'en-tête Authorization
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error("Erreur lors de l'analyse de l'utilisateur depuis localStorage", e);
        // Nettoyer si le stockage est corrompu
        localStorage.removeItem('sportzen_user');
      }
    }
    return config;
  },
  (error) => {
    // Gérez les erreurs de requête (ex: problème réseau avant l'envoi)
    return Promise.reject(error);
  }
);

// 4. Configurer les intercepteurs de réponses
// Cet intercepteur est exécuté après chaque réponse.
// Il est utile pour gérer globalement les erreurs (ex: 401 Unauthorized),
// les rafraîchissements de token, ou les messages de succès.
api.interceptors.response.use(
  (response) => {
    // Si la réponse est réussie, renvoyez-la telle quelle
    return response;
  },
  (error) => {
    // Gestion des erreurs de réponse
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un statut qui sort de la plage 2xx
      console.error('Erreur de réponse de l\'API:', error.response.status, error.response.data);

      if (error.response.status === 401) {
        // Gérer les cas d'authentification expirée ou invalide
        // Ex: rediriger l'utilisateur vers la page de connexion, effacer le token
        console.warn('Accès non autorisé ou token expiré. Déconnexion automatique...');
        // Il est souvent préférable de déléguer la déconnexion au contexte d'authentification
        // Ici, on pourrait déclencher un événement ou utiliser un store global pour la déconnexion
        // Exemple basique (nécessiterait d'importer useAuth ou de passer la fonction logout) :
        // localStorage.removeItem('sportzen_user');
        // window.location.href = '/login'; // Redirection forcée
      }
      // Vous pouvez gérer d'autres codes d'état ici (ex: 403 Forbidden, 404 Not Found)
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error('Aucune réponse reçue du serveur:', error.request);
    } else {
      // Quelque chose s'est passé lors de la configuration de la requête qui a déclenché une erreur
      console.error('Erreur de configuration de la requête Axios:', error.message);
    }
    return Promise.reject(error); // Rejette l'erreur pour qu'elle soit gérée par le composant appelant
  }
);

export default api;