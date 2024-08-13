const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      <div
        className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
