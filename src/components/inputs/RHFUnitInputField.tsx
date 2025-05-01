import { FieldValues, FormState, UseFormRegister } from 'react-hook-form';

type RHFUnitInputFieldProps = {
  register: UseFormRegister<FieldValues>;
  name: string;
  label: string;
  unit: string;
  type: 'integer' | 'number';
  placeholder?: string;
  formState?: FormState<FieldValues>;
};
export function RHFUnitInputField({
  register,
  formState = undefined,
  name,
  label,
  unit,
  type,
  placeholder,
}: RHFUnitInputFieldProps) {
  const curFormErrorState = formState?.errors[name];
  const typeValidation = {
    // number is any valid positive decimal number
    number: {
      regex: /^(\d*)(\.\d+)?$/,
      errMsg: `${label}: Ensure that it is a valid number`,
    },
    integer: {
      regex: /^(\d*)$/,
      errMsg: `${label}: Ensure that it is a valid integer`,
    },
  };
  return (
    <div className="flex flex-col justify-end p-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex">
        <div
          className={
            'flex rounded ' +
            (curFormErrorState != undefined ? 'ring ring-red-500' : '')
          }
        >
          <input
            className={
              'xl:max-w-38 min-w-14 max-w-16 rounded-r-none lg:max-w-28'
            }
            {...register(name, {
              pattern: {
                value: typeValidation[type].regex,
                message: typeValidation[type].errMsg,
              },
            })}
            id={name}
            name={name}
            type="text"
            placeholder={placeholder}
          />
          <div className="text-md rounded-r-md bg-gray-200 p-1.5 text-gray-900">
            {unit}
          </div>
        </div>
      </div>
      <p className="text-sm font-medium text-red-500">
        {curFormErrorState == undefined || curFormErrorState.type == 'required'
          ? ''
          : curFormErrorState.message?.toString()}
      </p>
    </div>
  );
}
