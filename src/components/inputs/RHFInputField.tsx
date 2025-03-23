import { HTMLInputTypeAttribute } from 'react';
import { FieldValues, FormState, UseFormRegister } from 'react-hook-form';

type RHFInputFieldProps = {
  register: UseFormRegister<FieldValues>;
  name: string;
  label: string;
  type: HTMLInputTypeAttribute | 'textarea';
  placeholder?: string;
  isRequired?: boolean;
  formState?: FormState<FieldValues>;
};

export function RHFInputField({
  register,
  formState = undefined,
  name,
  label,
  type,
  placeholder = '',
  isRequired = false,
}: RHFInputFieldProps) {
  const curFormErrorState = formState?.errors[name];
  const inputClassStyle =
    curFormErrorState != undefined ? 'border-l-8 border-red-400' : '';
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </label>
      {type == 'textarea' ? (
        <textarea
          className={inputClassStyle}
          rows={4}
          {...register(name, {
            required: { message: `Empty Field: ${label}`, value: isRequired },
          })}
          name={name}
          id={name}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={inputClassStyle}
          {...register(name, {
            required: { message: `Empty Field: ${label}`, value: isRequired },
          })}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
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
