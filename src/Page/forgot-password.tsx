import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/common/InputField';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!email) {
      toast.error('Veuillez saisir votre email.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Appel API pour envoyer un email de réinitialisation de mot de passe
      const response = await axios.post(' https://flask-back-api-for-project.onrender.com/reset_password_request', { email });

      if (response.data.success) {
        toast.success('Email de réinitialisation envoyé avec succès!');
        navigate('/login');
      } else {
        throw new Error(response.data.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation.');
      } else {
        toast.error('Erreur lors de l\'envoi de l\'email de réinitialisation.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-page" style={pageStyle}>
      <div className="forgot-password-container" style={containerStyle}>
        <div className="logo-container" style={logoStyle}>
          <div style={logoCircleStyle}>
            <div style={logoInnerCircleStyle}>
              <span style={logoSpanStyle}>S</span>
            </div>
          </div>
          <h1 style={logoTextStyle}>SportRadar</h1>
        </div>

        <h2 style={titleStyle}>Réinitialisation du mot de passe</h2>
        <p style={subtitleStyle}>Veuillez entrer votre adresse email pour recevoir un lien de réinitialisation de mot de passe.</p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputContainerStyle}>
            <div style={iconStyle}>
              <FaEnvelope style={{ color: '#28a745' }} />
            </div>
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={handleChange}
              required
              placeholder="votre.email@example.com"
              style={{ paddingLeft: '40px', borderRadius: '12px' }}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              marginTop: '25px',
              padding: '14px',
              background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1em',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '10px'
                }}></div>
                Envoi en cours...
              </div>
            ) : 'Envoyer le lien de réinitialisation'}
          </Button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .forgot-password-container::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(40, 167, 69, 0.1) 0%, rgba(40, 167, 69, 0.01) 100%);
          z-index: -1;
        }
        .forgot-password-container::after {
          content: '';
          position: absolute;
          bottom: -80px;
          left: -60px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(40, 167, 69, 0.08) 0%, rgba(40, 167, 69, 0.01) 100%);
          z-index: -1;
        }
      `}</style>
    </div>
  );
};

// Styles en ligne
const pageStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: '20px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
};

const containerStyle: React.CSSProperties = {
  background: '#ffffff',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  maxWidth: '500px',
  width: '100%',
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden'
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '30px'
};

const logoCircleStyle: React.CSSProperties = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '15px',
  boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)'
};

const logoInnerCircleStyle: React.CSSProperties = {
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  background: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const logoSpanStyle: React.CSSProperties = {
  fontSize: '2.5em',
  fontWeight: 'bold',
  color: '#28a745'
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '2.2em',
  fontWeight: 700,
  color: '#333',
  letterSpacing: '1px',
  background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.8em',
  color: '#333',
  marginBottom: '8px',
  fontWeight: 600
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.1em',
  color: '#666',
  marginBottom: '30px'
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
};

const inputContainerStyle: React.CSSProperties = {
  position: 'relative'
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '15px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2
};

export default ForgotPassword;
