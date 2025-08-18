// src/Page/NouvelleActivite.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  InputGroup,
  Dropdown,
  DropdownButton
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface FormData {
  name: string;
  type: 'Course' | 'Vélo' | 'Natation' | 'Musculation' | '';
  duration: number;
  distance?: number;
  calories: number;
  date: Date;
  status: 'Complétée' | 'En cours' | 'À venir';
}

const NouvelleActivite: React.FC = () => {
  // État pour le formulaire
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: '',
    duration: 0,
    distance: undefined,
    calories: 0,
    date: new Date(),
    status: 'À venir',
  });

  // État pour la validation et le chargement
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Navigation
  const navigate = useNavigate();

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'distance' || name === 'calories' ? Number(value) : value,
    }));
  };

  // Gestion du type d'activité
  const handleTypeSelect = (type: FormData['type']) => {
    setFormData(prev => ({
      ...prev,
      type,
      distance: type === 'Course' || type === 'Vélo' ? prev.distance ?? 0 : undefined,
    }));
  };

  // Gestion du statut
  const handleStatusSelect = (status: FormData['status']) => {
    setFormData(prev => ({ ...prev, status }));
  };

  // Gestion de la date
  const handleDateChange = (date: Date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidated(true);

    // Validation basique
    if (!formData.name || !formData.type || formData.duration <= 0 || formData.calories <= 0) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Validation de la distance si fournie
    if (formData.distance !== undefined && formData.distance < 0) {
      setError('La distance ne peut pas être négative.');
      return;
    }

    // Simulation de soumission
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Simulation d'un appel API
    setTimeout(() => {
      console.log('Nouvelle activité ajoutée :', formData);
      setSuccess('Activité ajoutée avec succès !');

      // Nettoyage des messages après 3 secondes
      setTimeout(() => {
        setSuccess(null);
        navigate('/activite');
      }, 2000);

      setIsLoading(false);
    }, 1500);
  };

  // Calcul automatique des calories
  useEffect(() => {
    if (formData.type && formData.duration > 0) {
      let caloriesPerMinute = 0;
      switch (formData.type) {
        case 'Course':
          caloriesPerMinute = 10;
          break;
        case 'Vélo':
          caloriesPerMinute = 8;
          break;
        case 'Natation':
          caloriesPerMinute = 12;
          break;
        case 'Musculation':
          caloriesPerMinute = 6;
          break;
        default:
          caloriesPerMinute = 0;
      }
      const newCalories = Math.round(caloriesPerMinute * formData.duration);
      setFormData(prev => ({
        ...prev,
        calories: newCalories,
      }));
    }
  }, [formData.type, formData.duration]);

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Nouvelle Activité
              </h4>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                  {success}
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="name">
                    <Form.Label>
                      Nom de l'activité <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Course du matin"
                    />
                    <Form.Control.Feedback type="invalid">
                      Le nom est obligatoire.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="type">
                    <Form.Label>
                      Type d'activité <span className="text-danger">*</span>
                    </Form.Label>
                    <DropdownButton
                      id="dropdown-type"
                      title={formData.type || 'Sélectionnez un type'}
                      variant="outline-secondary"
                      className="w-100"
                      
                      aria-label="Sélectionnez un type d'activité"
                    >
                      <Dropdown.Item onClick={() => handleTypeSelect('Course')}>Course</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleTypeSelect('Vélo')}>Vélo</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleTypeSelect('Natation')}>Natation</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleTypeSelect('Musculation')}>Musculation</Dropdown.Item>
                    </DropdownButton>
                    <Form.Control.Feedback type="invalid">
                      Le type est obligatoire.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md="4" controlId="duration">
                    <Form.Label>
                      Durée (minutes) <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        min="1"
                        aria-label="Durée en minutes"
                      />
                      <InputGroup.Text>min</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                  {formData.type === 'Course' || formData.type === 'Vélo' ? (
                    <Form.Group as={Col} md="4" controlId="distance">
                      <Form.Label>Distance (km)</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          name="distance"
                          value={formData.distance ?? ''}
                          onChange={handleChange}
                          min="0"
                          step="0.1"
                          aria-label="Distance en kilomètres"
                        />
                        <InputGroup.Text>km</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  ) : (
                    <Form.Group as={Col} md="4" controlId="distance">
                      <Form.Label>Distance (km)</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          name="distance"
                          value={''}
                          disabled
                          placeholder="N/A"
                          aria-label="Distance non applicable"
                        />
                        <InputGroup.Text>km</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                  )}

                  <Form.Group as={Col} md="4" controlId="calories">
                    <Form.Label>Calories brûlées</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="number"
                        name="calories"
                        value={formData.calories}
                        onChange={handleChange}
                        readOnly
                        aria-label="Calories brûlées"
                      />
                      <InputGroup.Text>kcal</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md="6" controlId="date">
                    <Form.Label>
                      Date <span className="text-danger">*</span>
                    </Form.Label>
                    <DatePicker
                      selected={formData.date}
                        
                      dateFormat="dd/MM/yyyy"
                      className="form-control"
                      required
                      aria-label="Sélectionnez une date"
                    />
                  </Form.Group>

                  <Form.Group as={Col} md="6" controlId="status">
                    <Form.Label>
                      Statut <span className="text-danger">*</span>
                    </Form.Label>
                    <DropdownButton
                      id="dropdown-status"
                      title={formData.status}
                      variant="outline-secondary"
                      className="w-100"
                      aria-label="Sélectionnez un statut"
                    >
                      <Dropdown.Item onClick={() => handleStatusSelect('À venir')}>À venir</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleStatusSelect('En cours')}>En cours</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleStatusSelect('Complétée')}>Complétée</Dropdown.Item>
                    </DropdownButton>
                  </Form.Group>
                </Row>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate('/activite')}
                    className="me-md-2"
                    aria-label="Annuler"
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    aria-label="Enregistrer"
                  >
                    {isLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        {' Enregistrement...'}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-1"></i>
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NouvelleActivite;
