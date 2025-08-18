import React, { useState, useEffect } from 'react';

interface RecommendationItem {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
}

const Recommendation: React.FC = () => {
  const [recommendationsData, setRecommendationsData] = useState<RecommendationItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        const response = await fetch(' https://flask-back-api-for-project.onrender.com/recommendations'); // <-- ici l'URL de ton API
        if (!response.ok) throw new Error('Erreur lors du chargement des recommandations');

        const data: RecommendationItem[] = await response.json();
        setRecommendationsData(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Une erreur est survenue');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 2, recommendationsData.length));
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Chargement des recommandations...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</p>;

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Recommandations Sportives</h1>
      <div style={listStyle}>
        {recommendationsData.slice(0, visibleCount).map((item) => (
          <div key={item.id} style={cardStyle} className="card">
            {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={imageStyle} />}
            <h2 style={cardTitleStyle}>{item.title}</h2>
            <p style={cardDescStyle}>{item.description}</p>
          </div>
        ))}
      </div>
      {visibleCount < recommendationsData.length && (
        <button
          onClick={handleShowMore}
          style={buttonStyle}
          className="show-more-btn"
          aria-label="Voir plus de recommandations"
        >
          Voir plus
        </button>
      )}

      <style>{`
        .card:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 25px rgba(40, 167, 69, 0.35);
        }

        .show-more-btn:hover {
          background-color: #218838;
          box-shadow: 0 6px 15px rgba(33, 136, 56, 0.5);
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        @media (max-width: 600px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

// ... tes styles inchangés
const containerStyle: React.CSSProperties = {
  maxWidth: '900px',
  margin: '50px auto',
  padding: '0 20px 60px',
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  backgroundColor: '#f9fdf9',
  borderRadius: '15px',
  boxShadow: '0 10px 40px rgba(40, 167, 69, 0.1)',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#218838',
  marginBottom: '40px',
  fontWeight: 700,
  fontSize: '2.2rem',
};

const listStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '30px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '25px',
  borderRadius: '15px',
  boxShadow: '0 6px 15px rgba(40, 167, 69, 0.2)',
  textAlign: 'center',
  cursor: 'default',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  userSelect: 'none',
};

const cardTitleStyle: React.CSSProperties = {
  color: '#1b5e20',
  fontSize: '1.4rem',
  marginBottom: '12px',
  fontWeight: 600,
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#555',
  lineHeight: 1.5,
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  borderRadius: '12px',
  marginBottom: '18px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
};

const buttonStyle: React.CSSProperties = {
  display: 'block',
  margin: '50px auto 0',
  padding: '14px 34px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '20px',
  cursor: 'pointer',
  fontSize: '1.1rem',
  fontWeight: 700,
  boxShadow: '0 8px 20px rgba(40, 167, 69, 0.3)',
  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
};

export default Recommendation;
