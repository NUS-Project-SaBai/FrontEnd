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
      highlight: shouldHighlightBloodPressure && 'red',
    },
    { label: 'Heart Rate', value: vitals.heart_rate },
    { label: 'Temperature', value: vitals.temperature },
    { label: '', value: '' },
    { label: 'Right Eye', value: vitals.right_eye_degree },
    { label: 'Left Eye', value: vitals.left_eye_degree },
    { label: 'Right Eye Pinhole', value: vitals.right_eye_pinhole },
    { label: 'Left Eye Pinhole', value: vitals.left_eye_pinhole },
    { label: 'Urine Dip Test', value: vitals.urine_test },
    { label: 'Hemocue Hb Count', value: vitals.hemocue_count },
    {
      label: 'Non-Fasting Blood Glucose',
      value: vitals.blood_glucose_non_fasting,
      highlight:
        vitals.blood_glucose_non_fasting >= 11.1
          ? 'red'
          : vitals.blood_glucose_non_fasting >= 7.8
            ? 'yellow'
            : undefined,
    },
    {
      label: 'Fasting Blood Glucose',
      value: vitals.blood_glucose_fasting,
      highlight:
        vitals.blood_glucose_fasting >= 7.0
          ? 'red'
          : vitals.blood_glucose_fasting >= 6.0
            ? 'yellow'
            : undefined,
    },
    { label: 'Diabetes Mellitus?', value: vitals.diabetes_mellitus },
    { label: 'Others', value: vitals.others },
  ];

  const childrenVitalFields = [
    {
      label: 'Gross Motor',
      value: vitals.gross_motor,
      ageToTest: [2, 3, 4, 5, 6],
    },
    {
      label: 'Red Reflex',
      value: vitals.red_reflex,
      ageToTest: [2, 3, 4, 5, 6],
    },
    {
      label: 'Scoliosis',
      value: vitals.scoliosis,
      ageToTest: [13, 14, 15, 16],
    },
    {
      label: 'Pallor',
      value: vitals.pallor,
      ageToTest: [2, 3, 4, 5, 7, 8, 11, 12],
    },
    {
      label: 'Oral Cavity',
      value: vitals.oral_cavity,
      ageToTest: [2, 3, 4, 5, 7, 8, 11, 12],
    },
    {
      label: 'Heart',
      value: vitals.heart,
      ageToTest: [2, 3, 4, 5, 7, 8, 11, 12],
    },
    {
      label: 'Lungs',
      value: vitals.lungs,
      ageToTest: [2, 3, 4, 5, 7, 8, 11, 12],
    },
    {
      label: 'Abdomen',
      value: vitals.abdomen,
      ageToTest: [2, 3, 4, 5, 7, 8, 11, 12],
    },
    {
      label: 'Hernial Orifices',
      value: vitals.hernial_orifices,
      ageToTest: [2, 3, 4, 5, 7, 8],
    },
  ];
  const PubertyFields = [
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
      label: 'Thelarche',
      value: vitals.thelarche,
      ageToTest: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      label: 'Thelarche Age',
      value: vitals.thelarche_age,
      ageToTest: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      label: 'Menarche',
      value: vitals.menarche,
      ageToTest: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      label: 'Menarche Age',
      value: vitals.menarche_age,
      ageToTest: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      label: 'Voice Change',
      value: vitals.voice_change,
      ageToTest: [13, 14, 15, 16],
      gender: 'Male',
    },
    {
      label: 'Voice Change Age',
      value: vitals.voice_change_age,
      ageToTest: [13, 14, 15, 16],
      gender: 'Male',
    },
    {
      label: 'Testicular Growth >= 4ml',
      value: vitals.testicular_growth,
      ageToTest: [13, 14, 15, 16],
      gender: 'Male',
    },
    {
      label: 'Testicular Growth Age',
      value: vitals.testicular_growth_age,
      ageToTest: [13, 14, 15, 16],
      gender: 'Male',
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

        {patientAgeVisit <= 18 && patientAgeVisit >= 2 && (
          <div>
            <div className="grid gap-6 md:grid-cols-2">
              {childrenVitalFields
                .filter((field, _) => {
                  return field.ageToTest.includes(patientAgeVisit);
                })
                .map((field, index) => renderTableField(field, index))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {PubertyFields.filter((field, _) => {
                return (
                  field.ageToTest.includes(patientAgeVisit) &&
                  (field.gender ? field.gender === patient.gender : true)
                );
              }).map((field, index) => renderTableField(field, index))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
