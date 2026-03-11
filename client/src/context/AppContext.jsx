import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

function loadFromStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [savedFlights, setSavedFlights] = useState(() =>
    loadFromStorage('galahunter_saved', [])
  );
  const [alerts, setAlerts] = useState(() =>
    loadFromStorage('galahunter_alerts', [])
  );

  useEffect(() => {
    localStorage.setItem('galahunter_saved', JSON.stringify(savedFlights));
  }, [savedFlights]);

  useEffect(() => {
    localStorage.setItem('galahunter_alerts', JSON.stringify(alerts));
  }, [alerts]);

  function saveFlight(flight) {
    setSavedFlights((prev) => {
      if (prev.some((f) => f.id === flight.id)) return prev;
      return [...prev, { ...flight, savedAt: new Date().toISOString() }];
    });
  }

  function removeFlight(flightId) {
    setSavedFlights((prev) => prev.filter((f) => f.id !== flightId));
  }

  function isFlightSaved(flightId) {
    return savedFlights.some((f) => f.id === flightId);
  }

  function addAlert(alert) {
    const newAlert = {
      id: Date.now().toString(),
      ...alert,
      createdAt: new Date().toISOString(),
      active: true,
    };
    setAlerts((prev) => [...prev, newAlert]);
    return newAlert;
  }

  function removeAlert(alertId) {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }

  function toggleAlert(alertId) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, active: !a.active } : a))
    );
  }

  return (
    <AppContext.Provider
      value={{
        savedFlights,
        saveFlight,
        removeFlight,
        isFlightSaved,
        alerts,
        addAlert,
        removeAlert,
        toggleAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
