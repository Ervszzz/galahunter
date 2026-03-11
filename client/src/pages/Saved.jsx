import { Link } from 'react-router-dom';
import { useSavedFlights } from '../hooks/useSavedFlights';
import FlightCard from '../components/FlightCard';

export default function Saved() {
  const { savedFlights } = useSavedFlights();

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: '#e2e8f0', marginBottom: 6 }}>
          Saved Flights
        </h1>
        <p style={{ color: '#4a5568', fontSize: 14 }}>
          {savedFlights.length === 0
            ? 'No saved flights yet.'
            : `${savedFlights.length} saved deal${savedFlights.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {savedFlights.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16, animation: 'float 3s infinite' }}>🗂️</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
            No saved flights yet
          </p>
          <p style={{ fontSize: 13, color: '#4a5568', marginBottom: 24 }}>
            Search for flights and tap the 🤍 to bookmark them here.
          </p>
          <Link to="/">
            <button className="book-btn" style={{ padding: '10px 28px' }}>Search Flights →</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {savedFlights.map((offer, i) => (
            <div key={offer.id}>
              <p style={{ fontSize: 11, color: '#2d3748', marginBottom: 8 }}>
                Saved {new Date(offer.savedAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
              <FlightCard offer={offer} dictionaries={{}} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
