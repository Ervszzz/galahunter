import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { savedFlights, alerts } = useApp();
  const activeAlerts = alerts.filter((a) => a.active).length;

  const links = [
    { to: '/', label: 'Search', end: true },
    { to: '/saved', label: 'Saved', count: savedFlights.length },
    { to: '/alerts', label: 'Alerts', count: activeAlerts },
  ];

  return (
    <nav style={{ backgroundColor: 'var(--gh-bg)', borderBottom: '1px solid var(--gh-border)' }}>
      <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-16">

        {/* Wordmark */}
        <Link to="/" className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold tracking-tight shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--gh-navy), var(--gh-accent))' }}
          >
            GH
          </span>
          <span className="font-heading text-lg font-semibold leading-none">
            <span style={{ color: 'var(--gh-body)' }}>Gala</span>
            <span style={{ color: 'var(--gh-light)' }}>Hunter</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {links.map(({ to, label, count, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 text-sm font-medium transition-colors duration-150
                 ${isActive ? 'text-white' : 'text-[#4a5568] hover:text-[#e2e8f0]'}`
              }
            >
              {label}
              {count > 0 && (
                <span
                  className="text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center leading-none"
                  style={{ backgroundColor: 'var(--gh-accent)' }}
                >
                  {count}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
