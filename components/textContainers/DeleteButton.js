export function DeleteButton({ text, onClick }) {
  return (
    <button
      className="bg-red-500 hover:bg-red-600 text-white 
      font-bold py-2 px-4 rounded-full"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
