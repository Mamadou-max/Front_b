// src/components/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Pour les notifications toast
import './Header.css'; // Le fichier CSS reste dans le même dossier que le composant

// Pour la démonstration, nous simulons l'état d'authentification.
// Dans une application réelle, vous utiliseriez un contexte d'authentification (ex: AuthContext).
interface HeaderProps {
  isAuthenticated?: boolean; // Indique si l'utilisateur est connecté.
  userType?: 'B2C' | 'B2B'; // Type d'utilisateur si connecté.
  onLogout?: () => void; // Fonction de déconnexion.
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated = true, // Simulé comme connecté pour la démo.
  userType = 'B2C',       // Simulé comme B2C pour la démo.
  onLogout,
}) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // État pour le menu mobile.

  const handleLogout = () => {
    // Dans une vraie application :
    // 1. Appelez l'API de déconnexion.
    // 2. Nettoyez le token et les infos utilisateur du stockage local/session.
    // 3. Mettez à jour le contexte d'authentification.
    if (onLogout) {
      onLogout();
    }
    toast.info('Vous êtes déconnecté. À bientôt sur SportRardar !', { autoClose: 3000 });
    navigate('/login');
    setIsMobileMenuOpen(false); // Ferme le menu mobile après déconnexion.
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/dashboard" className="logo" aria-label="Accueil SportRardar" onClick={closeMobileMenu}>
          {/* Logo texte stylisé, ou remplacez par votre image de logo */}
          <span>Sport<span className="logo-zen">Radar</span></span>
        </Link>
      </div>

      {/* Bouton de menu mobile (visible uniquement sur petits écrans) */}
      <button className="mobile-menu-toggle" aria-label="Ouvrir le menu" onClick={toggleMobileMenu}>
        <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i> {/* Icône changeante */}
      </button>

      {/* Navigation et actions d'authentification (elles seront conditionnellement affichées/masquées par CSS et JS) */}
      <div className={`header-right-wrapper ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <nav className="main-nav">
          <ul>
            <li><Link to="/dashboard" onClick={closeMobileMenu}>Tableau de Bord</Link></li>
            <li><Link to="/explore" onClick={closeMobileMenu}>Explorer</Link></li>
            {isAuthenticated && userType === 'B2B' && (
              <li><Link to="/business-dashboard" onClick={closeMobileMenu}>Mon Entreprise</Link></li>
            )}
            <li><Link to="/about" onClick={closeMobileMenu}>À Propos</Link></li>
            <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
          </ul>
        </nav>

        <div className="auth-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="btn-profile" aria-label="Voir le profil" onClick={closeMobileMenu}>
                <i className="fas fa-user-circle"></i>
                <span className="btn-text">Profil</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                <i className="fas fa-sign-out-alt"></i>
                <span className="btn-text">Déconnexion</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login" onClick={closeMobileMenu}>
                <i className="fas fa-sign-in-alt"></i>
                <span className="btn-text">Connexion</span>
              </Link>
              <Link to="/inscription" className="btn-signup" onClick={closeMobileMenu}>
                <i className="fas fa-user-plus"></i>
                <span className="btn-text">S'inscrire</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;