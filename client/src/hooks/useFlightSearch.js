import { useState, useCallback, useEffect } from 'react';
import { searchFlights, getPopular } from '../services/flightService';

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
  const [results, setResults] = useState(null);
  const [dictionaries, setDictionaries] = useState(null);
  const [cachedAt, setCachedAt] = useState(null);
  const [isPopular, setIsPopular] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function updateForm(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const loadPopular = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPopular();
      setResults(data.data || []);
      setDictionaries(data.dictionaries || {});
      setCachedAt(data.cachedAt || Date.now());
      setIsPopular(true);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load popular deals on mount
  useEffect(() => {
    loadPopular();
  }, [loadPopular]);

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
      setCachedAt(data.cachedAt || Date.now());
      setIsPopular(false);
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
    setCachedAt(null);
    setIsPopular(false);
  }

  return { form, updateForm, results, dictionaries, cachedAt, isPopular, loading, error, search, clearResults };
}
