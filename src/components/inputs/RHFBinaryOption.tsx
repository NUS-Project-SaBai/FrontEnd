import { OptionData } from '@/components/inputs/RHFDropdown';
import { RHFCustomSelect } from './RHFCustomSelect';

type RHFBinaryOptionProps = {
  name: string;
  label: string;
  optionLabel1?: string;
  optionValue1?: string;
  optionLabel2?: string;
  optionValue2?: string;
  defaultValue?: string;
  isRequired?: boolean;
  className?: string;
};
export function RHFBinaryOption({
  name,
  label,
  optionLabel1 = 'Yes',
  optionValue1 = 'Yes',
  optionLabel2 = 'No',
  optionValue2 = 'No',
  defaultValue,
  isRequired = true,
  className,
}: RHFBinaryOptionProps) {
  const yesNoOptions: OptionData[] = [
    { label: optionLabel1, value: optionValue1 },
    { label: optionLabel2, value: optionValue2 },
  ];
  return (
    <RHFCustomSelect
      label={label}
      name={name}
      options={yesNoOptions}
      defaultValue={defaultValue}
      isRequired={isRequired}
      className={className}
    />
  );
}
