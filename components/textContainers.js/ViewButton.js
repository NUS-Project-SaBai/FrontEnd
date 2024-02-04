export function ViewButton({ text, onClick }) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 rounded-full"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
