import { DisplayField } from "@/components/TextComponents/DisplayField";

export function VitalsTable({ content }) {
  console.log("Content:", content);
  const vitalFields = [
    { label: "Height", value: content.height },
    { label: "Weight", value: content.weight },
    { label: "Systolic", value: content.systolic },
    { label: "Diastolic", value: content.diastolic },
    { label: "Temperature", value: content.temperature },
    { label: "Heart Rate", value: content.heart_rate },
    { label: "Left Eye", value: content.left_eye_degree },
    { label: "Right Eye", value: content.right_eye_degree },
    { label: "Left Eye Pinhole", value: content.left_eye_pinhole },
    { label: "Right Eye Pinhole", value: content.right_eye_pinhole },

    { label: "Urine Dip Test", value: content.urine_test },
    { label: "Hemocue Hb Count", value: content.hemocue_count },
    { label: "Blood Glucose", value: content.blood_glucose },
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
            />
          ))}
        </div>
      </div>
    </form>
  );
}
