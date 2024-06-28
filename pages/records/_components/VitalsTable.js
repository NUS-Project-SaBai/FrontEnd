import { DisplayField } from "@/components/TextComponents/DisplayField";

export function VitalsTable({ content }) {
  const isBloodPressureHigh = content.systolic > 140 || content.diastolic > 90;
  const isBloodPressureLow = content.systolic < 90 || content.diastolic < 60;
  const shouldHighlightBloodPressure =
    isBloodPressureHigh || isBloodPressureLow;
  const vitalFields = [
    { label: "Height", value: content.height },
    { label: "Weight", value: content.weight },
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
    { label: "Others", value: content.others },
    { label: "Diabetes Mellitus?", value: content.diabetes_mellitus },
  ];
  return (
    <form>
      <div>
        <label className="label">Vital Signs</label>
      </div>
      <div>
        <div className="grid gap-6 md:grid-cols-2">
          {vitalFields.map((field) => (
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
