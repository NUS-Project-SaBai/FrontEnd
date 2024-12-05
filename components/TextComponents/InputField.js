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
    const value = e.target.value; // the result of the field after adding the character
    // 3 capturing group: 1.'-';2.'.';3.<INVALID CHAR>
    const regexResult = value.match(/^(-)?[0-9]?[1-9]*(\.)?[0-9]*(.)*$/);
    // write to input when valid
    if (
      regexResult[3] === undefined &&
      (allowDecimals || regexResult[2] === undefined) &&
      (allowNegativeNumbers || regexResult[1] === undefined)
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
