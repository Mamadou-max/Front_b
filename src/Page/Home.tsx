import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import YouTube from 'react-youtube';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';

// Types
type SportType =
  | 'Tous'
  | 'Football'
  | 'Basketball'
  | 'Tennis'
  | 'Volleyball'
  | 'Fitness'
  | 'Yoga'
  | 'Randonnée'
  | 'Escalade'
  | 'Natation'
  | 'Danse';

interface Park {
  id: number;
  name: string;
  description?: string;
  position: { lat: number; lng: number };
  sportType: Exclude<SportType, 'Tous'>;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Coordinates {
  lat: number;
  lng: number;
}

// Données
const sportsTypes: SportType[] = [
  'Tous', 'Football', 'Basketball', 'Tennis', 'Volleyball',
  'Fitness', 'Yoga', 'Randonnée', 'Escalade', 'Natation', 'Danse'
];

const sportColors: Record<string, string> = {
  Football: '#FF5733',
  Basketball: '#33FF57',
  Tennis: '#3357FF',
  Volleyball: '#F3FF33',
  Fitness: '#FF33F3',
  Yoga: '#33FFF3',
  Randonnée: '#8A2BE2',
  Escalade: '#FF8C00',
  Natation: '#00BFFF',
  Danse: '#FF1493',
};

const parks: Park[] = [
  {
    id: 1,
    name: 'Parc des Sports Central',
    description: 'Grand parc avec terrains multisports et pistes de course.',
    position: { lat: 48.8566, lng: 2.3522 },
    sportType: 'Football',
  },
  {
    id: 2,
    name: 'Parc du Lac',
    description: 'Parc avec espaces verts, terrain de volley et aire de fitness.',
    position: { lat: 48.8606, lng: 2.3376 },
    sportType: 'Volleyball',
  },
  {
    id: 3,
    name: 'Parc de la Fontaine',
    description: 'Parc calme avec parcours de santé et pistes cyclables.',
    position: { lat: 48.853, lng: 2.3499 },
    sportType: 'Yoga',
  },
  {
    id: 4,
    name: 'Stade Municipal',
    description: 'Stade avec terrain de football et piste d\'athlétisme.',
    position: { lat: 48.8584, lng: 2.3472 },
    sportType: 'Football',
  },
  {
    id: 5,
    name: 'Centre Aquatique',
    description: 'Piscine olympique et bassins de natation.',
    position: { lat: 48.8512, lng: 2.3556 },
    sportType: 'Natation',
  },
];

const Home: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<SportType>('Tous');
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Bonjour ! Comment puis-je vous aider à trouver des activités sportives aujourd'hui ?", isUser: false, timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Géolocalisation
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setGeoError("Impossible de récupérer la position : " + err.message);
      }
    );
  }, []);

  // Filtre des parcs
  const filteredParks = selectedSport === 'Tous'
    ? parks
    : parks.filter(park => park.sportType === selectedSport);

  // Chatbot
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    const newMessage: Message = {
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, { text: botResponse, isUser: false, timestamp: new Date() }]);
    }, 500);
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes('bonjour') || lowerCaseMessage.includes('salut'))
      return "Bonjour ! Comment puis-je vous aider à trouver une activité sportive ?";
    if (lowerCaseMessage.includes('activité') || lowerCaseMessage.includes('sport'))
      return "Nous avons de nombreuses activités sportives disponibles. Que recherchez-vous exactement ?";
    if (lowerCaseMessage.includes('randonnée') || lowerCaseMessage.includes('marche'))
      return "Il y a de superbes sentiers de randonnée dans le Parc de la Fontaine.";
    if (lowerCaseMessage.includes('course') || lowerCaseMessage.includes('jogging'))
      return "Le Parc des Sports Central est parfait pour la course à pied.";
    if (lowerCaseMessage.includes('basketball') || lowerCaseMessage.includes('basket'))
      return "Le Parc du Lac dispose de plusieurs terrains de basketball.";
    if (lowerCaseMessage.includes('tennis'))
      return "Il y a des courts de tennis disponibles au Parc des Sports Central.";
    if (lowerCaseMessage.includes('volley') || lowerCaseMessage.includes('volleyball'))
      return "Le Parc du Lac a une belle aire de volley-ball.";
    if (lowerCaseMessage.includes('fitness') || lowerCaseMessage.includes('musculation'))
      return "Le Parc de la Fontaine propose une aire de fitness en plein air.";
    if (lowerCaseMessage.includes('yoga'))
      return "Des sessions de yoga ont lieu au Parc du Lac tous les dimanches matin.";
    if (lowerCaseMessage.includes('natation') || lowerCaseMessage.includes('piscine'))
      return "Il y a une piscine couverte à proximité du Parc des Sports Central.";
    if (lowerCaseMessage.includes('football'))
      return "Le Parc des Sports Central a plusieurs terrains de football.";
    if (lowerCaseMessage.includes('escalade') || lowerCaseMessage.includes('grimpe'))
      return "Le Parc des Sports Central propose un mur d'escalade extérieur.";
    if (lowerCaseMessage.includes('danse'))
      return "Il y a des cours de danse organisés au Parc du Lac tous les samedis matin.";
    if (lowerCaseMessage.includes('merci') || lowerCaseMessage.includes('au revoir'))
      return "Avec plaisir ! N'hésitez pas à revenir si vous avez d'autres questions.";
    return "Je peux vous aider à trouver des activités sportives, des partenaires ou des lieux près de chez vous. Que recherchez-vous ?";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Styles
  const mapStyles = {
    height: '400px',
    width: '100%',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1,
      loop: 1,
      playlist: 'dQw4w9WgXcQ',
    },
  };

  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 50, fontSize: '1.2em' }}>
        <p>Préparation de la page d'accueil...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, textAlign: 'center', position: 'relative' }}>
      {/* Vidéo d'arrière-plan */}
      <div style={{ position: 'relative', height: '60vh', overflow: 'hidden', borderRadius: '10px', marginBottom: 20 }}>
        <YouTube videoId="dQw4w9WgXcQ" opts={opts} style={{ height: '100%', width: '100%' }} />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexDirection: 'column',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '3em', marginBottom: 20 }}>
            Bienvenue sur <span style={{ fontWeight: 'bold', color: '#28a745' }}>SportRadar</span>
          </h1>
          <p style={{ fontSize: '1.3em', maxWidth: 800, margin: '0 auto' }}>
            Votre plateforme ultime pour découvrir, organiser et participer à des événements sportifs près de chez vous.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 15, marginBottom: 50 }}>
        {isAuthenticated ? (
          <Link to="/dashboard">
            <Button variant="primary" size="large">
              Aller à mon tableau de bord
            </Button>
          </Link>
        ) : (
          <>
            <Link to="/inscription">
              <Button variant="primary" size="large">
                S'inscrire gratuitement
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="large">
                Se connecter
              </Button>
            </Link>
          </>
        )}
      </div>

      {/* Filtre des sports */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'center',
        marginBottom: 20
      }}>
        {sportsTypes.map((sport) => (
          <button
            key={sport}
            onClick={() => setSelectedSport(sport)}
            style={{
              padding: '8px 16px',
              background: selectedSport === sport ? '#28a745' : '#f0f0f0',
              color: selectedSport === sport ? 'white' : 'black',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            {sport}
          </button>
        ))}
      </div>

      {/* Carte */}
      <div style={{ maxWidth: 800, margin: 'auto', marginBottom: 40 }}>
        {geoError && <p style={{ color: 'red' }}>{geoError}</p>}
        {position ? (
          <LoadScript googleMapsApiKey="AIzaSyBuW_7s4Y54j35k1iDldWf1AF0FxH-_DtM">
            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={13}
              center={position}
            >
              <Marker
                position={position}
                icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
              />
              {filteredParks.map((park) => (
                <Marker
                  key={park.id}
                  position={park.position}
                  icon={{
                    url: `http://maps.google.com/mapfiles/ms/icons/${sportColors[park.sportType].substring(1)}-dot.png`,
                  }}
                  onClick={() => setSelectedPark(park)}
                />
              ))}
              {selectedPark && (
                <InfoWindow
                  position={selectedPark.position}
                  onCloseClick={() => setSelectedPark(null)}
                >
                  <div>
                    <h3>{selectedPark.name}</h3>
                    <p>{selectedPark.description}</p>
                    <p>Type: {selectedPark.sportType}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        ) : (
          <p>Chargement de la carte...</p>
        )}
      </div>

      {/* Features */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: 30,
        marginTop: 40
      }}>
        {[
          { icon: 'fa-calendar-alt', title: 'Découvrez des Événements', description: 'Trouvez des matchs de football, des sessions de yoga, des randonnées et bien plus encore.' },
          { icon: 'fa-users', title: 'Rejoignez la Communauté', description: 'Connectez-vous avec des sportifs locaux et élargissez votre réseau.' },
          { icon: 'fa-trophy', title: 'Organisez Vos Activités', description: 'Créez et gérez vos propres événements sportifs en toute simplicité.' }
        ].map((feature, index) => (
          <div key={index} style={{
            flex: '1 1 300px',
            background: '#ffffff',
            padding: 30,
            borderRadius: 10,
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease-in-out',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            <i className={`fas ${feature.icon}`} style={{
              fontSize: '3em',
              color: '#28a745',
              marginBottom: 20
            }} aria-hidden="true"></i>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Témoignage */}
      <div style={{
        marginTop: 80,
        background: '#f0fbf0',
        padding: '40px 20px',
        borderRadius: 10
      }}>
        <h2 style={{ color: '#28a745', marginBottom: 30 }}>Ce que nos utilisateurs en pensent</h2>
        <blockquote style={{
          fontSize: '1.1em',
          fontStyle: 'italic',
          color: '#666',
          maxWidth: 700,
          margin: '0 auto',
        }}>
          "SportRadar a transformé ma façon de faire du sport ! Je trouve toujours des partenaires et des activités passionnantes. Un outil indispensable pour tout sportif."
          <p style={{ fontWeight: 'bold', marginTop: 15, color: '#444' }}>
            — Jean-Luc, Passionné de Course à Pied
          </p>
        </blockquote>
      </div>

      {/* ChatBot */}
      <div style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 350,
        height: 450,
        borderRadius: 10,
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}>
        <div style={{
          padding: 15,
          backgroundColor: '#28a745',
          color: 'white',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          <span>SportRadar Assistant</span>
        </div>
        <div style={{
          flex: 1,
          padding: 15,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                maxWidth: '80%',
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
                wordWrap: 'break-word',
                alignSelf: message.isUser ? 'flex-end' : 'flex-start',
                backgroundColor: message.isUser ? '#28a745' : '#e9ecef',
                color: message.isUser ? 'white' : 'black',
              }}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div style={{
          display: 'flex',
          padding: 10,
          borderTop: '1px solid #ddd',
        }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Posez votre question..."
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 5,
              border: '1px solid #ddd',
              marginRight: 10,
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} style={{
            padding: 10,
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
