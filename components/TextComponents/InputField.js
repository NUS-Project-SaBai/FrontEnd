import React from 'react';
import { useController } from 'react-hook-form';

export function InputField({
  name,
  label,
  type,
  value,
  onChange,
  unit,
  allowNegativeNumbers = false,
  control, // Added control prop from useForm
  rules = {}, // Add validation rules
  defaultValue = '', // Default value if not provided
}) {
  const isNumberField = type === 'number';

  // Get the controller methods for this field
  const {
    field: { field_onChange, onBlur, field_value, ref },
    fieldState: { error }, // Capture error from the field state
  } = useController({
    name,
    control,
    rules,
    defaultValue, // Default value for the field
  });

  function numberOnChangeInterceptor(e) {
    const data = e.nativeEvent.data;
    // allow null for backspace, numbers, or negative sign at the start of the input
    if (
      data === null ||
      RegExp(/[0-9]/).test(data) ||
      (allowNegativeNumbers && data === '-' && e.target.value === '-')
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
        {/* Required Asterisk */}
        {rules.required && <span className="text-red-500"> *</span>}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-400">
        <input
          id={name}
          name={name}
          type={isNumberField ? 'text' : type}
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
      {/* Display error message if validation fails */}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}
