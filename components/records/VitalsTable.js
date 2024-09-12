import { DisplayField } from '@/components/TextComponents';

export function VitalsTable({ vitals, patient, visit }) {
  const isBloodPressureHigh = vitals.systolic > 140 || vitals.diastolic > 90;
  const isBloodPressureLow = vitals.systolic < 90 || vitals.diastolic < 60;
  const shouldHighlightBloodPressure =
    isBloodPressureHigh || isBloodPressureLow;

  const patientAgeVisit =
    new Date(visit.date).getFullYear() -
    new Date(patient.date_of_birth).getFullYear();

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

  const childrenFemaleVitalFields = [
    {
      label: 'Gross Motor',
      value: vitals.gross_motor,
      ageToTest: [4, 5, 6],
    },
    { label: 'Red Reflex', value: vitals.red_reflex, ageToTest: [4, 5, 6] },
    {
      label: 'Scoliosis',
      value: vitals.scoliosis,
      ageToTest: [13, 14, 15, 16],
    },
    {
      label: 'Thelarche',
      value: vitals.thelarche,
      ageToTest: [13, 14, 15, 16, 17, 18],
    },
    {
      label: 'Thelarche Age',
      value: vitals.thelarche_age,
      ageToTest: [13, 14, 15, 16, 17, 18],
    },
    {
      label: 'Pubarche',
      value: vitals.pubarche,
      ageToTest: [13, 14, 15, 16, 17, 18],
    },
    {
      label: 'Pubarche Age',
      value: vitals.pubarche_age,
      ageToTest: [13, 14, 15, 16, 17, 18],
    },
    {
      label: 'Menarche',
      value: vitals.menarche,
      ageToTest: [13, 14, 15, 16, 17, 18],
    },
    {
      label: 'Menarche Age',
      value: vitals.menarche_age,
      ageToTest: [13, 14, 15, 16, 17, 18],
    },
    { label: 'Pallor', value: vitals.pallor, ageToTest: [4, 5, 7, 8, 11, 12] },
    {
      label: 'Oral Cavity',
      value: vitals.oral_cavity,
      ageToTest: [4, 5, 7, 8, 11, 12],
    },
    { label: 'Heart', value: vitals.heart, ageToTest: [4, 5, 7, 8, 11, 12] },
    { label: 'Lungs', value: vitals.lungs, ageToTest: [4, 5, 7, 8, 11, 12] },
    {
      label: 'Abdomen',
      value: vitals.abdomen,
      ageToTest: [4, 5, 7, 8, 11, 12],
    },
    {
      label: 'Hernial Orifices',
      value: vitals.hernial_orifices,
      ageToTest: [4, 5, 7, 8],
    },
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

        {patient.gender === 'Female' &&
          patientAgeVisit <= 18 &&
          patientAgeVisit >= 4 && (
            <div>
              <div className="grid gap-6 md:grid-cols-2">
                {childrenFemaleVitalFields
                  .filter((field, _) =>
                    field.ageToTest.includes(patientAgeVisit)
                  )
                  .map((field, index) => renderTableField(field, index))}
              </div>
            </div>
          )}
      </div>
    </form>
  );
}
