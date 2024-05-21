export function InputField({ name, label, type, value, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          onWheel={(e) => {
            e.target.blur();
          }}
          placeholder={name}
          name={name}
          type={type}
          onChange={onChange}
          value={value}
          id={name}
          required
          className="block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
