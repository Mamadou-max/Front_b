import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// --- 1. Définition des types ---

// Interface pour les informations de l'utilisateur authentifié
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'B2C' | 'B2B' | 'admin'; // 
  token: string;
  // Ajoutez d'autres champs pertinents pour votre application
  // on doit ajouter d'autre champs comme le mot de passe, la date de création, etc.
  // par exemple : password: string; createdAt: Date;
}

// Interface pour l'état et les fonctions du contexte d'authentification
export interface AuthContextType { // <-- Ajout de export ici
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  inscription?: (userData: User) => void; // Fonction pour l'inscription
  // Ajoutez d'autres fonctions comme 'register', 'updateProfile', etc.
}

// --- 2. Création du Contexte ---
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 3. Création du Fournisseur (Provider) ---
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('sportzen_user');
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          toast.success(`Bienvenue de retour, ${parsedUser.firstName || parsedUser.email} !`, {
            autoClose: 2000,
          });
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('sportzen_user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('sportzen_user', JSON.stringify(userData));
    toast.success('Connexion réussie !', { autoClose: 2000 });
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('sportzen_user');
    toast.info('Vous avez été déconnecté.', { autoClose: 2000 });
    navigate('/login');
  };

  // Fonction d'inscription (peut être étendue pour inclure des appels API) 
  // pour l'inscriptions appeler a l'API d'inscription
   
  const inscription = (userData: User) => {     
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('sportzen_user', JSON.stringify(userData));
    toast.success('Inscription réussie ! Bienvenue sur SportRADAR !', { autoClose: 2000 });
    navigate('/dashboard');
  };

  const authContextValue: AuthContextType = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    inscription , 
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 4. Hook personnalisé pour utiliser le Contexte ---
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};