import { useFlightSearch } from '../hooks/useFlightSearch';
import SearchForm from '../components/SearchForm';
import FlightCard from '../components/FlightCard';
import LoadingSpinner from '../components/LoadingSpinner';

const POPULAR_ROUTES = [
  { from: 'MNL', to: 'SIN', label: 'Manila → Singapore' },
  { from: 'MNL', to: 'NRT', label: 'Manila → Tokyo' },
  { from: 'MNL', to: 'HKG', label: 'Manila → Hong Kong' },
  { from: 'MNL', to: 'DXB', label: 'Manila → Dubai' },
];

export default function Home() {
  const { form, updateForm, results, dictionaries, loading, error, search } = useFlightSearch();

  function fillRoute(from, to) {
    updateForm('originLocationCode', from);
    updateForm('destinationLocationCode', to);
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-10">
        <h1 className="font-heading text-4xl md:text-5xl font-semibold mb-3 leading-tight"
            style={{ color: 'var(--gh-body)' }}>
          Hunt Your Next{' '}
          <span style={{ color: 'var(--gh-light)' }}>Adventure</span>
        </h1>
        <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--gh-muted)' }}>
          Find the best flight deals from the Philippines to the world.
        </p>

        {/* Popular route pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {POPULAR_ROUTES.map(({ from, to, label }) => (
            <button key={label} onClick={() => fillRoute(from, to)} className="pill">
              {label}
            </button>
          ))}
        </div>
      </div>

      <SearchForm form={form} updateForm={updateForm} onSearch={search} loading={loading} />

      {/* Error */}
      {error && (
        <div
          className="rounded-xl px-5 py-4 text-sm"
          style={{
            backgroundColor: 'rgba(127,29,29,0.3)',
            border: '1px solid rgba(185,28,28,0.5)',
            color: '#fca5a5',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner />}

      {/* Results */}
      {!loading && results !== null && (
        <div>
          <h2
            className="font-heading text-lg font-semibold mb-4"
            style={{ color: 'var(--gh-body)' }}
          >
            {results.length > 0
              ? `${results.length} flight${results.length !== 1 ? 's' : ''} found`
              : '😔 No flights found for this route and date. Try different dates!'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {results.map((offer) => (
              <FlightCard key={offer.id} offer={offer} dictionaries={dictionaries} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
