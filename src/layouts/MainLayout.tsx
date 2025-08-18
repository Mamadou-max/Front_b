// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const headerStyle: React.CSSProperties = {
    background: '#28a745',
    color: 'white',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };

  const navLinkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 15px',
    fontWeight: 'bold',
    fontSize: '1.1em',
    transition: 'color 0.2s ease-in-out',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '1.8em',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  };

  const buttonStyle: React.CSSProperties = {
    marginLeft: '15px',
  };

  return (
    <header style={headerStyle}>
      <Link to="/" style={logoStyle}>SportRardar</Link>
      <nav style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={navLinkStyle}>Accueil</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
            <Link to="/profile" style={navLinkStyle}>Profil</Link>
            <Button onClick={logout} variant="secondary" size="small" style={buttonStyle}>Déconnexion</Button>
          </>
        ) : (
          <>
            <Link to="/login" style={navLinkStyle}>Connexion</Link>
            <Link to="/inscription" style={navLinkStyle}>Inscription</Link>
          </>
        )}
      </nav>
    </header>
  );
};

const Footer: React.FC = () => {
  const footerStyle: React.CSSProperties = {
    background: '#333',
    color: 'white',
    padding: '15px 20px',
    textAlign: 'center',
    fontSize: '0.9em',
    marginTop: 'auto',
  };

  return (
    <footer style={footerStyle}>
      © {new Date().getFullYear()} SportZen. Tous droits réservés.
    </footer>
  );
};

const MainLayout: React.FC = () => {
  return (
    <AuthProvider>
      <div className="main-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <Outlet />
        </main>
        <Footer />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
};

export default MainLayout;
