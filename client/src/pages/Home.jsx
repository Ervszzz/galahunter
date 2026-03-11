import { useState, useMemo } from 'react';
import { useFlightSearch } from '../hooks/useFlightSearch';
import SearchForm from '../components/SearchForm';
import FlightCard from '../components/FlightCard';
import LoadingSpinner from '../components/LoadingSpinner';

const STOP_TAGS = ['All', 'Non-stop ✈', '1 Stop 🔄', '2+ Stops 🛑'];

const POPULAR_ROUTES = [
  { from: 'MNL', to: 'SIN' },
  { from: 'MNL', to: 'NRT' },
  { from: 'MNL', to: 'HKG' },
  { from: 'MNL', to: 'DXB' },
  { from: 'MNL', to: 'ICN' },
  { from: 'CEB', to: 'HKG' },
];

export default function Home() {
  const { form, updateForm, results, dictionaries, cachedAt, loading, error, search } = useFlightSearch();
  const [activeTag, setActiveTag] = useState('All');
  const [sortBy, setSortBy]       = useState('price');

  function fillRoute(from, to) {
    updateForm('originLocationCode', from);
    updateForm('destinationLocationCode', to);
  }

  const filtered = useMemo(() => {
    if (!results) return null;
    return results
      .filter((offer) => {
        if (activeTag === 'All') return true;
        const stops = (offer.itineraries?.[0]?.segments?.length ?? 1) - 1;
        if (activeTag === 'Non-stop ✈')  return stops === 0;
        if (activeTag === '1 Stop 🔄')   return stops === 1;
        if (activeTag === '2+ Stops 🛑') return stops >= 2;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return parseFloat(a.price?.total) - parseFloat(b.price?.total);
        const durA = a.itineraries?.[0]?.duration ?? '';
        const durB = b.itineraries?.[0]?.duration ?? '';
        return durA.localeCompare(durB);
      });
  }, [results, activeTag, sortBy]);

  const minutesAgo = cachedAt ? Math.floor((Date.now() - cachedAt) / 60000) : 0;

  return (
    <div>
      {/* Header search section */}
      <div style={{ borderBottom: '1px solid #0f1626', paddingBottom: 20, marginBottom: 28 }}>

        {/* Popular route pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {POPULAR_ROUTES.map(({ from, to }) => (
            <button
              key={`${from}-${to}`}
              onClick={() => fillRoute(from, to)}
              className="tag-btn"
              style={{ fontSize: 12 }}
            >
              {from} → {to}
            </button>
          ))}
        </div>

        {/* Search form row */}
        <SearchForm form={form} updateForm={updateForm} onSearch={search} loading={loading} />

        {/* Tag filters + sort (only shown after search) */}
        {filtered !== null && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
              {STOP_TAGS.map((t) => (
                <button
                  key={t}
                  className={`tag-btn ${activeTag === t ? 'active' : ''}`}
                  onClick={() => setActiveTag(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <select
              className="gh-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: 165, flexShrink: 0 }}
            >
              <option value="price">Lowest Price</option>
              <option value="duration">Shortest Flight</option>
            </select>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(127,29,29,0.3)', border: '1px solid rgba(185,28,28,0.5)', color: '#fca5a5', borderRadius: 12, padding: '14px 18px', fontSize: 14, marginBottom: 24 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner />}

      {/* Results */}
      {!loading && filtered !== null && (
        <>
          {/* Stats row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
            <p style={{ color: '#2d3748', fontSize: 14 }}>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{filtered.length}</span> deal{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#2d3748' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b5fc0', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
              {minutesAgo === 0 ? 'Just updated' : `Updated ${minutesAgo}m ago`}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#2d3748' }}>
              <div style={{ fontSize: 52, marginBottom: 16, animation: 'float 3s infinite' }}>🛫</div>
              <p style={{ fontSize: 16 }}>No flights match your filters. Try adjusting them.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
              {filtered.map((offer, i) => (
                <FlightCard key={offer.id} offer={offer} dictionaries={dictionaries} index={i} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty state before first search */}
      {!loading && filtered === null && !error && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#2d3748' }}>
          <div style={{ fontSize: 52, marginBottom: 16, animation: 'float 3s infinite' }}>✈️</div>
          <p style={{ fontSize: 16 }}>Enter a route above and search for deals.</p>
        </div>
      )}
    </div>
  );
}
