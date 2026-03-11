export default function LoadingSpinner({ message = 'Searching for the best deals...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        className="w-12 h-12 border-4 rounded-full animate-spin"
        style={{
          borderColor: 'var(--gh-border)',
          borderTopColor: 'var(--gh-accent)',
        }}
      />
      <p className="text-sm font-medium" style={{ color: 'var(--gh-muted)' }}>
        {message}
      </p>
    </div>
  );
}
