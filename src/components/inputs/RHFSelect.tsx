'use client';

import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export type OptionData = { value: string | number; label: string } | string;

type RHFDropdownProps = {
  name: string;
  label: string;
  options: OptionData[];
  selectableNumber: number,
  defaultValue?: string[] | null;
  isRequired?: boolean;
  className?: string;
  optionClassName?: string;
};

export function RHFSelect({
  name,
  label,
  options,
  selectableNumber = 1,
  defaultValue,
  isRequired = false,
  className = '',
  optionClassName = ''
}: RHFDropdownProps) {
  const {
    control,
    setValue,
    formState: { errors, isSubmitted },
    trigger,
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
          required: isRequired ? `Select option for ${label}!` : false,
        }}
        defaultValue={defaultValue}
        render={({ field }) => (
          <div className='flex flex-row flex-wrap gap-4'>
            {options.map(v => {
              function handleChange(v: string | number) {
                console.log(v)
                const values = field.value as (string | number)[]
                // if (values.includes(v)) {
                //   field.onChange(values.filter(v => v != v))
                // } else if (selectableNumber === 1) {
                //   field.onChange([v])
                //   field.
                // } else if (selectableNumber === values.length) {
                //   // some feedback that you can't select more
                // }
                field.onChange([v])
                console.log("field", field)
              }
              const value = typeof v === "object" ? v.value : v
              const label = typeof v === "object" ? v.label : v
              return <Option
                key={value}
                value={value}
                label={label}
                className={optionClassName}
                selected={field.value.includes(value)}
                onChange={handleChange}
              />
            }
            )}
          </div>
        )}
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
    className={`flex flex-col items-center justify-center p-2 bg-gray-100 rounded-sm ${borderColour} ${className}`}
    // className={`flex flex-col items-center justify-center p-2 bg-gray-100 rounded-sm `}
    onClick={(e) => {
      e.preventDefault();
      onChange(value)
    }}
  >
    <div>{label}</div>
  </button>
  // return <div>{label}</div>
}