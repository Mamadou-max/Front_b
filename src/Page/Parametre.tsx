// Parametre.tsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface UserSettings {
  name: string;
  email: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: 'fr' | 'en';
  units: 'metric' | 'imperial';
}

const Parametre: React.FC = () => {
  // États
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    theme: 'auto',
    notifications: true,
    language: 'fr',
    units: 'metric',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Données statiques (à remplacer par un appel API)
  useEffect(() => {
    const mockSettings: UserSettings = {
      name: 'Mamadou BOUARE',
      email: 'mamadou.bouare@example.com',
      theme: 'auto',
      notifications: true,
      language: 'fr',
      units: 'metric',
    };
    setSettings(mockSettings);
    setIsLoading(false);
  }, []);

  // Gestion des changements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setSettings(prev => ({ ...prev, [name]: newValue }));
  };

  // Sauvegarde
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulation de sauvegarde
    setTimeout(() => {
      setSuccess("Paramètres sauvegardés avec succès !");
      setIsLoading(false);
    }, 1000);
  };

  // Rendu
  return (
    <div className="container-fluid py-4">
      <Row className="mb-4">
        <Col>
          <h2><i className="bi bi-gear me-2"></i>Paramètres</h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <Card.Title>Informations Personnelles</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nom complet</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={settings.name}
                   
                    disabled={isLoading}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={settings.email}
                    
                    disabled={isLoading}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      {' Sauvegarde...'}
                    </>
                  ) : 'Sauvegarder'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header>
              <Card.Title>Préférences</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Thème</Form.Label>
                  <Form.Select
                    name="theme"
                    value={settings.theme}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="auto">Auto (système)</option>
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Langue</Form.Label>
                  <Form.Select
                    name="language"
                    value={settings.language}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Unités</Form.Label>
                  <Form.Select
                    name="units"
                    value={settings.units}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    <option value="metric">Métrique (km, kg)</option>
                    <option value="imperial">Impérial (miles, lbs)</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="notifications"
                    label="Activer les notifications"
                    name="notifications"
                    checked={settings.notifications}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      {' Sauvegarde...'}
                    </>
                  ) : 'Sauvegarder'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <Card.Title>Intégrations</Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  Strava
                  <Badge bg="success" className="rounded-pill">Connecté</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  Google Fit
                  <Button size="sm" variant="outline-primary">Connecter</Button>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  Apple Health
                  <Button size="sm" variant="outline-primary">Connecter</Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header>
              <Card.Title>Actions</Card.Title>
            </Card.Header>
            <Card.Body>
             <Button
  size="sm"
  variant="primary"
onClick={() => navigate("/nouvelle-activite")} // Redirection vers la page de création d'une nouvelle activité
>
  <i className="bi bi-plus me-1"></i>Nouvelle Activité
</Button>
              <Button variant="outline-danger" className="w-100">
                Supprimer le compte
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Parametre;
