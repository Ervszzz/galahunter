import { useState, useRef, useEffect } from 'react';
import { searchAirports } from '../services/flightService';

export default function AirportInput({ placeholder, onSelect, style = {} }) {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const timer = useRef(null);
  const wrapRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleChange(e) {
    const val = e.target.value;
    setText(val);
    setActiveIdx(-1);
    clearTimeout(timer.current);
    if (val.length < 2) { setSuggestions([]); setOpen(false); return; }
    timer.current = setTimeout(async () => {
      try {
        const results = await searchAirports(val);
        setSuggestions(results.slice(0, 7));
        setOpen(results.length > 0);
      } catch { /* silently ignore autocomplete errors */ }
    }, 280);
  }

  function handleSelect(item) {
    setText(`${item.name}${item.country_name ? `, ${item.country_name}` : ''}`);
    onSelect(item.code);
    setSuggestions([]);
    setOpen(false);
  }

  function handleKeyDown(e) {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); handleSelect(suggestions[activeIdx]); }
    if (e.key === 'Escape') setOpen(false);
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', ...style }}>
      <input
        className="gh-input"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: '#0e1422', border: '1px solid #1a2035', borderRadius: 12,
          zIndex: 50, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {suggestions.map((item, i) => (
            <div
              key={item.id}
              onMouseDown={() => handleSelect(item)}
              style={{
                padding: '10px 14px', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                borderBottom: '1px solid #0f1626',
                background: i === activeIdx ? '#1a2035' : 'transparent',
                transition: 'background 0.1s',
              }}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <div>
                <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 500 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: '#4a5568', marginTop: 1 }}>{item.country_name}</div>
              </div>
              <span style={{ fontSize: 12, color: '#6389ff', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", marginLeft: 10, flexShrink: 0 }}>
                {item.code}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
