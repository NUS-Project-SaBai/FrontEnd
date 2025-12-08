import { DisplayField } from '@/components/DisplayField';
import { ALL_CHILD_AGES } from '@/components/records/vital/ChildVitalsFields';
import { GenderType } from '@/types/Gender';
import { displayBMI, isVisualAcuityPoor, Vital } from '@/types/Vital';

type VitalFieldsDataType = {
  label: string;
  value: string | number;
  highlight?: 'bg-red-200' | 'bg-amber-200' | '';
  ageToTest?: number[];
  gender?: GenderType;
};

export function PastVitalTable({
  vital,
  gender,
  age,
}: {
  vital: Vital;
  gender: GenderType;
  age: {
    year: number;
    month: number;
    day: number;
  };
}) {
  const vitalFields: VitalFieldsDataType[] = [
    {
      label: 'Blood Pressure (Systolic / Diastolic) / mmHg',
      value: `${vital.systolic} / ${vital.diastolic}`,
      // high or low blood pressure
      highlight:
        vital.systolic == undefined || vital.diastolic == undefined
          ? undefined
          : vital.systolic > 140 ||
            vital.diastolic > 90 ||
            vital.systolic < 90 ||
            vital.diastolic < 60
            ? 'bg-red-200'
            : undefined,
    },
    { label: 'Heart Rate', value: vital.heart_rate || '' },
    { label: 'Temperature', value: vital.temperature },
    {
      label: 'Right Eye',
      value: vital.right_eye_degree,
      highlight: isVisualAcuityPoor(vital.right_eye_degree) ? 'bg-red-200' : '',
    },
    {
      label: 'Left Eye',
      value: vital.left_eye_degree,
      highlight: isVisualAcuityPoor(vital.left_eye_degree) ? 'bg-red-200' : '',
    },
    { label: 'Right Eye Pinhole', value: vital.right_eye_pinhole },
    { label: 'Left Eye Pinhole', value: vital.left_eye_pinhole },
    { label: 'Urine Dip Test', value: vital.urine_test },
    { label: 'Hemocue Hb Count', value: vital.hemocue_count },
    {
      label: 'Non-Fasting Blood Glucose',
      value: vital.blood_glucose_non_fasting || '',
      highlight:
        vital.blood_glucose_non_fasting == undefined
          ? ''
          : vital.blood_glucose_non_fasting >= 11.1
            ? 'bg-red-200'
            : vital.blood_glucose_non_fasting >= 7.8
              ? 'bg-amber-200'
              : '',
    },
    {
      label: 'Fasting Blood Glucose',
      value: vital.blood_glucose_fasting || '',
      highlight:
        vital.blood_glucose_fasting == undefined
          ? ''
          : vital.blood_glucose_fasting >= 7.0
            ? 'bg-red-200'
            : vital.blood_glucose_fasting >= 6.0
              ? 'bg-amber-200'
              : '',
    },
    { label: 'HbA1c', value: vital.hbA1c || '' },
    { label: 'Diabetes Mellitus?', value: vital.diabetes_mellitus }
  ];
  //Note: The UI display for scoliosis instances are labelled spine
  const childrenVitalFields: VitalFieldsDataType[] = [
    {
      label: 'Gross Motor',
      value: vital.gross_motor,
      ageToTest: ALL_CHILD_AGES,
    },
    {
      label: 'Red Reflex',
      value: vital.red_reflex,
      ageToTest: ALL_CHILD_AGES,
    },
    {
      label: 'Spine',
      value: vital.scoliosis,
      ageToTest: ALL_CHILD_AGES,
    },
    {
      label: 'Pallor',
      value: vital.pallor,
      ageToTest: ALL_CHILD_AGES,
    },
    {
      label: 'Oral Cavity',
      value: vital.oral_cavity,
      ageToTest: ALL_CHILD_AGES,
    },
    {
      label: 'Heart',
      value: vital.heart,
      ageToTest: ALL_CHILD_AGES,
    },
    {
      label: 'Lungs',
      value: vital.lungs,
      ageToTest: ALL_CHILD_AGES,
    },
    {
      label: 'Abdomen',
      value: vital.abdomen,
      ageToTest: ALL_CHILD_AGES,
    },
    {
      label: 'Hernial Orifices',
      value: vital.hernial_orifices,
      ageToTest: ALL_CHILD_AGES,
    },
  ];

  const pubertyFields: VitalFieldsDataType[] = [
    {
      label: 'Pubarche',
      value: vital.pubarche,
      ageToTest: [13, 14, 15, 16, 17, 18],
    },
    {
      label: 'Pubarche Age',
      value: vital.pubarche_age,
      ageToTest: [13, 14, 15, 16, 17, 18],
    },
    {
      label: 'Thelarche',
      value: vital.thelarche,
      ageToTest: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      label: 'Thelarche Age',
      value: vital.thelarche_age,
      ageToTest: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      label: 'Menarche',
      value: vital.menarche,
      ageToTest: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      label: 'Menarche Age',
      value: vital.menarche_age,
      ageToTest: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      label: 'Voice Change',
      value: vital.voice_change,
      ageToTest: [13, 14, 15, 16],
      gender: 'Male',
    },
    {
      label: 'Voice Change Age',
      value: vital.voice_change_age,
      ageToTest: [13, 14, 15, 16],
      gender: 'Male',
    },
    {
      label: 'Testicular Growth >= 4ml',
      value: vital.testicular_growth,
      ageToTest: [13, 14, 15, 16],
      gender: 'Male',
    },
    {
      label: 'Testicular Growth Age',
      value: vital.testicular_growth_age,
      ageToTest: [13, 14, 15, 16],
      gender: 'Male',
    },
  ];

  return (
    <div className="grid flex-1 gap-2 [grid-template-columns:repeat(auto-fit,minmax(175px,1fr))]">
      <DisplayField label="Height" content={vital.height || '-'} />
      <DisplayField label="Weight" content={vital.weight || '-'} />
      <DisplayField
        label="BMI"
        content={displayBMI(vital.height, vital.weight)}
      />

      {vitalFields.map((field, index) =>
        field.label == '' ? (
          <div key={index}></div>
        ) : (
          <DisplayField
            key={field.label}
            label={field.label}
            content={field.value?.toString() || '-'}
            highlight={field.highlight}
          />
        )
      )}
      <h2 className="col-span-full">Child Vital</h2>
      {childrenVitalFields.map((field, index) =>
        field.label == '' ? (
          <div key={index}></div>
        ) : (
          <DisplayField
            key={field.label}
            label={field.label}
            content={field.value?.toString() || '-'}
            highlight={field.highlight}
          />
        )
      )}
      <h2 className="col-span-full">Puberty Fields</h2>
      {pubertyFields
        .filter(
          fields =>
            !fields.ageToTest ||
            !fields.gender ||
            (fields.gender == gender && fields.ageToTest.includes(age.year))
        )
        .map((field, index) =>
          field.label == '' ? (
            <div key={index}></div>
          ) : (
            <DisplayField
              key={field.label}
              label={field.label}
              content={field.value?.toString() || '-'}
              highlight={field.highlight}
            />
          )
        )}
      <h2 className="col-span-full">Others</h2>
      <DisplayField
        key="Others"
        content={vital.others?.toString() || '-'}
        spanFull
      />
    </div>
  );
}
