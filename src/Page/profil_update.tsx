import React, { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCalendarAlt,
  FaSave,
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from 'react-icons/fa';
import InputField from '../components/common/InputField';
import Button from '../components/Button';
import styled, { keyframes, css } from 'styled-components';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// --- Types ---
interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  photoUrl?: string;
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ShowPasswordState = {
  oldPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
};

// --- Styles (Styled Components) ---
const ProfilePage = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProfileContainer = styled.div<{ animate: boolean }>`
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  ${({ animate }) =>
    animate &&
    css`
      animation: ${fadeIn} 0.6s ease-out;
    `}

  position: relative;
  overflow: hidden;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const LogoCircle = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #28a745;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
`;

const LogoInnerCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #28a745;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProfilePictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
`;

const ProfilePicture = styled.label`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 4px solid #28a745;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f0f0;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CameraIcon = styled(FaCamera)`
  font-size: 2.5rem;
  color: #28a745;
`;

const RemovePhotoButton = styled.button`
  margin-top: 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #c82333;
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Icon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #28a745;
  z-index: 1;
`;

const ErrorText = styled.small`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: block;
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const ShowPasswordButton = styled.button`
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #28a745;
  z-index: 1;
`;

const SubmitButton = styled(Button)`
  background: #28a745;
  color: white;
  border-radius: 12px;
  padding: 0.8rem;
  font-weight: bold;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const LogoutButton = styled(Button)`
  background: #dc3545;
  color: white;
  border-radius: 12px;
  padding: 0.8rem;
  font-weight: bold;
  margin-top: 0.5rem;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  z-index: 10;
`;

const Spinner = styled(FaSpinner)`
  font-size: 2rem;
  color: #28a745;
  animation: ${spin} 1s linear infinite;
`;

// --- Composant Profile ---
const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // État initial sécurisé
  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    birthDate: user?.birthDate ?? '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(user?.photoUrl ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [animate, setAnimate] = useState(false);

  // Animation au montage
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Nettoyage de l'URL de la photo
  useEffect(() => {
    if (photo) {
      const objectUrl = URL.createObjectURL(photo);
      setPhotoPreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else if (user?.photoUrl) {
      setPhotoPreview(user.photoUrl);
    } else {
      setPhotoPreview(null);
    }
  }, [photo, user?.photoUrl]);

  // Validation des champs
  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) error = 'Ce champ est requis';
        break;
      case 'email':
        if (!/\S+@\S+\.\S+/.test(value)) error = 'Email invalide';
        break;
      case 'newPassword':
        if (value && value.length < 6) error = 'Minimum 6 caractères';
        break;
      case 'confirmPassword':
        if (value !== formData.newPassword) error = 'Les mots de passe ne correspondent pas';
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Gestion des changements
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Gestion de la photo
  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(user?.photoUrl ?? null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation finale
    if (formData.newPassword && !formData.oldPassword) {
      toast.error('Ancien mot de passe requis pour le changer');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== 'confirmPassword') {
          data.append(key, value);
        }
      });
      if (photo) data.append('photo', photo);

      const response = await fetch('https://flask-back-api-for-project.onrender.com/profile/update', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        throw new Error(errorData.message || 'Échec de la mise à jour');
      }

      const result = await response.json();
      if (result.photoUrl) {
        setPhotoPreview(result.photoUrl);
      }
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Déconnexion
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Toggle mot de passe
  const toggleShowPassword = (field: keyof ShowPasswordState) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Rendu
  return (
    <ProfilePage>
      <ProfileContainer animate={animate}>
        {isSubmitting && (
          <Overlay>
            <Spinner />
          </Overlay>
        )}
        <LogoContainer>
          <LogoCircle>
            <LogoInnerCircle>{user?.firstName?.charAt(0) ?? 'U'}</LogoInnerCircle>
          </LogoCircle>
          <h1 style={{ color: '#28a745', fontWeight: 'bold', margin: 0 }}>Mon Profil</h1>
        </LogoContainer>
        <Form onSubmit={handleSubmit}>
          <ProfilePictureContainer>
            <ProfilePicture htmlFor="photo-upload">
              {photoPreview ? (
                <img src={photoPreview} alt="Photo de profil" />
              ) : (
                <CameraIcon />
              )}
            </ProfilePicture>
            <input
              type="file"
              id="photo-upload"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            {photoPreview && (
              <RemovePhotoButton type="button" onClick={removePhoto}>
                Supprimer
              </RemovePhotoButton>
            )}
          </ProfilePictureContainer>
          <InputContainer>
            <Icon><FaUser /></Icon>
            <InputField
              label="Prénom"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Votre prénom"
              style={{ paddingLeft: '3rem' }}
              error={errors.firstName}
            />
            {errors.firstName && <ErrorText>{errors.firstName}</ErrorText>}
          </InputContainer>
          <InputContainer>
            <Icon><FaUser /></Icon>
            <InputField
              label="Nom"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="Votre nom"
              style={{ paddingLeft: '3rem' }}
              error={errors.lastName}
            />
            {errors.lastName && <ErrorText>{errors.lastName}</ErrorText>}
          </InputContainer>
          <InputContainer>
            <Icon><FaEnvelope /></Icon>
            <InputField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre.email@example.com"
              style={{ paddingLeft: '3rem' }}
              error={errors.email}
            />
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </InputContainer>
          <InputContainer>
            <Icon><FaCalendarAlt /></Icon>
            <InputField
              label="Date de naissance"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              style={{ paddingLeft: '3rem' }}
            />
          </InputContainer>
          {(['oldPassword', 'newPassword', 'confirmPassword'] as const).map((field) => (
            <PasswordContainer key={field}>
              <Icon><FaLock /></Icon>
              <InputField
                label={
                  field === 'oldPassword' ? 'Ancien mot de passe' :
                  field === 'newPassword' ? 'Nouveau mot de passe' :
                  'Confirmer mot de passe'
                }
                type={showPassword[field] ? 'text' : 'password'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={
                  field === 'oldPassword' ? 'Ancien mot de passe' :
                  field === 'newPassword' ? 'Nouveau mot de passe' :
                  'Confirmer mot de passe'
                }
                style={{ paddingLeft: '3rem' }}
                error={errors[field]}
              />
              <ShowPasswordButton
                type="button"
                onClick={() => toggleShowPassword(field)}
                aria-label={showPassword[field] ? 'Masquer' : 'Afficher'}
              >
                {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
              </ShowPasswordButton>
              {errors[field] && <ErrorText>{errors[field]}</ErrorText>}
            </PasswordContainer>
          ))}
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                Enregistrement...
                <FaSpinner />
              </>
            ) : (
              <>
                Enregistrer
                <FaSave />
              </>
            )}
          </SubmitButton>
          <LogoutButton type="button" onClick={handleLogout}>
            Déconnexion
          </LogoutButton>
        </Form>
      </ProfileContainer>
    </ProfilePage>
  );
};

export default Profile;
