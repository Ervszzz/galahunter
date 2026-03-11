import AirportInput from './AirportInput';

const today = new Date().toISOString().split('T')[0];

export default function SearchForm({ form, updateForm, onSearch, loading }) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch(); }}
      style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}
    >
      <AirportInput
        placeholder="From — city or country"
        onSelect={(code) => updateForm('originLocationCode', code)}
        style={{ flex: 1, minWidth: 180 }}
      />
      <AirportInput
        placeholder="To — city or country"
        onSelect={(code) => updateForm('destinationLocationCode', code)}
        style={{ flex: 1, minWidth: 180 }}
      />
      <input
        type="date"
        className="gh-input"
        min={today}
        value={form.departureDate}
        onChange={(e) => updateForm('departureDate', e.target.value)}
        style={{ flex: 1, minWidth: 155 }}
      />
      <input
        type="date"
        className="gh-input"
        min={form.departureDate || today}
        value={form.returnDate}
        onChange={(e) => updateForm('returnDate', e.target.value)}
        style={{ flex: 1, minWidth: 155 }}
      />
      <select
        className="gh-input"
        value={form.travelClass}
        onChange={(e) => updateForm('travelClass', e.target.value)}
        style={{ flex: '0 0 auto', width: 160 }}
      >
        <option value="ECONOMY">Economy</option>
        <option value="PREMIUM_ECONOMY">Prem. Economy</option>
        <option value="BUSINESS">Business</option>
        <option value="FIRST">First Class</option>
      </select>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0e1422', border: '1px solid #1a2035', borderRadius: 10, padding: '11px 14px' }}>
        <span style={{ fontSize: 12, color: '#2d3748', fontWeight: 500, whiteSpace: 'nowrap' }}>Pax</span>
        <input
          type="number"
          className="gh-input"
          min={1} max={9}
          value={form.adults}
          onChange={(e) => updateForm('adults', parseInt(e.target.value) || 1)}
          style={{ background: 'transparent', border: 'none', padding: 0, width: 32, fontSize: 14, color: '#6389ff', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}
        />
      </div>
      <button
        type="submit"
        className="book-btn"
        disabled={loading}
        style={{ padding: '11px 24px', fontSize: 14, opacity: loading ? 0.6 : 1 }}
      >
        {loading ? '⏳ Searching...' : '✦ Search Flights'}
      </button>
    </form>
  );
}
