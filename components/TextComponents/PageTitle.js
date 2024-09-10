export function PageTitle({ title, desc }) {
  return (
    <header className="w-full my-4">
      <h1 className="text-3xl font-bold text-center text-gray-800">{title}</h1>
      {desc && <p className="text-center text-gray-600 mt-2">{desc}</p>}
    </header>
  );
}
