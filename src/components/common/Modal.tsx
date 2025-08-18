// src/components/common/Modal.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string; // Pour des styles supplémentaires sur le contenu de la modale
  backdropClose?: boolean; // Permet de fermer la modale en cliquant sur l'arrière-plan
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
  backdropClose = true,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && backdropClose) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal-content ${className || ''}`}>
        <button className="modal-close-button" onClick={onClose} aria-label="Fermer la fenêtre modale">
          <i className="fas fa-times"></i> {/* Icône de croix pour fermer */}
        </button>
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body // Rend la modale directement dans le body pour éviter les problèmes de z-index
  );
};

export default Modal;