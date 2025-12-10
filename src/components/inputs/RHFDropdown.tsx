'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils'; // if you have a cn helper, else remove
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export type OptionData = { value: string; label: string };

type RHFDropdownProps = {
  name: string;
  label: string;
  options: OptionData[];
  defaultValue?: string;
  isRequired?: boolean;
  className?: string;
  omitDefaultPrompt?: boolean;
  placeholder?: string; // custom placeholder for the trigger
};

export function RHFDropdown({
  name,
  label,
  options,
  defaultValue = '',
  isRequired = false,
  className = '',
  omitDefaultPrompt = false,
  placeholder = 'Please select an option',
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
          required: isRequired ? `Select Option for ${label}!` : false,
        }}
        defaultValue={defaultValue ?? ''}
        render={({ field }) => (
          <Select
            value={field.value ?? ''}
            onValueChange={val => {
              field.onChange(val);
              // optional: validate immediately on change
              trigger(name);
            }}
          >
            <SelectTrigger
              id={name}
              className={cn(
                'w-full bg-white text-gray-900',
                hasError && 'border-2 border-red-400 pl-1'
              )}
            >
              <SelectValue
                placeholder={omitDefaultPrompt ? undefined : placeholder}
              />
            </SelectTrigger>

            <SelectContent className="border bg-white text-gray-900" position="popper">
              {options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {hasError && <p className="mt-1 text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
}
