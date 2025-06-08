import { DisplayField } from '@/components/DisplayField';
import { GenderType } from '@/types/Gender';
import { Vision } from '@/types/Vision';

type VisionFieldsDataType = {
  label: string;
  value: string | undefined;
  highlight?: 'bg-red-200' | 'bg-amber-200' | '';
  ageToTest?: number[];
  gender?: GenderType;
};

export function PastVisionTable({ vision }: { vision: Vision }) {
  const visionFields: VisionFieldsDataType[] = [
    { label: 'Right Eye', value: vision.right_eye_degree },
    { label: 'Left Eye', value: vision.left_eye_degree },
    { label: '', value: '' },
    { label: 'Right Eye Pinhole', value: vision.right_eye_pinhole },
    { label: 'Left Eye Pinhole', value: vision.left_eye_pinhole },
    { label: '', value: '' },
    {
      label: 'Right Eye Prescribed Glasses Degree',
      value: vision.right_eye_glasses_degree,
    },
    {
      label: 'Left Eye Prescribed Glasses Degree',
      value: vision.left_eye_glasses_degree,
    },
    { label: '', value: '' },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {visionFields.map((field, index) =>
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
      </div>
    </>
  );
}
