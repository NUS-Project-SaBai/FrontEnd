export function InputField({
  name,
  label,
  type,
  value,
  onChange,
  unit,
  placeholder = '',
  allowNegativeNumbers = false,
  allowDecimals = false,
  showRequiredAsterisk = false,
}) {
  const isNumberField = type === 'number';

  function numberOnChangeInterceptor(e) {
    const data = e.nativeEvent.data;
    const count = (str, regex) => (str.match(regex) || []).length;
    // allow null for backspace, numbers, or negative sign at the start of the input
    if (
      data === null ||
      RegExp(/[0-9]/).test(data) ||
      (allowNegativeNumbers && data === '-' && e.target.value === '-') || // only allow entering a dash (minus sign) if it is the first character
      (allowDecimals && data === '.' && count(e.target.value, /\./g) === 1) // only allow entering a single period
    ) {
      onChange(e);
    }
  }

  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
        {showRequiredAsterisk && <span className="text-red-500"> *</span>}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-400">
        <input
          id={name}
          name={name}
          type={isNumberField ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={isNumberField ? numberOnChangeInterceptor : onChange}
          className="flex-1 block w-full rounded-md border-2 py-1.5 px-1.5 bg-white text-gray-900  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6"
        />
        {unit && (
          <span className="inline-flex items-center px-3 rounded-none rounded-r-md border-0 bg-gray-200 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
