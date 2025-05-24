export function LoadingUI({
  className = 'flex items-center justify-center space-x-2 p-2',
  message = 'Loading...',
}) {
  return (
    <div className={className}>
      <div className="h-6 w-6 animate-spin rounded-full border-y-2 border-blue-500"></div>
      <span>{message}</span>
    </div>
  );
}
