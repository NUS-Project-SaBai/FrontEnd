import { DisplayField } from '@/components/TextComponents/DisplayField';

export function VitalsTable({ content }) {
  const isBloodPressureHigh = content.systolic > 140 || content.diastolic > 90;
  const isBloodPressureLow = content.systolic < 90 || content.diastolic < 60;
  const shouldHighlightBloodPressure =
    isBloodPressureHigh || isBloodPressureLow;

  const vitalFields = [
    {
      label: 'Blood Pressure (Systolic / Diastolic) / mmHg',
      value: `${content.systolic} / ${content.diastolic}`,
      highlight: shouldHighlightBloodPressure,
    },
    { label: 'Heart Rate', value: content.heart_rate },

    { label: 'Temperature', value: content.temperature },
    { label: '', value: '' },

    { label: 'Left Eye', value: content.left_eye_degree },
    { label: 'Right Eye', value: content.right_eye_degree },

    { label: 'Left Eye Pinhole', value: content.left_eye_pinhole },
    { label: 'Right Eye Pinhole', value: content.right_eye_pinhole },

    { label: 'Urine Dip Test', value: content.urine_test },
    { label: 'Hemocue Hb Count', value: content.hemocue_count },

    {
      label: 'Blood Glucose',
      value: content.blood_glucose,
      highlight: content.blood_glucose > 6.1,
    },
    { label: 'Diabetes Mellitus?', value: content.diabetes_mellitus },

    { label: 'Others', value: content.others },
  ];

  function renderTableField(field) {
    if (field.label === '') {
      return <div></div>;
    }

    return (
      <DisplayField
        key={field.label}
        label={field.label}
        content={field.value}
        highlight={field.highlight}
      />
    );
  }

  return (
    <form className="">
      <div>
        <label className="label">Past Vital Signs</label>
      </div>
      <div>
        <div className="grid gap-6 md:grid-cols-3">
          <DisplayField key="height" label="Height" content={content.height} />
          <DisplayField key="label" label="Weight" content={content.weight} />
          <DisplayField
            key="bmi"
            label="BMI"
            content={(
              parseFloat(content.weight) /
              parseFloat(content.height / 100) ** 2
            ).toFixed(2)}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {vitalFields.map(field => renderTableField(field))}
        </div>
      </div>
    </form>
  );
}
