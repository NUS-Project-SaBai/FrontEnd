import { Button } from './Button';

export default function OptionButtons({
  name,
  label,
  value,
  onChange,
  options,
  isRequired = false,
}) {
  function handleClickOption(newValue) {
    if (value === newValue && !isRequired) {
      newValue = '';
    }
    onChange({ target: { value: newValue, type: 'dropdown', name } });
  }

  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
        {isRequired && <span className="text-red-500"> *</span>}
      </label>
      <div className="mt-1 flex gap-3">
        {options.map(option => (
          <Button
            text={option}
            key={option}
            colour={value === option ? 'green' : 'white'}
            textColour={value === option ? undefined : 'gray-400'}
            outlineColour={value === option ? undefined : 'gray-400'}
            onClick={() => handleClickOption(option)}
          />
        ))}
      </div>
    </div>
  );
}
