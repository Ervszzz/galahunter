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
        <h1 className="font-heading text-4xl md:text-5xl font-700 text-gh-body mb-3 leading-tight">
          Hunt Your Next{' '}
          <span className="text-gh-light">Adventure</span>
        </h1>
        <p className="text-base text-gh-muted max-w-lg mx-auto">
          Find the best flight deals from the Philippines to the world.
        </p>

        {/* Popular route pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {POPULAR_ROUTES.map(({ from, to, label }) => (
            <button
              key={label}
              onClick={() => fillRoute(from, to)}
              className="pill"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <SearchForm form={form} updateForm={updateForm} onSearch={search} loading={loading} />

      {/* Error */}
      {error && (
        <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl px-5 py-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner />}

      {/* Results */}
      {!loading && results !== null && (
        <div>
          <h2 className="font-heading text-lg font-600 text-gh-body mb-4">
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
