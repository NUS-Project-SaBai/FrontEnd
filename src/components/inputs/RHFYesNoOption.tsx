import { FieldValues, FormState, UseFormRegister } from 'react-hook-form';
import { OptionData, RHFDropdown } from './RHFDropdown';

type RHFYesNoOptionProps = {
  register: UseFormRegister<FieldValues>;
  name: string;
  label: string;
  yesOptionLabel?: string;
  yesOptionValue?: string;
  noOptionLabel?: string;
  noOptionValue?: string;
  defaultValue?: string;
  isRequired?: boolean;
  formState?: FormState<FieldValues>;
};
export function RHFYesNoOption({
  register,
  formState = undefined,
  name,
  label,
  yesOptionLabel = 'Yes',
  yesOptionValue = 'Yes',
  noOptionLabel = 'No',
  noOptionValue = 'No',
  defaultValue = '',
  isRequired = false,
}: RHFYesNoOptionProps) {
  const yesNoOptions: OptionData[] = [
    { label: yesOptionLabel, value: yesOptionValue },
    { label: noOptionLabel, value: noOptionValue },
  ];
  return (
    <RHFDropdown
      register={register}
      formState={formState}
      label={label}
      name={name}
      options={yesNoOptions}
      defaultValue={defaultValue}
      isRequired={isRequired}
    />
  );
}
