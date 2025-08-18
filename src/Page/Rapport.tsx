// Rapport.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Button, Form, Row, Col, Badge, Spinner, Alert, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportData {
  id: number;
  title: string;
  type: 'Performance' | 'Activité' | 'Budget';
  date: string;
  status: 'Généré' | 'En cours' | 'Erreur';
  size: string;
}

const Rapport: React.FC = () => {
  // États
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState<'all' | 'Performance' | 'Activité' | 'Budget'>('all');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Données statiques (à remplacer par un appel API)
  useEffect(() => {
    const mockReports: ReportData[] = [
      { id: 1, title: "Rapport mensuel - Août 2025", type: "Performance", date: "2025-08-18", status: "Généré", size: "1.2 Mo" },
      { id: 2, title: "Activités hebdomadaires", type: "Activité", date: "2025-08-17", status: "Généré", size: "850 Ko" },
      { id: 3, title: "Budget annuel", type: "Budget", date: "2025-08-15", status: "En cours", size: "-" },
    ];
    setReports(mockReports);
    setIsLoading(false);
  }, []);

  // Graphique
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current?.destroy();
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
            datasets: [
              {
                label: 'Performance',
                data: [65, 59, 80, 81, 56, 72, 85, 90],
                borderColor: '#4e73df',
                backgroundColor: 'rgba(78, 115, 223, 0.1)',
                tension: 0.3,
                fill: true,
              },
              {
                label: 'Budget',
                data: [28, 48, 40, 19, 86, 27, 90, 70],
                borderColor: '#1cc88a',
                backgroundColor: 'rgba(28, 200, 138, 0.1)',
                tension: 0.3,
                fill: true,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
              tooltip: { backgroundColor: 'rgba(0,0,0,0.8)' }
            },
            scales: {
              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
              x: { grid: { display: false } }
            }
          }
        });
      }
    }
  }, []);

  // Export PDF
  const handleExportPDF = () => {
    if (reportRef.current) {
      html2canvas(reportRef.current).then((canvas: { toDataURL: (arg0: string) => any; height: number; width: number; }) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('rapport-sportif.pdf');
      });
    }
  };

  // Rendu
  return (
    <div className="container-fluid py-4">
      <Row className="mb-4">
        <Col>
          <h2><i className="bi bi-file-earmark-text me-2"></i>Rapports</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="m-0">Aperçu des Performances</Card.Title>
              <Button size="sm" variant="outline-primary" onClick={handleExportPDF}>
                <i className="bi bi-file-pdf me-1"></i>Exporter en PDF
              </Button>
            </Card.Header>
            <Card.Body className="p-3" style={{ height: '350px' }}>
              <div ref={reportRef}>
                <canvas ref={chartRef} className="w-100 h-100"></canvas>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="m-0">Liste des Rapports</Card.Title>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  {reportType === 'all' ? 'Tous' : reportType}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setReportType('all')}>Tous</Dropdown.Item>
                  <Dropdown.Item onClick={() => setReportType('Performance')}>Performance</Dropdown.Item>
                  <Dropdown.Item onClick={() => setReportType('Activité')}>Activité</Dropdown.Item>
                  <Dropdown.Item onClick={() => setReportType('Budget')}>Budget</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <Spinner animation="border" role="status" />
                </div>
              ) : (
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Titre</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Taille</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports
                      .filter(report => reportType === 'all' || report.type === reportType)
                      .map(report => (
                        <tr key={report.id}>
                          <td className="fw-bold">{report.title}</td>
                          <td>
                            <Badge bg={
                              report.type === 'Performance' ? 'primary' :
                              report.type === 'Activité' ? 'success' : 'warning'
                            }>
                              {report.type}
                            </Badge>
                          </td>
                          <td>{new Date(report.date).toLocaleDateString()}</td>
                          <td>
                            <Badge bg={
                              report.status === 'Généré' ? 'success' :
                              report.status === 'En cours' ? 'primary' : 'danger'
                            }>
                              {report.status}
                            </Badge>
                          </td>
                          <td>{report.size}</td>
                          <td>
                            <Button size="sm" variant="outline-primary" className="me-2">
                              <i className="bi bi-eye"></i>
                            </Button>
                            <Button size="sm" variant="outline-danger">
                              <i className="bi bi-trash"></i>
                            </Button>
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

export default Rapport;
