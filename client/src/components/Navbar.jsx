import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { savedFlights, alerts } = useApp();
  const activeAlerts = alerts.filter((a) => a.active).length;

  return (
    <div style={{ borderBottom: '1px solid #0f1626', padding: '20px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Branding */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #1e3a8a, #3b5fc0)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(59,93,192,0.3)',
            flexShrink: 0,
          }}>
            <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
              <text x="0" y="16" fontSize="16" fontWeight="700" fill="white"
                fontFamily="Space Grotesk, sans-serif" letterSpacing="-1">GH</text>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', fontFamily: "'Space Grotesk', sans-serif", color: '#fff', lineHeight: 1.2 }}>
              Gala<span style={{ color: '#6389ff' }}>Hunter</span>
            </div>
            <div style={{ fontSize: 11, color: '#2d3748', fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Flight Deals from the Philippines
            </div>
          </div>
        </Link>

        {/* Nav links + badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {savedFlights.length > 0 && (
            <Link to="/saved" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#0e1422', border: '1px solid #1a2035',
                borderRadius: 999, padding: '6px 14px',
                fontSize: 13, color: '#6389ff', fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                ❤️ {savedFlights.length} saved
              </div>
            </Link>
          )}
          {activeAlerts > 0 && (
            <Link to="/alerts" style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#0e1422', border: '1px solid #1a2035',
                borderRadius: 999, padding: '6px 14px',
                fontSize: 13, color: '#93b4ff', fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                🔔 {activeAlerts} alert{activeAlerts > 1 ? 's' : ''}
              </div>
            </Link>
          )}
          <nav style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
            {[
              { to: '/', label: 'Search', end: true },
              { to: '/saved', label: 'Saved' },
              { to: '/alerts', label: 'Alerts' },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                style={({ isActive }) => ({
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "'Space Grotesk', sans-serif",
                  textDecoration: 'none',
                  color: isActive ? '#e2e8f0' : '#4a5568',
                  background: isActive ? '#0e1422' : 'transparent',
                  border: isActive ? '1px solid #1a2035' : '1px solid transparent',
                  transition: 'all 0.15s',
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
