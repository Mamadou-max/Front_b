import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/common/InputField';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import axios from 'axios';

const Inscription: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [animation, setAnimation] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setAnimation(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'terms') {
      setTermsAccepted(checked);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error("Vous devez accepter les Conditions d'utilisation et la Politique de confidentialité");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        birthDate: formData.birthDate, // YYYY-MM-DD depuis input date
      };

      const response = await axios.post(
        'https://flask-back-api-for-project.onrender.com/register',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Compte créé avec succès !');
        navigate('/dashboard');
      } else {
        toast.error(response.data.message || 'Erreur lors de la création du compte');
      }
    } catch (error: unknown) {
      console.error('Erreur:', error);
      // Si l'erreur contient une réponse, on affiche son message
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as { response?: { data?: { message?: string } } }).response &&
        (error as { response: { data?: { message?: string } } }).response.data &&
        (error as { response: { data: { message?: string } } }).response.data.message
      ) {
        toast.error(`Erreur : ${(error as { response: { data: { message: string } } }).response.data.message}`);
      } else {
        toast.error('Erreur lors de la création du compte');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    toast.info(`Inscription avec ${provider} en cours...`);
  };

  return (
    <div style={pageStyle}>
      <div className="bubbles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              ...bubbleStyle,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
              animationDuration: `${15 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
              background: `rgba(40, 167, 69, ${0.05 + Math.random() * 0.1})`,
            }}
          />
        ))}
      </div>

      <div
        className="register-container"
        style={{
          ...containerStyle,
          transform: animation ? 'translateY(0)' : 'translateY(20px)',
          opacity: animation ? 1 : 0,
          transition: 'all 0.6s ease-out',
          position: 'relative'
        }}
      >
        <div className="logo-container" style={logoStyle}>
          <div style={logoCircleStyle}>
            <div style={logoInnerCircleStyle}>
              <span style={logoSpanStyle}>S</span>
            </div>
          </div>
          <h1 style={logoTextStyle}>SportRadar</h1>
        </div>

        <h2 style={titleStyle}>Créer votre compte</h2>
        <p style={subtitleStyle}>Rejoignez notre communauté sportive</p>

        <form onSubmit={handleSubmit} style={formStyle} noValidate>
          <div style={nameContainer}>
            <div style={inputContainerStyle}>
              <div style={iconStyle}>
                <FaUser style={{ color: '#28a745' }} />
              </div>
              <InputField
                label="Prénom"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Votre prénom"
                style={{ paddingLeft: '40px', borderRadius: '12px' }}
              />
            </div>

            <div style={inputContainerStyle}>
              <InputField
                label="Nom"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Votre nom"
                style={{ borderRadius: '12px' }}
              />
            </div>
          </div>

          <div style={inputContainerStyle}>
            <div style={iconStyle}>
              <FaEnvelope style={{ color: '#28a745' }} />
            </div>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre.email@example.com"
              style={{ paddingLeft: '40px', borderRadius: '12px' }}
            />
          </div>

          <div style={inputContainerStyle}>
            <div style={iconStyle}>
              <FaCalendarAlt style={{ color: '#28a745' }} />
            </div>
            <InputField
              label="Date de naissance"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              style={{ paddingLeft: '40px', borderRadius: '12px' }}
              max={new Date().toISOString().split('T')[0]} // Empêche de choisir une date future
            />
          </div>

          <div style={passwordContainer}>
            <div style={inputContainerStyle}>
              <div style={iconStyle}>
                <FaLock style={{ color: '#28a745' }} />
              </div>
              <InputField
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Votre mot de passe"
                style={{ paddingLeft: '40px', borderRadius: '12px' }}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={showPasswordButtonStyle}
                tabIndex={-1}
                aria-label={showPassword ? "Cacher mot de passe" : "Voir mot de passe"}
              >
                {showPassword ? "Cacher" : "Voir"}
              </button>
            </div>

            <div style={inputContainerStyle}>
              <InputField
                label="Confirmer le mot de passe"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirmez votre mot de passe"
                style={{ borderRadius: '12px' }}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  ...showPasswordButtonStyle,
                  right: '15px'
                }}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Cacher confirmation" : "Voir confirmation"}
              >
                {showConfirmPassword ? "Cacher" : "Voir"}
              </button>
            </div>
          </div>

          <div style={termsContainer}>
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={termsAccepted}
              onChange={handleChange}
              style={checkboxStyle}
              required
            />
            <label htmlFor="terms" style={termsText}>
              J'accepte les <Link to="/terms" style={linkStyle}>Conditions d'utilisation</Link> et la <Link to="/privacy" style={linkStyle}>Politique de confidentialité</Link>
            </label>
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
                Création du compte...
              </div>
            ) : "S'inscrire"}
          </Button>
        </form>

        <div style={dividerStyle}>
          <span style={dividerTextStyle}>Ou s'inscrire avec</span>
        </div>

        <div style={socialButtonsContainer}>
          <button
            onClick={() => handleSocialRegister('Google')}
            style={{ ...socialButtonStyle, backgroundColor: '#4285F4' }}
            aria-label="Inscription avec Google"
          >
            <FaGoogle style={socialIconStyle} />
          </button>
          <button
            onClick={() => handleSocialRegister('Facebook')}
            style={{ ...socialButtonStyle, backgroundColor: '#4267B2' }}
            aria-label="Inscription avec Facebook"
          >
            <FaFacebookF style={socialIconStyle} />
          </button>
          <button
            onClick={() => handleSocialRegister('Twitter')}
            style={{ ...socialButtonStyle, backgroundColor: '#1DA1F2' }}
            aria-label="Inscription avec Twitter"
          >
            <FaTwitter style={socialIconStyle} />
          </button>
        </div>

        <p style={footerTextStyle}>
          Vous avez déjà un compte ?{' '}
          <Link to="/Login" style={{ ...linkStyle, fontWeight: 600 }}>
            Se connecter
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
          }
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          animation-name: float;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
    </div>
  );
};

// Styles (inline)
const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8fafc',
  padding: '40px 20px',
  fontFamily: "'Poppins', sans-serif",
  position: 'relative',
  overflow: 'hidden',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '480px',
  width: '100%',
  backgroundColor: 'white',
  borderRadius: '20px',
  padding: '40px 30px',
  boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
  zIndex: 1,
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '25px',
};

const logoCircleStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  backgroundColor: '#28a745',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoInnerCircleStyle: React.CSSProperties = {
  width: '42px',
  height: '42px',
  backgroundColor: 'white',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoSpanStyle: React.CSSProperties = {
  color: '#28a745',
  fontWeight: 'bold',
  fontSize: '1.5rem',
};

const logoTextStyle: React.CSSProperties = {
  marginLeft: '15px',
  color: '#28a745',
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 700,
  marginBottom: '5px',
  color: '#343a40',
};

const subtitleStyle: React.CSSProperties = {
  marginBottom: '30px',
  color: '#6c757d',
  fontSize: '1rem',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const nameContainer: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginBottom: '18px',
};

const inputContainerStyle: React.CSSProperties = {
  position: 'relative',
  marginBottom: '18px',
  flex: 1,
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '12px',
  transform: 'translateY(-50%)',
  fontSize: '18px',
  color: '#28a745',
};

const passwordContainer: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginBottom: '18px',
};

const showPasswordButtonStyle: React.CSSProperties = {
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: '#28a745',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: '0.85em',
};

const termsContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '25px',
};

const checkboxStyle: React.CSSProperties = {
  marginRight: '12px',
  width: '18px',
  height: '18px',
  cursor: 'pointer',
};

const termsText: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#6c757d',
};

const linkStyle: React.CSSProperties = {
  color: '#28a745',
  textDecoration: 'underline',
  cursor: 'pointer',
};

const dividerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  margin: '20px 0',
  color: '#6c757d',
};

const dividerTextStyle: React.CSSProperties = {
  flex: 1,
  textAlign: 'center',
  fontSize: '0.85rem',
  fontWeight: 600,
  position: 'relative',
};

const socialButtonsContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '15px',
  marginBottom: '30px',
};

const socialButtonStyle: React.CSSProperties = {
  width: '45px',
  height: '45px',
  borderRadius: '50%',
  border: 'none',
  color: 'white',
  fontSize: '1.3rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease',
};

const socialIconStyle: React.CSSProperties = {
  pointerEvents: 'none',
};

const footerTextStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '0.9rem',
  color: '#6c757d',
  fontWeight: 500,
};

const bubbleStyle: React.CSSProperties = {
  position: 'absolute',
  borderRadius: '50%',
  opacity: 0.1,
  pointerEvents: 'none',
  animationName: 'float',
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
};

export default Inscription;
