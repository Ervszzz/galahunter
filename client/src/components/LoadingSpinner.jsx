export default function LoadingSpinner({ message = 'Hunting for the best deals...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 52, marginBottom: 16, animation: 'float 1.5s infinite' }}>🛫</div>
      <p style={{ color: '#4a5568', fontSize: 15, fontFamily: "'DM Sans', sans-serif" }}>{message}</p>
    </div>
  );
}
