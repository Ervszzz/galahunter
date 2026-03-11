import { useState, useCallback } from 'react';
import { searchFlights } from '../services/flightService';

const INITIAL_FORM = {
  originLocationCode: '',
  destinationLocationCode: '',
  departureDate: '',
  returnDate: '',
  adults: 1,
  travelClass: 'ECONOMY',
  nonStop: false,
  currencyCode: 'PHP',
  max: 20,
};

export function useFlightSearch() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [results, setResults] = useState(null);       // null = no search yet
  const [dictionaries, setDictionaries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const search = useCallback(async () => {
    if (!form.originLocationCode || !form.destinationLocationCode || !form.departureDate) {
      setError('Please fill in origin, destination, and departure date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = { ...form };
      if (!payload.returnDate) delete payload.returnDate;

      const data = await searchFlights(payload);
      setResults(data.data || []);
      setDictionaries(data.dictionaries || {});
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [form]);

  function clearResults() {
    setResults(null);
    setError(null);
  }

  return { form, updateForm, results, dictionaries, loading, error, search, clearResults };
}
