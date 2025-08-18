// src/layouts/Footer.tsx
import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>À propos de SportRadar</h3>
          <p>
            SportRardar est votre allié quotidien pour trouver des activités sportives non compétitives, inclusives et adaptées
            à votre rythme. Nous croyons que le bien-être par le mouvement est accessible à tous.
          </p>
          <div className="social-links">
            {/* Remplacez ces liens par les vrais URLs de vos réseaux sociaux */}
            <a href="https://facebook.com/sportRardar" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i> {/* Font Awesome icon */}
            </a>
            <a href="https://instagram.com/sportRardar" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i> {/* Font Awesome icon */}
            </a>
            <a href="https://twitter.com/sportRardar" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i> {/* Font Awesome icon */}
            </a>
            <a href="https://linkedin.com/company/sportRardar" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i> {/* Font Awesome icon */}
            </a>
          </div>
        </div>
        <div className="footer-section links">
          <h3>Découvrir</h3>
          <ul>
            <li><a href="/dashboard">Mon Tableau de Bord</a></li>
            <li><a href="/explore">Explorer les Activités</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/terms">Conditions Générales</a></li>
            <li><a href="/privacy">Politique de Confidentialité</a></li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h3>Besoin d'Aide ?</h3>
          <p>Une question, une suggestion ? Nous sommes là pour vous !</p>
          <p>Email: <a href="mailto:contact@sportzen.com">contact@sportRadar.com</a></p>
          <p>Téléphone: <a href="tel:+33123456789">+ 33 07 53 44 45 77</a></p>
          <address>
            123 Rue de l'Énergie Douce,<br/>
            75000 Paris, France
          </address>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SportRadar. Tous droits réservés. Propulsé par la bienveillance.</p>
      </div>
    </footer>
  );
};

export default Footer;