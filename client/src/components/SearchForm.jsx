export default function SearchForm({ form, updateForm, onSearch, loading }) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <form
      className="card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      <div>
        <label className="label">
          From <span className="label-muted">(IATA code)</span>
        </label>
        <input
          className="input-field uppercase font-mono tracking-widest"
          placeholder="MNL"
          maxLength={3}
          value={form.originLocationCode}
          onChange={(e) => updateForm('originLocationCode', e.target.value.toUpperCase())}
          required
        />
      </div>

      <div>
        <label className="label">
          To <span className="label-muted">(IATA code)</span>
        </label>
        <input
          className="input-field uppercase font-mono tracking-widest"
          placeholder="SIN"
          maxLength={3}
          value={form.destinationLocationCode}
          onChange={(e) => updateForm('destinationLocationCode', e.target.value.toUpperCase())}
          required
        />
      </div>

      <div>
        <label className="label">Departure Date</label>
        <input
          type="date"
          className="input-field"
          min={today}
          value={form.departureDate}
          onChange={(e) => updateForm('departureDate', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label">
          Return Date <span className="label-muted">(optional)</span>
        </label>
        <input
          type="date"
          className="input-field"
          min={form.departureDate || today}
          value={form.returnDate}
          onChange={(e) => updateForm('returnDate', e.target.value)}
        />
      </div>

      <div>
        <label className="label">Cabin Class</label>
        <select
          className="input-field"
          value={form.travelClass}
          onChange={(e) => updateForm('travelClass', e.target.value)}
        >
          <option value="ECONOMY">Economy</option>
          <option value="PREMIUM_ECONOMY">Premium Economy</option>
          <option value="BUSINESS">Business</option>
          <option value="FIRST">First Class</option>
        </select>
      </div>

      <div>
        <label className="label">Passengers</label>
        <input
          type="number"
          className="input-field"
          min={1}
          max={9}
          value={form.adults}
          onChange={(e) => updateForm('adults', parseInt(e.target.value) || 1)}
        />
      </div>

      <div className="flex items-center gap-2.5 col-span-full">
        <input
          type="checkbox"
          id="nonStop"
          className="w-4 h-4 cursor-pointer rounded accent-gh-accent"
          checked={form.nonStop}
          onChange={(e) => updateForm('nonStop', e.target.checked)}
        />
        <label htmlFor="nonStop" className="text-sm font-medium text-gh-body cursor-pointer">
          Non-stop flights only
        </label>
      </div>

      <div className="col-span-full">
        <button type="submit" className="btn-primary w-full text-base" disabled={loading}>
          {loading ? '⏳ Searching...' : '✦ Search Flights'}
        </button>
      </div>
    </form>
  );
}
