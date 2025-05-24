import { RHFBinaryOption } from '@/components/inputs/RHFBinaryOption';
import { OptionData, RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { GenderType } from '@/types/Gender';
import { getPatientAge, Patient } from '@/types/Patient';
import { Vital } from '@/types/Vital';
import { useMemo } from 'react';

export const ALL_CHILD_AGES = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
];
type InputFieldData =
  | {
      type: 'dropdown';
      name: keyof Omit<Vital, 'id' | 'visit'>;
      label: string;
      defaultValue?: string;
      options: OptionData[];
      age: number[];
      gender?: GenderType;
    }
  | {
      type: 'text' | 'yesNoOption' | 'number';
      name: keyof Omit<Vital, 'id' | 'visit'>;
      label: string;
      age: number[];
      gender?: GenderType;
    };
const allChildVitalsFields: InputFieldData[] = [
  {
    type: 'dropdown',
    name: 'gross_motor',
    label: 'Gross Motor: Stand on 1 foot for 3/10s',
    options: [
      { label: 'Cannot', value: 'Cannot' },
      { label: '3 Second', value: '3s' },
      { label: '10 Second', value: '10s' },
    ],
    age: ALL_CHILD_AGES,
  },
  {
    name: 'red_reflex',
    label: 'Red Reflex',
    type: 'text',
    age: ALL_CHILD_AGES,
  },
  {
    name: 'scoliosis',
    label: 'Spine',
    type: 'text',
    age: ALL_CHILD_AGES,
  },
  {
    name: 'pallor',
    label: 'Pallor',
    type: 'text',
    age: ALL_CHILD_AGES,
  },
  {
    name: 'oral_cavity',
    label: 'Oral Cavity',
    type: 'text',
    age: ALL_CHILD_AGES,
  },
  {
    name: 'heart',
    label: 'Heart',
    type: 'text',
    age: ALL_CHILD_AGES,
  },
  {
    name: 'abdomen',
    label: 'Abdomen',
    type: 'text',
    age: ALL_CHILD_AGES,
  },
  {
    name: 'lungs',
    label: 'Lungs',
    type: 'text',
    age: ALL_CHILD_AGES,
  },
  {
    name: 'hernial_orifices',
    label: 'Hernial Orifices',
    type: 'text',
    age: ALL_CHILD_AGES,
  },
];

const allPubertyFields: InputFieldData[] = [
  {
    type: 'yesNoOption',
    name: 'pubarche',
    label: 'Pubarche',
    age: [13, 14, 15, 16, 17, 18],
  },
  {
    type: 'number',
    name: 'pubarche_age',
    label: 'Pubarche Age',
    age: [13, 14, 15, 16, 17, 18],
  },
  {
    type: 'yesNoOption',
    name: 'thelarche',
    label: 'Thelarche',
    age: [13, 14, 15, 16, 17, 18],
    gender: 'Female',
  },
  {
    type: 'number',
    name: 'thelarche_age',
    label: 'Thelarche Age',
    age: [13, 14, 15, 16, 17, 18],
    gender: 'Female',
  },
  {
    type: 'yesNoOption',
    name: 'menarche',
    label: 'Menarche',
    age: [13, 14, 15, 16, 17, 18],
    gender: 'Female',
  },
  {
    type: 'text',
    name: 'menarche_age',
    label: 'Menarche Age',
    age: [13, 14, 15, 16, 17, 18],
    gender: 'Female',
  },
  {
    type: 'yesNoOption',
    name: 'voice_change',
    label: 'Voice Change',
    age: [13, 14, 15, 16],
    gender: 'Male',
  },
  {
    type: 'number',
    name: 'voice_change_age',
    label: 'Voice Change Age',
    age: [13, 14, 15, 16],
    gender: 'Male',
  },
  {
    type: 'yesNoOption',
    name: 'testicular_growth',
    label: 'Testicular Growth >= 4ml',
    age: [13, 14, 15, 16],
    gender: 'Male',
  },
  {
    type: 'number',
    name: 'testicular_growth_age',
    label: 'Testicular Growth Age',
    age: [13, 14, 15, 16],
    gender: 'Male',
  },
];
export function ChildVitalsFields({
  patient,
  curVital,
}: {
  patient: Patient;
  curVital: Vital;
}) {
  const patientYearsOld = getPatientAge(patient).year;

  const childVitalsFields = useMemo(
    () =>
      allChildVitalsFields
        .filter(
          field => field.gender == undefined || field.gender == patient.gender
        )
        .filter(field => field.age.includes(patientYearsOld)),
    [patient.gender, patientYearsOld]
  );

  const pubertyFields = useMemo(
    () =>
      allPubertyFields
        .filter(
          field => field.gender == undefined || field.gender == patient.gender
        )
        .filter(field => field.age.includes(patientYearsOld)),
    [patient.gender, patientYearsOld]
  );
  return (
    <div>
      {childVitalsFields.length == 0 || (
        <ChildVitalsSection
          childVitalsFields={childVitalsFields}
          curVital={curVital}
        />
      )}

      {pubertyFields.length == 0 || (
        <ChildPubertySection
          pubertyFields={pubertyFields}
          curVital={curVital}
        />
      )}
    </div>
  );
}

function ChildVitalsSection({
  childVitalsFields,
  curVital,
}: {
  childVitalsFields: InputFieldData[];
  curVital: Vital;
}) {
  return (
    <div>
      <h2>Child Vitals</h2>
      <div className="grids-col-1 grid gap-2 md:grid-cols-2">
        {childVitalsFields.map(field => (
          <VitalFieldRenderer
            key={field.name}
            field={field}
            curVital={curVital}
          />
        ))}
      </div>
    </div>
  );
}

function ChildPubertySection({
  pubertyFields,
  curVital,
}: {
  pubertyFields: InputFieldData[];
  curVital: Vital;
}) {
  return (
    <div>
      <h2>Puberty Fields</h2>
      <div className="grids-col-1 grid gap-2 md:grid-cols-2">
        {pubertyFields.map(field => (
          <VitalFieldRenderer
            key={field.name}
            field={field}
            curVital={curVital}
          />
        ))}
      </div>{' '}
    </div>
  );
}

function VitalFieldRenderer({
  field,
  curVital,
}: {
  field: InputFieldData;
  curVital: Vital;
}) {
  switch (field.type) {
    case 'dropdown':
      return (
        <RHFDropdown
          defaultValue={curVital[field.name]?.toString()}
          {...field}
        />
      );
    case 'text':
      return (
        <RHFInputField
          placeholder={curVital[field.name]?.toString()}
          {...field}
        />
      );
    case 'number':
      return (
        <RHFInputField
          placeholder={curVital[field.name]?.toString()}
          {...field}
        />
      );
    case 'yesNoOption':
      return (
        <RHFBinaryOption
          defaultValue={curVital[field.name]?.toString()}
          {...field}
        />
      );
  }
}
