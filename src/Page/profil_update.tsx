import React, { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import InputField from '../components/common/InputField';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaCalendarAlt, FaSave, FaCamera, FaEye, FaEyeSlash } from 'react-icons/fa';

const Profile: React.FC = () => {
  interface User {
    firstName?: string;
    lastName?: string;
    email?: string;
    birthDate?: string;
    photoUrl?: string;
  }

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: (user as User)?.firstName || '',
    lastName: (user as User)?.lastName || '',
    email: (user as User)?.email || '',
    birthDate: (user as User)?.birthDate || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    (user && typeof (user as { photoUrl?: string }).photoUrl === 'string' ? (user as { photoUrl?: string }).photoUrl! : null)
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animation, setAnimation] = useState(false);

  useEffect(() => setAnimation(true), []);

  useEffect(() => {
    if (photo) {
      const objectUrl = URL.createObjectURL(photo);
      setPhotoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (user && typeof (user as { photoUrl?: string }).photoUrl === 'string') {
      setPhotoPreview((user as { photoUrl?: string }).photoUrl!);
    } else {
      setPhotoPreview(null);
    }
  }, [photo, user]);

  const validateField = (name: string, value: string) => {
    let error = '';
    if ((name === 'firstName' || name === 'lastName') && value.trim() === '') {
      error = 'Ce champ est requis';
    }
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      error = 'Email invalide';
    }
    if (name === 'newPassword' && value && value.length < 6) {
      error = 'Mot de passe trop court (min 6 caractères)';
    }
    if (name === 'confirmPassword' && value !== formData.newPassword) {
      error = 'Les mots de passe ne correspondent pas';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some(err => err);
    if (hasErrors) {
      toast.error('Veuillez corriger les erreurs avant de soumettre');
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('email', formData.email);
      data.append('birthDate', formData.birthDate);
      if (formData.oldPassword) data.append('oldPassword', formData.oldPassword);
      if (formData.newPassword) data.append('newPassword', formData.newPassword);
      if (photo) data.append('photo', photo);

      const response = await fetch('https://flask-back-api-for-project.onrender.com/profile/update', {
        method: 'POST',
        body: data,
        credentials: 'include'
      });

      if (!response.ok) {
        const errRes = await response.json();
        throw new Error(errRes.message || 'Erreur serveur');
      }

      const result = await response.json();
      if (result.photoUrl) setPhotoPreview(result.photoUrl);

      toast.success('Profil mis à jour avec succès !');
      // updateUser(result.user); // si tu as une fonction pour mettre à jour le contexte
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message || 'Erreur lors de la mise à jour du profil');
      else toast.error('Erreur lors de la mise à jour du profil');
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
      <div
        className="profile-container"
        style={{
          ...containerStyle,
          transform: animation ? 'translateY(0)' : 'translateY(20px)',
          opacity: animation ? 1 : 0,
          transition: 'all 0.6s ease-out'
        }}
      >
        {isSubmitting && (
          <div style={overlayStyle}>
            <div style={spinnerStyle} aria-label="Chargement en cours" />
          </div>
        )}

        <div className="logo-container" style={logoStyle}>
          <div style={logoCircleStyle}>
            <div style={logoInnerCircleStyle}>
              <span style={logoSpanStyle}>{user?.firstName?.charAt(0) || 'U'}</span>
            </div>
          </div>
          <h1 style={logoTextStyle}>Mon Profil</h1>
        </div>

        <form onSubmit={handleSubmit} style={formStyle} noValidate>
          <div style={profilePictureContainer}>
            <label htmlFor="photo-upload" style={profilePictureStyle} title="Changer la photo de profil">
              {photoPreview ? (
                <img src={photoPreview} alt="Aperçu photo de profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <FaCamera style={cameraIconStyle} />
              )}
              <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            </label>
            {photoPreview && (
              <button type="button" onClick={removePhoto} style={removePhotoButtonStyle} aria-label="Supprimer la photo de profil">
                Supprimer
              </button>
            )}
          </div>

          <div style={nameContainer}>
            {['firstName', 'lastName'].map((field) => (
              <div key={field} style={inputContainerStyle}>
                {field === 'firstName' && <FaUser style={{ ...iconStyle, color: '#28a745' }} />}
                <InputField
                  label={field === 'firstName' ? 'Prénom' : 'Nom'}
                  type="text"
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  required
                  placeholder={field === 'firstName' ? 'Votre prénom' : 'Votre nom'}
                  style={{
                    paddingLeft: '40px',
                    borderRadius: '12px',
                    borderColor: errors[field] ? '#dc3545' : undefined
                  }}
                  aria-invalid={!!errors[field]}
                  aria-describedby={`error-${field}`}
                />
                {errors[field] && (
                  <small id={`error-${field}`} style={errorTextStyle}>
                    {errors[field]}
                  </small>
                )}
              </div>
            ))}
          </div>

          <div style={inputContainerStyle}>
            <FaEnvelope style={{ ...iconStyle, color: '#28a745' }} />
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre.email@example.com"
              style={{ paddingLeft: '40px', borderRadius: '12px', borderColor: errors.email ? '#dc3545' : undefined }}
              aria-invalid={!!errors.email}
              aria-describedby="error-email"
            />
            {errors.email && <small id="error-email" style={errorTextStyle}>{errors.email}</small>}
          </div>

          <div style={inputContainerStyle}>
            <FaCalendarAlt style={{ ...iconStyle, color: '#28a745' }} />
            <InputField
              label="Date de naissance"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              style={{ paddingLeft: '40px', borderRadius: '12px' }}
            />
          </div>

          {['oldPassword', 'newPassword', 'confirmPassword'].map((field, idx) => (
            <div key={field} style={inputContainerStyle}>
              <FaLock style={{ ...iconStyle, color: '#28a745' }} />
              <InputField
                label={field === 'oldPassword' ? 'Mot de passe actuel' : field === 'newPassword' ? 'Nouveau mot de passe' : 'Confirmer le mot de passe'}
                type={field === 'oldPassword' ? (showOldPassword ? 'text' : 'password') : field === 'newPassword' ? (showNewPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')}
                name={field}
                value={formData[field as keyof typeof formData]}
                onChange={handleChange}
                placeholder={field === 'oldPassword' ? 'Ancien mot de passe' : field === 'newPassword' ? 'Nouveau mot de passe' : 'Confirmer mot de passe'}
                style={{ paddingLeft: '40px', borderRadius: '12px', borderColor: errors[field] ? '#dc3545' : undefined }}
                aria-invalid={!!errors[field]}
                aria-describedby={`error-${field}`}
              />
              <button
                type="button"
                onClick={() => {
                  if (field === 'oldPassword') setShowOldPassword(!showOldPassword);
                  else if (field === 'newPassword') setShowNewPassword(!showNewPassword);
                  else setShowConfirmPassword(!showConfirmPassword);
                }}
                style={togglePasswordButtonStyle}
              >
                {field === 'oldPassword' ? (showOldPassword ? <FaEyeSlash /> : <FaEye />) :
                 field === 'newPassword' ? (showNewPassword ? <FaEyeSlash /> : <FaEye />) :
                 showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors[field] && <small id={`error-${field}`} style={errorTextStyle}>{errors[field]}</small>}
            </div>
          ))}

          <div style={buttonContainerStyle}>
            <Button type="submit" style={saveButtonStyle}>
              <FaSave style={{ marginRight: '8px' }} /> Enregistrer
            </Button>
            <Button type="button" onClick={handleLogout} style={logoutButtonStyle}>
              Déconnexion
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* Styles */
const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f5f5f5'
};

const containerStyle: React.CSSProperties = {
  position: 'relative',
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '16px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '500px'
};

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(255,255,255,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
  borderRadius: '16px'
};

const spinnerStyle: React.CSSProperties = {
  border: '4px solid #f3f3f3',
  borderTop: '4px solid #28a745',
  borderRadius: '50%',
  width: '36px',
  height: '36px',
  animation: 'spin 1s linear infinite'
};

const logoStyle: React.CSSProperties = { textAlign: 'center', marginBottom: '20px' };
const logoCircleStyle: React.CSSProperties = { display: 'inline-block', borderRadius: '50%', backgroundColor: '#28a745', width: '60px', height: '60px', marginBottom: '8px' };
const logoInnerCircleStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' };
const logoSpanStyle: React.CSSProperties = { color: '#fff', fontWeight: 'bold', fontSize: '24px' };
const logoTextStyle: React.CSSProperties = { fontSize: '22px', color: '#333', margin: 0 };
const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '16px' };

const profilePictureContainer: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' };
const profilePictureStyle: React.CSSProperties = { width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e9ecef' };
const cameraIconStyle: React.CSSProperties = { fontSize: '32px', color: '#6c757d' };
const removePhotoButtonStyle: React.CSSProperties = { marginTop: '8px', background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer' };

const nameContainer: React.CSSProperties = { display: 'flex', gap: '12px' };
const inputContainerStyle: React.CSSProperties = { position: 'relative', width: '100%' };
const iconStyle: React.CSSProperties = { position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', fontSize: '18px' };
const errorTextStyle: React.CSSProperties = { color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' };

const togglePasswordButtonStyle: React.CSSProperties = { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer' };

const buttonContainerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', marginTop: '16px' };
const saveButtonStyle: React.CSSProperties = { backgroundColor: '#28a745', color: '#fff' };
const logoutButtonStyle: React.CSSProperties = { backgroundColor: '#dc3545', color: '#fff' };

export default Profile;
