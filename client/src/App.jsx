import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Saved from './pages/Saved';
import Alerts from './pages/Alerts';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gh-bg">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </main>
      <footer className="border-t border-gh-border text-gh-muted text-center py-5 text-xs">
        GalaHunter &copy; {new Date().getFullYear()} — Fly smart, fly far ✈️
      </footer>
    </div>
  );
}
