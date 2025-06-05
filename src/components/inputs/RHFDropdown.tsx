'use client';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export type OptionData = { value: string; label: string };

type RHFDropdownProps = {
  name: string;
  label: string;
  options: OptionData[];
  defaultValue?: string;
  isRequired?: boolean;
  className?: string;
};

export function RHFDropdown({
  name,
  label,
  options,
  defaultValue = '',
  isRequired = false,
  className = '',
}: RHFDropdownProps) {
  const { register, formState, setValue } = useFormContext();
  // Update the form value whenever defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setValue(name, defaultValue);
    }
  }, [defaultValue, name, setValue]);

  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </label>
      <select
        {...register(name, {
          required: {
            message: `Select Option for ${label}!`,
            value: isRequired,
          },
        })}
        name={name}
        defaultValue={defaultValue}
        className={
          'block w-full rounded-md border-2 p-1 text-sm ' +
          (formState?.errors[name] != undefined && formState?.isSubmitted
            ? 'border-l-8 border-red-400'
            : '')
        }
      >
        <option hidden value="">
          Please select an option
        </option>
        {options.map(({ label, value }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
