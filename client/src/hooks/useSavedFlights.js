import { useApp } from '../context/AppContext';

export function useSavedFlights() {
  const { savedFlights, saveFlight, removeFlight, isFlightSaved } = useApp();
  return { savedFlights, saveFlight, removeFlight, isFlightSaved };
}
