// src/components/Button.tsx
import React from 'react';
import './Button.css';

// Définition des props pour le composant Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Le texte ou les éléments React à afficher à l'intérieur du bouton.
   */
  children: React.ReactNode;
  /**
   * Le style visuel du bouton.
   * 'primary': Bouton principal (ex: vert SportZen pour les actions positives)
   * 'secondary': Bouton secondaire (ex: bleu standard pour les actions neutres/informatifs)
   * 'danger': Bouton d'action dangereuse (ex: rouge pour supprimer)
   * 'outline': Bouton avec seulement une bordure (transparent à l'intérieur)
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  /**
   * La taille du bouton.
   * 'small': Bouton compact
   * 'medium': Taille par défaut
   * 'large': Bouton plus grand
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Si le bouton doit occuper toute la largeur de son conteneur.
   */
  fullWidth?: boolean;
  /**
   * Si le bouton est dans un état de chargement (désactive le bouton et peut afficher un spinner).
   */
  isLoading?: boolean;
  /**
   * Texte affiché lorsque le bouton est en état de chargement.
   * N'a d'effet que si `isLoading` est à `true`.
   */
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary', // 'primary' est le variant par défaut
  size = 'medium',     // 'medium' est la taille par défaut
  fullWidth = false,
  isLoading = false,
  loadingText = 'Chargement...',
  className, // Permet de passer des classes CSS supplémentaires
  disabled,  // Gère l'état désactivé du bouton HTML natif
  ...rest // Capture toutes les autres props HTML standard (onClick, type, etc.)
}) => {
  const buttonClasses = [
    'custom-button',
    `custom-button-${variant}`,
    `custom-button-${size}`,
    fullWidth ? 'custom-button-fullwidth' : '',
    isLoading ? 'custom-button-loading' : '',
    className, // Ajoute toutes les classes passées via la prop className
  ].filter(Boolean).join(' '); // .filter(Boolean) pour enlever les chaînes vides

  return (
    <button
      className={buttonClasses}
      disabled={isLoading || disabled} // Désactive le bouton si isLoading est vrai, ou si explicitement désactivé
      {...rest}
    >
      {isLoading ? (
        <>
          {/* Un simple cercle rotatif pour la démo, remplacez par un vrai spinner CSS ou icône */}
          <span className="spinner"></span>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;