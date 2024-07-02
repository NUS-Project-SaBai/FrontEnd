export function DisplayField({ label, content, highlight }) {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <div
        className={`block w-full rounded-md border-0 py-1.5 px-1.5 shadow-sm ring-1 ring-inset sm:text-sm sm:leading-6 mt-1 ${
          highlight
            ? 'bg-red-200 text-red-900 ring-red-300'
            : 'bg-gray-200 text-gray-900 ring-gray-300'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
