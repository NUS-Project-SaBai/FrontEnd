export function Button({ text, onClick, colour }) {
  return (
    <button
      className={`rounded-md bg-${colour}-800 px-2.5 py-1.5 text-s font-semibold text-white shadow-sm hover:bg-${colour}-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${colour}-600`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
/*
Comments are for tailwind to recognise the colours
bg-indigo-800
bg-indigo-500
bg-indigo-600

bg-sky-800
hover:bg-sky-500
focus-visible:outline-sky-600

bg-blue-800
hover:bg-blue-500
focus-visible:outline-blue-600
*/
