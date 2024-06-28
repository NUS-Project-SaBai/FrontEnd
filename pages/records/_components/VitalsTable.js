import { DisplayField } from "@/components/TextComponents/DisplayField";

export function VitalsTable({ content }) {
  const isBloodPressureHigh = content.systolic > 140 || content.diastolic > 90;
  const isBloodPressureLow = content.systolic < 90 || content.diastolic < 60;
  const shouldHighlightBloodPressure =
    isBloodPressureHigh || isBloodPressureLow;

  const vitalFields = [
    {
      label: "Systolic",
      value: content.systolic,
      highlight: shouldHighlightBloodPressure,
    },
    {
      label: "Diastolic",
      value: content.diastolic,
      highlight: shouldHighlightBloodPressure,
    },
    { label: "Temperature", value: content.temperature },
    { label: "Heart Rate", value: content.heart_rate },
    { label: "Left Eye", value: content.left_eye_degree },
    { label: "Right Eye", value: content.right_eye_degree },
    { label: "Left Eye Pinhole", value: content.left_eye_pinhole },
    { label: "Right Eye Pinhole", value: content.right_eye_pinhole },
    { label: "Urine Dip Test", value: content.urine_test },
    { label: "Hemocue Hb Count", value: content.hemocue_count },
    {
      label: "Blood Glucose",
      value: content.blood_glucose,
      highlight: content.blood_glucose > 6.1,
    },
    { label: "Diabetes Mellitus?", value: content.diabetes_mellitus },
    { label: "Others", value: content.others },
  ];

  return (
    <form className="">
      <div>
        <label className="label">Past Vital Signs</label>
      </div>
      <div>
        <div className="grid gap-6 md:grid-cols-3">
          <DisplayField label="Height" content={content.height} />
          <DisplayField label="Weight" content={content.weight} />
          <DisplayField
            label="BMI"
            content={(content.weight / content.height ** 2).toFixed(2)}
          />
        </div>
        <div className="my-4">
          <label className="label">
            Blood Pressure (Systolic / Diastolic) / mmHg
          </label>
          <div className="flex items-center gap-2">
            <DisplayField
              key="systolic"
              // label="Systolic"
              content={content.systolic}
              highlight={shouldHighlightBloodPressure}
            />
            <span className="mx-2 my-2 text-lg">/</span>
            <DisplayField
              key="diastolic"
              // label="Diastolic"
              content={content.diastolic}
              highlight={shouldHighlightBloodPressure}
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {vitalFields.slice(2).map((field) => (
            <DisplayField
              key={field.label}
              label={field.label}
              content={field.value}
              highlight={field.highlight}
            />
          ))}
        </div>
      </div>
    </form>
  );
}
