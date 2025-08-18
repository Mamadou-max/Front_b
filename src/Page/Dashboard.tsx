import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar, Container, Nav, Dropdown, Button, Row, Col, Card,
  ProgressBar, ListGroup, Table, Spinner, Alert, Badge,
  Offcanvas, Tooltip, OverlayTrigger, Form
} from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';
import Chart from 'chart.js/auto';
import { Skeleton } from '@mui/material';
import Activite from './Activite';  // Avec accent
import Rapport from './Rapport';
import Parametre from './Parametre';

// Dans Dashboard.tsx
    // Chemin relatif




// --- Interfaces ---
interface KpiCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
  color: string;
  tooltip?: string;
}

interface ProjectItem {
  id: number;
  name: string;
  status: 'En cours' | 'Terminé' | 'En attente' | 'Annulé';
  progress: number;
  deadline: string;
  team: string[];
  budget?: number;
}

interface Activity {
  id: number;
  name: string;
  time: string;
  status: 'Complétée' | 'En cours' | 'À venir';
  type: 'Course' | 'Vélo' | 'Natation' | 'Musculation';
}

interface TeamPerformance {
  name: string;
  projects: number;
  tasksCompleted: number;
  productivity: string;
  avgDelay: string;
}

interface SportsData {
  totalDistance: number;
  caloriesBurned: number;
  activityTime: number;
  sessions: number;
}

// --- Composant KpiCard (amélioré) ---
const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, isPositive, icon, color, tooltip }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="mb-4 shadow-sm border-0 h-100">
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted mb-1 small">{title}</p>
            {isLoading ? (
              <Skeleton variant="text" width={60} height={30} />
            ) : (
              <h3 className="mb-0 fw-bold">{value}</h3>
            )}
            {isLoading ? (
              <Skeleton variant="text" width={40} />
            ) : (
              <small className={`d-flex align-items-center mt-1 ${isPositive ? 'text-success' : 'text-danger'}`}>
                <i className={`bi bi-${isPositive ? 'arrow-up' : 'arrow-down'}-right me-1`}></i>
                {change}
              </small>
            )}
          </div>
          <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip || title}</Tooltip>}>
            <div className={`bg-${color}-light text-${color} p-2 rounded-circle`}>
              <i className={`bi ${icon} fs-4`}></i>
            </div>
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  );
};

// --- Données statiques (exemple réaliste) ---
const projects: ProjectItem[] = [
  { id: 1, name: "Refonte du site web", status: "En cours", progress: 75, deadline: "15 oct. 2023", team: ["Jean", "Marie", "Luc"], budget: 12000 },
  { id: 2, name: "Application mobile", status: "En attente", progress: 30, deadline: "30 nov. 2023", team: ["Sophie", "Pierre"], budget: 8000 },
  { id: 3, name: "Migration vers React 18", status: "Terminé", progress: 100, deadline: "05 sept. 2023", team: ["Thomas", "Émilie"], budget: 5000 },
  { id: 4, name: "Optimisation SEO", status: "En cours", progress: 60, deadline: "20 oct. 2023", team: ["Nicolas", "Camille"], budget: 3000 },
];

const recentActivities: Activity[] = [
  { id: 1, name: "Course du matin (10km)", time: "Il y a 2h", status: "Complétée", type: "Course" },
  { id: 2, name: "Séance de vélo (45min)", time: "Il y a 5h", status: "En cours", type: "Vélo" },
  { id: 3, name: "Natation (1h)", time: "Hier", status: "Complétée", type: "Natation" },
  { id: 4, name: "Musculation (30min)", time: "Il y a 2 jours", status: "À venir", type: "Musculation" },
];

const teamPerformance: TeamPerformance[] = [
  { name: "Développement", projects: 8, tasksCompleted: 142, productivity: "+24%", avgDelay: "2.3 jours" },
  { name: "Design", projects: 5, tasksCompleted: 87, productivity: "+18%", avgDelay: "3.1 jours" },
  { name: "Marketing", projects: 6, tasksCompleted: 94, productivity: "-4%", avgDelay: "4.2 jours" },
  { name: "Support", projects: 7, tasksCompleted: 128, productivity: "+12%", avgDelay: "1.8 jours" },
];

