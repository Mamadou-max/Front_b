import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/common/InputField';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaSave, FaCamera } from 'react-icons/fa';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    birthDate: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword){
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://flask-back-api-for-project.onrender.com/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Ajoute un token si ton API est sécurisée :
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          birthDate: formData.birthDate,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du profil');
      }

      // const data = await response.json();

      toast.success('Profil mis à jour avec succès!');
      // Tu peux ici mettre à jour le user dans ton contexte auth si besoin
      // ou faire un refresh de la page
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Erreur lors de la mise à jour du profil');
      } else {
        toast.error('Erreur lors de la mise à jour du profil');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-page" style={pageStyle}>
      <div className="profile-container" style={{
        ...containerStyle,
        transform: animation ? 'translateY(0)' : 'translateY(20px)',
        opacity: animation ? 1 : 0,
        transition: 'all 0.6s ease-out'
      }}>
        <div className="logo-container" style={logoStyle}>
          <div style={logoCircleStyle}>
            <div style={logoInnerCircleStyle}>
              <span style={logoSpanStyle}>{user?.firstName?.charAt(0) || 'U'}</span>
            </div>
          </div>
          <h1 style={logoTextStyle}>Mon Profil</h1>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={profilePictureContainer}>
            <div style={profilePictureStyle}>
              <FaCamera style={cameraIconStyle} />
            </div>
          </div>

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
            />
          </div>

          <div style={passwordContainer}>
            <div style={inputContainerStyle}>
              <div style={iconStyle}>
                <FaLock style={{ color: '#28a745' }} />
              </div>
              <InputField
                label="Ancien mot de passe"
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                placeholder="Votre ancien mot de passe"
                style={{ paddingLeft: '40px', borderRadius: '12px' }}
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                style={showPasswordButtonStyle}
              >
                {showOldPassword ? "Cacher" : "Voir"}
              </button>
            </div>

            <div style={inputContainerStyle}>
              <div style={iconStyle}>
                <FaLock style={{ color: '#28a745' }} />
              </div>
              <InputField
                label="Nouveau mot de passe"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Votre nouveau mot de passe"
                style={{ paddingLeft: '40px', borderRadius: '12px' }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={showPasswordButtonStyle}
              >
                {showNewPassword ? "Cacher" : "Voir"}
              </button>
            </div>

            <div style={inputContainerStyle}>
              <div style={iconStyle}>
                <FaLock style={{ color: '#28a745' }} />
              </div>
              <InputField
                label="Confirmer le nouveau mot de passe"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez votre nouveau mot de passe"
                style={{ paddingLeft: '40px', borderRadius: '12px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={showPasswordButtonStyle}
              >
                {showConfirmPassword ? "Cacher" : "Voir"}
              </button>
            </div>
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
                Mise à jour en cours...
              </div>
            ) : (
              <>
                <FaSave style={{ marginRight: '10px' }} /> Enregistrer les modifications
              </>
            )}
          </Button>
        </form>

        <Button
          onClick={handleLogout}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '14px',
            background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.1em',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          Se déconnecter
        </Button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .profile-container::before {
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
        .profile-container::after {
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
  maxWidth: '600px',
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
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '15px',
  boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)'
};

const logoInnerCircleStyle: React.CSSProperties = {
  width: '90px',
  height: '90px',
  borderRadius: '50%',
  background: 'white',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const logoSpanStyle: React.CSSProperties = {
  fontSize: '3em',
  fontWeight: 'bold',
  color: '#28a745'
};

const logoTextStyle: React.CSSProperties = {
  fontSize: '2.2em',
  fontWeight: 700,
  color: '#333',
  letterSpacing: '1px',
  background: 'linear-gradient(45deg, #28a745, #1e7e34)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

const profilePictureContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '30px'
};

const profilePictureStyle: React.CSSProperties = {
  width: '140px',
  height: '140px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  fontSize: '3.5em',
  fontWeight: 'bold',
  cursor: 'pointer',
  position: 'relative',
  boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)',
  transition: 'all 0.3s ease'
};

const cameraIconStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  fontSize: '1.5em',
  opacity: 0.7
};

const nameContainer: React.CSSProperties = {
  display: 'flex',
  gap: '20px',
  width: '100%',
  marginBottom: '20px'
};

const inputContainerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  marginBottom: '15px'
};

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '12px',
  transform: 'translateY(-50%)',
  pointerEvents: 'none'
};

const passwordContainer: React.CSSProperties = {
  width: '100%'
};

const showPasswordButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  right: '12px',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: '#28a745',
  fontWeight: '600',
  cursor: 'pointer',
  userSelect: 'none'
};

export default Profile;
