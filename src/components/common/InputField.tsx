// src/components/common/InputField.tsx
import React from 'react';
import './InputField.css';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode; // Pour ajouter une icône à côté du champ
  containerClassName?: string; // Pour styliser le conteneur global si besoin
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  icon,
  containerClassName,
  className,
  id,
  ...rest
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s/g, '-') + '-input' : undefined);

  return (
    <div className={`input-field-container ${containerClassName || ''}`}>
      {label && <label htmlFor={inputId} className="input-field-label">{label}</label>}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={inputId}
          className={`input-field ${error ? 'input-field-error' : ''} ${icon ? 'input-field-with-icon' : ''} ${className || ''}`}
          {...rest}
        />
      </div>
      {error && <p className="input-field-error-message">{error}</p>}
    </div>
  );
};

export default InputField;