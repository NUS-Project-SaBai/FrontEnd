"use client";

import Select from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils"; // optional helper

export type OptionData = {
  value: string;
  label: string;
};

type RHFReactSelectProps = {
  name: string;
  label: string;
  options: OptionData[];
  isRequired?: boolean;
  className?: string;
  placeholder?: string;
};

export function RHFSearchableDropdown({
  name,
  label,
  options,
  isRequired = false,
  className = "",
  placeholder = "Search and select medication...",
}: RHFReactSelectProps) {
  const {
    control,
    formState: { errors, isSubmitted },
  } = useFormContext();

  const hasError = Boolean(errors[name] && isSubmitted);
  const errorMessage = (errors[name]?.message as string) || "";

  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium">
        {label}
        {isRequired && <span className="text-red-500"> *</span>}
      </label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: isRequired ? `Select option for ${label}!` : false,
        }}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            placeholder={placeholder}
            value={
              options.find((o) => o.value === field.value) ?? null
            }
            onChange={(selected) => {
              field.onChange(selected ? selected.value : "");
            }}
            classNamePrefix="rs"
            className={cn(hasError && "border-red-400")}
            // You can style later using classNamePrefix="rs"
          />
        )}
      />

      {hasError && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
