'use client';

import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export type OptionData = { value: string | number; label: string } | string;

type RHFCustomSelectProps = {
  name: string;
  label: string;
  options: OptionData[];
  defaultValue?: string | number | null;
  isRequired?: boolean;
  unselectedValue?: string | number;
  className?: string;
  optionClassName?: string;
};

export function RHFCustomSelect({
  name,
  label,
  options,
  defaultValue,
  isRequired = false,
  unselectedValue,
  className = '',
  optionClassName = ''
}: RHFCustomSelectProps) {
  const {
    control,
    setValue,
    formState: { errors, isSubmitted }
  } = useFormContext();

  // keep in sync if defaultValue prop changes
  useEffect(() => {
    if (defaultValue !== undefined)
      setValue(name, defaultValue, { shouldValidate: true });
  }, [defaultValue, name, setValue]);

  const hasError = Boolean(errors[name] && isSubmitted);
  const errorMessage = (errors[name]?.message as string) || '';

  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        {label}
        {isRequired && <span className="text-red-500"> *</span>}
      </label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: isRequired ? `Select one option` : false,
        }}
        defaultValue={defaultValue}
        render={({ field }) => {
          return (
            <div className='flex flex-row flex-wrap gap-4'>
              {options.map(v => {
                function handleChange(v: string | number) {
                  if (field.value === v) field.onChange(isRequired ? null : unselectedValue)
                  else field.onChange(v)
                }
                const value = typeof v === "object" ? v.value : v
                const label = typeof v === "object" ? v.label : v
                return <Option
                  key={value}
                  value={value}
                  label={label}
                  className={optionClassName}
                  selected={field.value === value}
                  onChange={handleChange}
                />
              }
              )}
            </div>
          )
        }}
      />

      {hasError && <p className="mt-1 text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
}

function Option({
  value,
  label,
  className,
  selected,
  onChange
}: {
  value: string | number;
  label: string;
  className: string;
  selected: boolean;
  onChange: (v: string | number) => void
}) {
  const borderColour = selected ? "border-2 border-black" : "border-2 border-gray-300";
  return <button
    className={`flex flex-col items-center justify-center px-2 py-1 bg-gray-100 rounded-sm ${borderColour} ${className}`}
    onClick={(e) => {
      e.preventDefault();
      onChange(value)
    }}
  >
    <div>{label}</div>
  </button>
}