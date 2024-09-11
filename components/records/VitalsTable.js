import { DisplayField } from '@/components/TextComponents';

export function VitalsTable({ vitals }) {
  const isBloodPressureHigh = vitals.systolic > 140 || vitals.diastolic > 90;
  const isBloodPressureLow = vitals.systolic < 90 || vitals.diastolic < 60;
  const shouldHighlightBloodPressure =
    isBloodPressureHigh || isBloodPressureLow;

  const vitalFields = [
    {
      label: 'Blood Pressure (Systolic / Diastolic) / mmHg',
      value: `${vitals.systolic} / ${vitals.diastolic}`,
      highlight: shouldHighlightBloodPressure,
    },
    { label: 'Heart Rate', value: vitals.heart_rate },
    { label: 'Temperature', value: vitals.temperature },
    { label: '', value: '' },
    { label: 'Left Eye', value: vitals.left_eye_degree },
    { label: 'Right Eye', value: vitals.right_eye_degree },
    { label: 'Left Eye Pinhole', value: vitals.left_eye_pinhole },
    { label: 'Right Eye Pinhole', value: vitals.right_eye_pinhole },
    { label: 'Urine Dip Test', value: vitals.urine_test },
    { label: 'Hemocue Hb Count', value: vitals.hemocue_count },
    {
      label: 'Blood Glucose',
      value: vitals.blood_glucose,
      highlight: vitals.blood_glucose > 6.1,
    },
    { label: 'Diabetes Mellitus?', value: vitals.diabetes_mellitus },
    { label: 'Others', value: vitals.others },
  ];

  const childrenVitalFields = [
    { label: 'Gross Motor', value: vitals.gross_motor },
    { label: 'Red Reflex', value: vitals.red_reflex },
    { label: 'Scoliosis', value: vitals.scoliosis },
    { label: 'Thelarche', value: vitals.thelarche },
    { label: 'Thelarche Age', value: vitals.thelarche_age },
    { label: 'Pubarche', value: vitals.pubarche },
    { label: 'Pubarche Age', value: vitals.pubarche_age },
    { label: 'Menarche', value: vitals.menarche },
    { label: 'Menarche Age', value: vitals.menarche_age },
    { label: 'Pallor', value: vitals.pallor },
    { label: 'Oral Cavity', value: vitals.oral_cavity },
    { label: 'Heart', value: vitals.heart },
    { label: 'Lungs', value: vitals.lungs },
    { label: 'Hernial Orifices', value: vitals.hernial_orifices },
  ];

  function renderTableField(field, index) {
    if (field.label === '') {
      return <div key={index}></div>;
    }

    return (
      <DisplayField
        key={field.label + index} // Ensure each key is unique
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
          <DisplayField key="height" label="Height" content={vitals.height} />
          <DisplayField key="weight" label="Weight" content={vitals.weight} />
          <DisplayField
            key="bmi"
            label="BMI"
            content={(
              parseFloat(vitals.weight) /
              parseFloat(vitals.height / 100) ** 2
            ).toFixed(2)}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {vitalFields.map((field, index) => renderTableField(field, index))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {childrenVitalFields.map((field, index) =>
            renderTableField(field, index)
          )}
        </div>
      </div>
    </form>
  );
}