// --- Composant principal ---
const Dashboard: React.FC = () => {
  // --- Refs pour les graphiques ---
  const chartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const barChartInstance = useRef<Chart | null>(null);
  const pieChartInstance = useRef<Chart | null>(null);

  // --- States ---
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'analytics'>('overview');
  const [sportsData, setSportsData] = useState<SportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- API Config ---
  const API_URL = import.meta.env.VITE_API_URL || 'https://flask-back-api-for-project.onrender.com/dashboard/data';




  // --- Effets ---
  // 1. Thème
  useEffect(() => {
    const applyTheme = (selectedTheme: 'light' | 'dark' | 'auto') => {
      const root = document.documentElement;
      if (selectedTheme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-bs-theme', selectedTheme);
      }
      localStorage.setItem('theme', selectedTheme);
    };

    applyTheme(theme);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => theme === 'auto' && applyTheme('auto');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 2. Données sportives (simulées pour l'exemple)
  useEffect(() => {
    const fetchSportsData = async () => {
      try {
        setIsLoading(true);
        // Simulation de données (à remplacer par un vrai appel API)
        const mockData: SportsData = {
          totalDistance: 185.6,
          caloriesBurned: 2450,
          activityTime: 12.5,
          sessions: 18,
        };
        setSportsData(mockData);
        setError(null);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les données. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSportsData();
  }, []);

  // 3. Graphiques
  useEffect(() => {
    const initCharts = () => {
      // Données dynamiques selon timeRange
      const lineData = timeRange === 'week'
        ? [12, 19, 15, 22, 18, 25, 30]
        : timeRange === 'month'
          ? [65, 59, 80, 81, 56, 72, 85, 92, 78, 82, 90, 95]
          : [100, 120, 140, 130, 160, 180, 200, 190, 220, 240, 210, 250];

      // Graphique principal (ligne)
      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
          chartInstance.current?.destroy();
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(54, 162, 235, 0.3)');
          gradient.addColorStop(1, 'rgba(54, 162, 235, 0)');

          chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
              labels: timeRange === 'week'
                ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
                : timeRange === 'month'
                  ? ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
                  : ['2020', '2021', '2022', '2023'],
              datasets: [{
                label: timeRange === 'week' ? 'Distance (km)' : 'Performance',
                data: lineData,
                borderColor: '#36a2eb',
                backgroundColor: gradient,
                tension: 0.3,
                fill: true,
                borderWidth: 2,
                pointRadius: 4,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  titleFont: { size: 14 },
                  bodyFont: { size: 12 },
                  padding: 10,
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

      // Graphique à barres (activité hebdomadaire)
      if (barChartRef.current) {
        const ctx = barChartRef.current.getContext('2d');
        if (ctx) {
          barChartInstance.current?.destroy();
          barChartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
              datasets: [{
                label: 'Minutes d\'activité',
                data: [45, 60, 75, 50, 90, 120, 60],
                backgroundColor: '#4e73df',
                borderRadius: 4,
                maxBarThickness: 30,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
              }
            }
          });
        }
      }

      // Graphique circulaire (répartition)
      if (pieChartRef.current) {
        const ctx = pieChartRef.current.getContext('2d');
        if (ctx) {
          pieChartInstance.current?.destroy();
          pieChartInstance.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Course', 'Vélo', 'Natation', 'Musculation'],
              datasets: [{
                data: [35, 25, 20, 20],
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
                borderWidth: 0,
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '70%',
              plugins: {
                legend: { position: 'bottom' },
                tooltip: { backgroundColor: 'rgba(0,0,0,0.8)' }
              }
            }
          });
        }
      }
    };

    initCharts();
    return () => {
      chartInstance.current?.destroy();
      barChartInstance.current?.destroy();
      pieChartInstance.current?.destroy();
    };
  }, [timeRange]);

  // --- Logique ---
  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Rendu ---
  return (
    <div className="dashboard-container">
      {/* --- Barre de navigation --- */}
      <Navbar expand="lg" variant="dark" bg="dark" className="sticky-top shadow-sm">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            <i className="bi bi-speedometer2 me-2"></i>Sport Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" active>Tableau de bord</Nav.Link>
              <Nav.Link as={Link} to="/Activite">Activités</Nav.Link>
              <Nav.Link as={Link} to="/Rapport">Rapports</Nav.Link>
            </Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-light" className="d-flex align-items-center">
                <i className="bi bi-person-circle me-2"></i>Utilisateur
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Profil</Dropdown.Item>
                <Dropdown.Item as={Link} to="/Parametre">Paramètres</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/logout" className="text-danger">Déconnexion</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* --- Contenu principal --- */}
      <Container fluid className="py-4">
        <Row>
          {/* --- Cartes KPI --- */}
          <Col xl={3} md={6} className="mb-4">
            <KpiCard
              title="Distance totale"
              value={`${sportsData?.totalDistance || 0} km`}
              change="+12,4%"
              isPositive={true}
              icon="bi-activity"
              color="primary"
              tooltip="Distance parcourue ce mois"
            />
          </Col>
          <Col xl={3} md={6} className="mb-4">
            <KpiCard
              title="Calories brûlées"
              value={`${sportsData?.caloriesBurned || 0} kcal`}
              change="+8,2%"
              isPositive={true}
              icon="bi-fire"
              color="success"
              tooltip="Calories brûlées ce mois"
            />
          </Col>
          <Col xl={3} md={6} className="mb-4">
            <KpiCard
              title="Temps d'activité"
              value={`${sportsData?.activityTime || 0} h`}
              change="-1,2%"
              isPositive={false}
              icon="bi-clock"
              color="warning"
              tooltip="Temps total d'activité ce mois"
            />
          </Col>
          <Col xl={3} md={6} className="mb-4">
            <KpiCard
              title="Séances"
              value={sportsData?.sessions || 0}
              change="+3"
              isPositive={true}
              icon="bi-calendar-check"
              color="info"
              tooltip="Nombre de séances ce mois"
            />
          </Col>

          {/* --- Graphique principal --- */}
          <Col xs={12} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title className="m-0">Performance mensuelle</Card.Title>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    {timeRange === 'week' ? 'Semaine' : timeRange === 'month' ? 'Mois' : 'Année'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setTimeRange('week')}>Semaine</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange('month')}>Mois</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange('year')}>Année</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Header>
              <Card.Body className="p-3" style={{ height: '300px' }}>
                {isLoading ? (
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <Spinner animation="border" role="status" />
                  </div>
                ) : (
                  <canvas ref={chartRef} className="w-100 h-100"></canvas>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* --- Graphiques secondaires --- */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header>Activité hebdomadaire</Card.Header>
              <Card.Body className="p-3" style={{ height: '250px' }}>
                <canvas ref={barChartRef} className="w-100 h-100"></canvas>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header>Répartition des activités</Card.Header>
              <Card.Body className="p-3" style={{ height: '250px' }}>
                <canvas ref={pieChartRef} className="w-100 h-100"></canvas>
              </Card.Body>
            </Card>
          </Col>

          {/* --- Projets en cours --- */}
          <Col xs={12} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title className="m-0">Projets en cours</Card.Title>
                <Form.Control
                  type="text"
                  placeholder="Rechercher..."
                  className="w-auto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Card.Header>
              <Card.Body className="p-0">
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Projet</th>
                      <th>Équipe</th>
                      <th>Statut</th>
                      <th>Progression</th>
                      <th>Budget</th>
                      <th>Échéance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map(project => (
                      <tr key={project.id}>
                        <td className="fw-bold">{project.name}</td>
                        <td>
                          <div className="d-flex">
                            {project.team.map((member, idx) => (
                              <div key={idx} className="avatar-xs me-1">
                                <span className={`avatar-title rounded-circle bg-${['primary', 'success', 'warning', 'info'][idx % 4]}`}>
                                  {member.charAt(0)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <Badge bg={
                            project.status === 'Terminé' ? 'success' :
                            project.status === 'En cours' ? 'primary' :
                            project.status === 'En attente' ? 'warning' : 'danger'
                          }>
                            {project.status}
                          </Badge>
                        </td>
                        <td>
                          <ProgressBar
                            now={project.progress}
                            variant={
                              project.progress < 30 ? 'danger' :
                              project.progress < 70 ? 'warning' : 'success'
                            }
                            label={`${project.progress}%`}
                            className="my-2"
                            style={{ height: '6px' }}
                          />
                        </td>
                        <td>{project.budget?.toLocaleString()} €</td>
                        <td>{project.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* --- Activités récentes --- */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header>Activités récentes</Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush" className="border-0">
                  {recentActivities.map(activity => (
                    <ListGroup.Item key={activity.id} className="px-3 py-2 border-bottom">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">
                            <i className={`bi bi-${activity.type === 'Course' ? 'person-running' :
                                          activity.type === 'Vélo' ? 'bicycle' :
                                          activity.type === 'Natation' ? 'water' : 'dumbbell'} me-2`}></i>
                            {activity.name}
                          </div>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                        <Badge bg={
                          activity.status === 'Complétée' ? 'success' :
                          activity.status === 'En cours' ? 'primary' : 'secondary'
                        } className="rounded-pill">
                          {activity.status}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <Card.Footer className="text-center py-2">
                  <Button variant="link" size="sm">Voir toutes les activités</Button>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>

          {/* --- Performance des équipes --- */}
          <Col md={6} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header>Performance des équipes</Card.Header>
              <Card.Body className="p-0">
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Équipe</th>
                      <th>Projets</th>
                      <th>Tâches</th>
                      <th>Productivité</th>
                      <th>Délai moyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamPerformance.map((team, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold">{team.name}</td>
                        <td>{team.projects}</td>
                        <td>{team.tasksCompleted}</td>
                        <td>
                          <span className={team.productivity.includes('+') ? 'text-success' : 'text-danger'}>
                            {team.productivity}
                          </span>
                        </td>
                        <td>{team.avgDelay}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
