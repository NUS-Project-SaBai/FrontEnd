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
  vital: Pick<
    Vital,
    | 'right_eye_degree'
    | 'left_eye_degree'
    | 'right_eye_pinhole'
    | 'left_eye_pinhole'
  >;
}) {
  const visionFields: VisionFieldsDataType[] = [
    { label: 'Right Eye', value: vital.right_eye_degree },
    { label: 'Left Eye', value: vital.left_eye_degree },
    { label: '', value: '' },
    { label: 'Right Eye Pinhole', value: vital.right_eye_pinhole },
    { label: 'Left Eye Pinhole', value: vital.left_eye_pinhole },
    { label: '', value: '' },
    { label: 'Right Eye Astigmatism', value: vital.right_astigmatism },
    { label: 'Left Eye Astigmatism', value: vital.left_astigmatism },
    { label: '', value: '' },
    {
      label: 'Right Eye Prescribed Glasses Degree',
      value: vision.right_glasses_degree,
    },
    {
      label: 'Left Eye Prescribed Glasses Degree',
      value: vision.left_glasses_degree,
    },
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
      <div className="mt-4">
        <DisplayField
          key={vision.notes}
          label="General Notes"
          content={vision.notes?.toString() || '-'}
        />
      </div>
    </>
  );
}
