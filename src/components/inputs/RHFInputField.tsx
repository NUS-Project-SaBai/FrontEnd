'use client';
import { HTMLInputTypeAttribute } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

type RHFInputFieldProps = {
  name: string;
  label?: string;
  type: HTMLInputTypeAttribute | 'textarea';
  placeholder?: string;
  isRequired?: boolean;
  min?: string;
  max?: string;
  textAreaRows?: number;
};

export function RHFInputField({
  name,
  label,
  type,
  placeholder = '',
  isRequired = false,
  min,
  max,
  textAreaRows = 4,
  ...registerOptions
}: RHFInputFieldProps & RegisterOptions) {
  const { register, formState } = useFormContext();
  const curFormErrorState = formState?.errors[name];
  // let inputClassStyle = "min-w-14 max-w-16 rounded-r-none lg:max-w-28 xl:max-w-38";
  let inputClassStyle = 'w-full rounded-m';
  inputClassStyle +=
    curFormErrorState != undefined ? 'border-l-8 border-red-400' : '';
  return (
    <div className="flex-col justify-end">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </label>
      {type == 'textarea' ? (
        <textarea
          className={inputClassStyle}
          rows={textAreaRows}
          placeholder={placeholder}
          {...register(name, {
            required: { message: `Empty Field: ${label}`, value: isRequired },
            ...registerOptions,
          })}
          name={name}
          id={name}
        />
      ) : (
        <input
          className={inputClassStyle}
          {...register(name, {
            required: { message: `Empty Field: ${label}`, value: isRequired },
            validate: {
              // Check if file input exceeds max file size of 20 MB
              maxFileSize: value => {
                if (type === 'file' && value.length > 0) {
                  const file = value[0];
                  // 20 * 1024 * 1024 = 20,971,520 bytes
                  if (file.size > 20971520) {
                    return `File size exceeds 20 MB: ${file.name}`;
                  }
                }
                return true;
              },
            },
            ...registerOptions,
          })}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          min={min}
          max={max}
          onWheel={e => {
            // don't modify behaviour when the input is not focused
            if (e.target != document.activeElement) return;
            // Prevent scrolling when using the mouse wheel on the input field
            const target = e.target as HTMLInputElement;
            target.blur();
            setTimeout(() => {
              target.focus();
            }, 0);
          }}
        />
      )}
      <p className="text-sm font-medium text-red-500">
        {curFormErrorState == undefined || curFormErrorState.type == 'required'
          ? ''
          : curFormErrorState.message?.toString()}
      </p>
    </div>
  );
}
