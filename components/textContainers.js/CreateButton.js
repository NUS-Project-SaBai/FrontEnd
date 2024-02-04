export function CreateButton({ text, onClick }) {
  return (
    <button
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
