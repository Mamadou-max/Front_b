// src/App.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './Page/Home';
import Login from './Page/Login';
import Inscription from './Page/Inscription';
import Profile from './Page/Profil';
import ProfilUpdate from './Page/profil_update';
import Dashboard from './Page/Dashboard';
import Recommendation from './Page/Recommendations';
import Logout from './Page/Logout';
import ForgotPassword from './Page/forgot-password';
import ResetPassword from './Page/ResetPassword';
import Activite from './Page/Activite';
import Rapport from './Page/Rapport';
import Parametre from './Page/Parametre';
import NouvelleActivite from './Page/NouvelleActivite'; // <-- Ajoute cette ligne

// eslint-disable-next-line react-refresh/only-export-components
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'inscription', element: <Inscription /> },
      { path: 'profile', element: <Profile /> },
      { path: 'profil-update', element: <ProfilUpdate /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'recommendation', element: <Recommendation /> },
      { path: 'logout', element: <Logout /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password/:token', element: <ResetPassword /> },
      { path: 'activite', element: <Activite /> },
      { path: 'rapport', element: <Rapport /> },
      { path: 'parametre', element: <Parametre /> },
      { path: 'nouvelle-activite', element: <NouvelleActivite /> }, // <-- Ajoute cette ligne
      {
        path: '*',
        element: (
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>404 - Page Non Trouvée</h1>
            <p>Désolé, cette page n'existe pas.</p>
            <Link to="/" style={{ color: '#28a745', textDecoration: 'none' }}>
              Retour à l'accueil
            </Link>
          </div>
        ),
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
