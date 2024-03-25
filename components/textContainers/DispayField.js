export function DisplayField({ label, content }) {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="block w-full bg-gray-200 rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6 mt-1">
        {content}
      </div>
    </div>
  );
}
