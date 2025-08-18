import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/common/InputField';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [animation, setAnimation] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { login,  isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirection déclenchée par le changement d'état d'authentification
  useEffect(() => {
     setAnimation(true);
     setIsAuthenticated(true); // Vérifie si un token est présent dans le localStorage
     console.log('Animation:', animation);
  console.log('isAuthenticated:', isAuthenticated);
  if (isAuthenticated) {
    toast.success('Connexion réussie !');
    navigate('/dashboard', { replace: true });
  }
}, [isAuthenticated, navigate]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!email || !password) {
      toast.error('Veuillez saisir votre email et votre mot de passe.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('https://flask-back-api-for-project.onrender.com/login', { email, password });
      if (response.data.success) {
        login({
          id: response.data.user.id,
          email: response.data.user.email,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          role: response.data.user.role,
          token: response.data.token
        });
        toast.success('Connexion réussie !');

        // FORCE LA NAVIGATION ICI
        navigate('/dashboard',  { replace: true });
      } else {
        throw new Error(response.data.message || 'Email ou mot de passe incorrect.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Échec de la connexion. Veuillez réessayer.');
      } else {
        toast.error('Échec de la connexion. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`Connexion avec ${provider} en cours...`);
  };

  if (authLoading) {
    return (
      <div className="login-loading" style={{
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.2em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div className="spinner" style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #28a745',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Vérification de votre session...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="login-page" style={pageStyle}>
      <div className="login-container" style={{
        ...containerStyle,
        transform: animation ? 'translateY(0)' : 'translateY(20px)',
        opacity: animation ? 1 : 0,
        transition: 'all 0.6s ease-out'
      }}>
        <div className="logo-container" style={logoStyle}>
          <div style={logoCircleStyle}>
            <div style={logoInnerCircleStyle}>
              <span style={logoSpanStyle}>S</span>
            </div>
          </div>
          <h1 style={logoTextStyle}>SportRadar</h1>
        </div>

        <h2 style={titleStyle}>Connexion à votre compte</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputContainerStyle}>
            <div style={iconStyle}>
              <FaUser style={{ color: '#28a745' }} />
            </div>
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre.email@example.com"
              style={{ paddingLeft: '40px', borderRadius: '12px' }}
            />
          </div>

          <div style={inputContainerStyle}>
            <div style={iconStyle}>
              <FaLock style={{ color: '#28a745' }} />
            </div>
            <InputField
              label="Mot de passe"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Votre mot de passe"
              style={{ paddingLeft: '40px', borderRadius: '12px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={showPasswordButtonStyle}
            >
              {showPassword ? "Cacher" : "Voir"}
            </button>
          </div>

          <div style={forgotPasswordStyle}>
            <Link to="/forgot-password" style={linkStyle}>
              Mot de passe oublié ?
            </Link>
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
                Connexion en cours...
              </div>
            ) : 'Se connecter'}
          </Button>
        </form>

        <div style={dividerStyle}>
          <span style={dividerTextStyle}>Ou continuer avec</span>
        </div>

        <div style={socialButtonsContainer}>
          <button
            onClick={() => handleSocialLogin('Google')}
            style={{ ...socialButtonStyle, backgroundColor: '#4285F4' }}
          >
            <FaGoogle style={socialIconStyle} />
          </button>
          <button
            onClick={() => handleSocialLogin('Facebook')}
            style={{ ...socialButtonStyle, backgroundColor: '#4267B2' }}
          >
            <FaFacebookF style={socialIconStyle} />
          </button>
          <button
            onClick={() => handleSocialLogin('Twitter')}
            style={{ ...socialButtonStyle, backgroundColor: '#1DA1F2' }}
          >
            <FaTwitter style={socialIconStyle} />
          </button>
        </div>

        <p style={footerTextStyle}>
          Pas encore de compte ?{' '}
          <Link to="/inscription" style={{ ...linkStyle, fontWeight: 600 }}>
            Créer un compte
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .login-container::before {
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
        .login-container::after {
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
  overflow: 'hidden',
};

const logoStyle: React.CSSProperties = {
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '15px',
};

const logoCircleStyle: React.CSSProperties = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#28a745',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  boxShadow: '0 0 15px #28a745',
  transition: 'all 0.4s ease',
};

const logoInnerCircleStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: '#1e7e34',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: 'inset 0 0 10px #145214',
};

const logoSpanStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  userSelect: 'none',
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#28a745',
  userSelect: 'none',
};

const titleStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  marginBottom: '30px',
  color: '#333',
};

const formStyle: React.CSSProperties = {
  textAlign: 'left',
};

const inputContainerStyle: React.CSSProperties = {
  position: 'relative',
  marginBottom: '25px',
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '12px',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  fontSize: '18px',
};

const showPasswordButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  right: '12px',
  transform: 'translateY(-50%)',
  background: 'transparent',
  border: 'none',
  color: '#28a745',
  fontWeight: '600',
  cursor: 'pointer',
  fontSize: '14px',
  userSelect: 'none',
};

const forgotPasswordStyle: React.CSSProperties = {
  textAlign: 'right',
  marginBottom: '30px',
};

const linkStyle: React.CSSProperties = {
  color: '#28a745',
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'color 0.3s ease',
};

const dividerStyle: React.CSSProperties = {
  position: 'relative',
  margin: '30px 0',
  textAlign: 'center',
  color: '#999',
  fontWeight: 600,
  fontSize: '14px',
};

const dividerTextStyle: React.CSSProperties = {
  background: '#fff',
  padding: '0 15px',
  position: 'relative',
  zIndex: 1,
};

const socialButtonsContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  marginBottom: '30px',
};

const socialButtonStyle: React.CSSProperties = {
  borderRadius: '50%',
  width: '45px',
  height: '45px',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease',
};

const socialIconStyle: React.CSSProperties = {
  fontSize: '20px',
};

const footerTextStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#666',
};

export default Login;
