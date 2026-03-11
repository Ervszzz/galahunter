import { useApp } from '../context/AppContext';

export function useAlerts() {
  const { alerts, addAlert, removeAlert, toggleAlert } = useApp();
  return { alerts, addAlert, removeAlert, toggleAlert };
}
