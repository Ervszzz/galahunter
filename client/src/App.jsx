import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Saved from './pages/Saved';
import Alerts from './pages/Alerts';

export default function App() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#07090f', minHeight: '100vh', color: '#fff' }}>
      {/* Background ambient glows */}
      <div style={{
        position: 'fixed', top: -200, left: '30%', width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(30,58,138,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: -100, right: '10%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(59,93,192,0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 32px' }}>
          <Routes>
            <Route path="/"       element={<Home />} />
            <Route path="/saved"  element={<Saved />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </main>
        <footer style={{
          borderTop: '1px solid #0f1626',
          textAlign: 'center',
          padding: '20px',
          fontSize: 12,
          color: '#2d3748',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          GalaHunter &copy; {new Date().getFullYear()} — Fly smart, fly far ✈️
          <br />
          <span style={{ fontSize: 11, color: '#1e2a3a', marginTop: 4, display: 'inline-block' }}>
            GalaHunter earns a small commission when you book through our links — at no extra cost to you.
          </span>
        </footer>
      </div>
    </div>
  );
}
