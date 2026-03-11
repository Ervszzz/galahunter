export default function LoadingSpinner({ message = 'Searching for the best deals...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 border-4 border-gh-border border-t-gh-accent rounded-full animate-spin" />
      <p className="text-gh-muted text-sm font-medium">{message}</p>
    </div>
  );
}
