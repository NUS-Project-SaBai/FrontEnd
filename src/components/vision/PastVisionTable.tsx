import { DisplayField } from '@/components/DisplayField';
import { GenderType } from '@/types/Gender';
import { Vision } from '@/types/Vision';
import { Vital } from '@/types/Vital';

type VisionFieldsDataType = {
  label: string;
  value: string | undefined;
  highlight?: 'bg-red-200' | 'bg-amber-200' | '';
  ageToTest?: number[];
  gender?: GenderType;
};

export function PastVisionTable({
  vision,
  vital,
}: {
  vision: Vision;
  vital: Vital;
}) {
  const visionFields: VisionFieldsDataType[] = [
    { label: 'Right Eye', value: vital.right_eye_degree },
    { label: 'Left Eye', value: vital.left_eye_degree },
    { label: '', value: '' },
    { label: 'Right Eye Pinhole', value: vital.right_eye_pinhole },
    { label: 'Left Eye Pinhole', value: vital.left_eye_pinhole },
    { label: '', value: '' },
    {
      label: 'Right Eye Prescribed Glasses Degree',
      value: vision.right_glasses_degree,
    },
    {
      label: 'Left Eye Prescribed Glasses Degree',
      value: vision.left_glasses_degree,
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
