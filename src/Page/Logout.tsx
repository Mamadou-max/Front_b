import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Appel API pour déconnexion côté serveur
        const response = await fetch('https://flask-back-api-for-project.onrender.com/logout', {
          method: 'POST',
          credentials: 'include', // envoie les cookies si nécessaire (JWT httpOnly)
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la déconnexion serveur');
        }

        // Nettoyage local (token, user, etc.)
        logout();

        toast.info('Vous êtes déconnecté.');
        navigate('/login');
      } catch (error) {
        console.error('Logout API failed:', error);
        toast.error('Impossible de se déconnecter proprement, veuillez réessayer.');
      }
    };

    handleLogout();
  }, [logout, navigate]);

  return (
    <main
      role="alert"
      aria-live="assertive"
      style={mainStyle}
    >
      <div style={containerStyle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={iconStyle}
          fill="none"
          viewBox="0 0 24 24"
          stroke="#28a745"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
          />
        </svg>
        <p style={textStyle}>Déconnexion en cours...</p>
        <div style={loaderStyle} aria-hidden="true" />
      </div>
    </main>
  );
};

const mainStyle: React.CSSProperties = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #d4f6d4, #a7e1a7)',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  padding: '20px',
};

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: 'white',
  padding: '40px 60px',
  borderRadius: '20px',
  boxShadow: '0 10px 30px rgba(40, 167, 69, 0.3)',
  minWidth: '280px',
  maxWidth: '400px',
};

const iconStyle: React.CSSProperties = {
  width: '60px',
  height: '60px',
  marginBottom: '20px',
  animation: 'pulse 2s infinite',
};

const textStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  color: '#28a745',
  marginBottom: '25px',
  fontWeight: 600,
};

const loaderStyle: React.CSSProperties = {
  margin: '0 auto',
  width: '40px',
  height: '40px',
  border: '5px solid #28a745',
  borderTopColor: 'transparent',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

// Inject CSS animations globally
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;
document.head.appendChild(styleSheet);

export default Logout;
