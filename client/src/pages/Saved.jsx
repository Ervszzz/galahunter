import { Link } from 'react-router-dom';
import { useSavedFlights } from '../hooks/useSavedFlights';
import FlightCard from '../components/FlightCard';

export default function Saved() {
  const { savedFlights } = useSavedFlights();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-700 text-gh-body">Saved Flights</h1>
        <p className="text-gh-muted text-sm mt-1">
          {savedFlights.length === 0
            ? 'No saved flights yet.'
            : `${savedFlights.length} saved deal${savedFlights.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {savedFlights.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-4xl mb-4">🗂️</p>
          <p className="text-base font-medium text-gh-body mb-2">No saved flights yet</p>
          <p className="text-sm text-gh-muted mb-6">
            Search for flights and tap &quot;Save Deal&quot; to bookmark them here.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Search Flights
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {savedFlights.map((offer) => (
            <div key={offer.id}>
              <p className="text-xs text-gh-muted mb-1.5">
                Saved{' '}
                {new Date(offer.savedAt).toLocaleDateString('en-PH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <FlightCard offer={offer} dictionaries={{}} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
