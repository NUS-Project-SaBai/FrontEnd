import { HTMLInputTypeAttribute } from 'react';
import { useFormContext } from 'react-hook-form';

type RHFInputFieldProps = {
  name: string;
  label: string;
  type: HTMLInputTypeAttribute | 'textarea';
  placeholder?: string;
  isRequired?: boolean;
};

export function RHFInputField({
  name,
  label,
  type,
  placeholder = '',
  isRequired = false,
}: RHFInputFieldProps) {
  const { register, formState } = useFormContext();
  const curFormErrorState = formState?.errors[name];
  const inputClassStyle =
    curFormErrorState != undefined ? 'border-l-8 border-red-400' : '';
  return (
    <div className="flex flex-col justify-end">
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
