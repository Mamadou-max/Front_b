// Activite.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Form, Row, Col, Badge, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Chart from 'chart.js/auto';
import { Skeleton } from '@mui/material';
import NouvelleActivité from './NouvelleActivite';



interface Activity {
  id: number;
  name: string;
  type: 'Course' | 'Vélo' | 'Natation' | 'Musculation';
  duration: number;
  distance?: number;
  calories: number;
  date: string;
  status: 'Complétée' | 'En cours' | 'À venir';
}

const Activite: React.FC = () => {
  // États
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [activityType, setActivityType] = useState<'all' | 'Course' | 'Vélo' | 'Natation' | 'Musculation'>('all');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const navigate = useNavigate();

  // Données statiques (simulation d'un appel API)
  useEffect(() => {
    try {
      const mockActivities: Activity[] = [
        { id: 1, name: "Course du matin", type: "Course", duration: 45, distance: 10, calories: 400, date: "2025-08-18", status: "Complétée" },
        { id: 2, name: "Vélo en forêt", type: "Vélo", duration: 60, distance: 25, calories: 500, date: "2025-08-17", status: "Complétée" },
        { id: 3, name: "Natation", type: "Natation", duration: 40, calories: 350, date: "2025-08-16", status: "Complétée" },
        { id: 4, name: "Musculation", type: "Musculation", duration: 30, calories: 200, date: "2025-08-15", status: "En cours" },
        { id: 5, name: "Course du soir", type: "Course", duration: 30, distance: 5, calories: 250, date: "2025-08-14", status: "À venir" },
      ];
      setActivities(mockActivities);
      setFilteredActivities(mockActivities);
    } catch (err) {
      setError("Erreur lors du chargement des activités.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filtres
  useEffect(() => {
    const now = new Date();
    const filtered = activities.filter(activity => {
      const isTypeMatch = activityType === 'all' || activity.type === activityType;
      const activityDate = new Date(activity.date);
      let isDateMatch = true;

      if (timeRange === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        isDateMatch = activityDate >= weekAgo && activityDate <= now;
      } else if (timeRange === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        isDateMatch = activityDate >= monthAgo && activityDate <= now;
      } else if (timeRange === 'year') {
        const yearAgo = new Date(now);
        yearAgo.setFullYear(now.getFullYear() - 1);
        isDateMatch = activityDate >= yearAgo && activityDate <= now;
      }

      return isTypeMatch && isDateMatch;
    });
    setFilteredActivities(filtered);
  }, [activities, timeRange, activityType]);

  // Graphique
  useEffect(() => {
    if (chartRef.current && filteredActivities.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Nettoyage du graphique précédent
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        // Préparation des données
        const types = [...new Set(filteredActivities.map(a => a.type))];
        const data = types.map(type => {
          return filteredActivities
            .filter(a => a.type === type)
            .reduce((sum, a) => sum + a.duration, 0);
        });

        // Création du graphique
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: types,
            datasets: [{
              label: 'Durée totale (min)',
              data: data,
              backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
              borderRadius: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.raw} min`,
                }
              }
            },
            scales: {
              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false } }
            }
          }
        });
      }
    }

    // Nettoyage à la désactivation du composant
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [filteredActivities]);

  // Formatage des dates
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Rendu
  return (
    <div className="container-fluid py-4">
      <Row className="mb-4">
        <Col>
          <h2><i className="bi bi-activity me-2"></i>Mes Activités</h2>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="m-0">Statistiques</Card.Title>
              <div className="d-flex gap-2">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-time-range">
                    {timeRange === 'week' ? 'Semaine' : timeRange === 'month' ? 'Mois' : 'Année'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setTimeRange('week')}>Semaine</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange('month')}>Mois</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange('year')}>Année</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-activity-type">
                    {activityType === 'all' ? 'Tous' : activityType}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setActivityType('all')}>Tous</Dropdown.Item>
                    <Dropdown.Item onClick={() => setActivityType('Course')}>Course</Dropdown.Item>
                    <Dropdown.Item onClick={() => setActivityType('Vélo')}>Vélo</Dropdown.Item>
                    <Dropdown.Item onClick={() => setActivityType('Natation')}>Natation</Dropdown.Item>
                    <Dropdown.Item onClick={() => setActivityType('Musculation')}>Musculation</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Header>
            <Card.Body className="p-3" style={{ height: '300px' }}>
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Spinner animation="border" role="status" />
                </div>
              ) : filteredActivities.length === 0 ? (
                <Alert variant="info" className="mb-0">Aucune activité trouvée pour cette période.</Alert>
              ) : (
                <canvas ref={chartRef} className="w-100 h-100"></canvas>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="m-0">Liste des Activités</Card.Title>
              <Button
  size="sm"
  variant="primary"
  

onClick={() => navigate("/nouvelle-activite")}


>
  <i className="bi bi-plus me-1"></i>Nouvelle Activité
</Button>
            </Card.Header>
            <Card.Body className="p-0">
              {isLoading ? (
                <div className="p-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={40} className="mb-2" />
                  ))}
                </div>
              ) : (
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Nom</th>
                      <th>Type</th>
                      <th>Durée (min)</th>
                      <th>Distance (km)</th>
                      <th>Calories</th>
                      <th>Date</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map(activity => (
                      <tr key={activity.id}>
                        <td className="fw-bold">{activity.name}</td>
                        <td>
                          <Badge bg={
                            activity.type === 'Course' ? 'primary' :
                            activity.type === 'Vélo' ? 'success' :
                            activity.type === 'Natation' ? 'info' : 'warning'
                          }>
                            {activity.type}
                          </Badge>
                        </td>
                        <td>{activity.duration}</td>
                        <td>{activity.distance ? activity.distance : '-'}</td>
                        <td>{activity.calories}</td>
                        <td>{formatDate(activity.date)}</td>
                        <td>
                          <Badge bg={
                            activity.status === 'Complétée' ? 'success' :
                            activity.status === 'En cours' ? 'primary' : 'secondary'
                          }>
                            {activity.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Activite;
