import { InputField } from "@/components/TextComponents";

export function VitalsForm({ handleOnChange, formDetails, patient }) {
  const vitalFields = [
    {
      name: "height",
      label: "Height (Decimal eg. 160.5)",
      value: formDetails.height,
      type: "number",
    },
    {
      name: "weight",
      label: "Weight (Decimal eg. 60.2)",
      value: formDetails.weight,
      type: "number",
    },
    {
      name: "temperature",
      label: "Temperature (Decimal eg. 36.5)",
      value: formDetails.temperature,
      type: "number",
    },
    {
      name: "heart_rate",
      label: "Heart Rate (Number eg. 120)",
      value: formDetails.heart_rate,
      type: "number",
    },
    {
      name: "right_eye_degree",
      label: "Right Eye (Fraction eg. 6/6)",
      value: formDetails.right_eye_degree,
      type: "text",
    },
    {
      name: "left_eye_degree",
      label: "Left Eye (Fraction eg. 6/12)",
      value: formDetails.left_eye_degree,
      type: "text",
    },
    {
      name: "right_eye_pinhole",
      label: "Right Eye Pinhole (Fraction eg. 6/6)",
      value: formDetails.right_eye_pinhole,
      type: "text",
    },
    {
      name: "left_eye_pinhole",
      label: "Left Eye Pinhole (Fraction eg. 6/12)",
      value: formDetails.left_eye_pinhole,
      type: "text",
    },
    // Add more fields as needed
  ];

  const statFields = [
    {
      name: "urine_test",
      label: "Urine Dip Test (Text eg. Anyth)",
      value: formDetails.urine_test,
      type: "text",
    },
    {
      name: "hemocue_count",
      label: "Hemocue Hb Count (Number)",
      value: formDetails.hemocue_count,
      type: "number",
    },
    {
      name: "blood_glucose",
      label: "Capillary Blood Glucose (Decimal eg. 13.2)",
      value: formDetails.blood_glucose,
      type: "number",
    },
    {
      name: "others",
      label: "Others (Text eg. Anyth)",
      value: formDetails.others,
      type: "text",
    },
  ];

  return (
    <form>
      <div>
        <label className="label">Vitals</label>
      </div>
      <div>
        <div className="grid gap-6 md:grid-cols-2">
          {vitalFields.map((field) => (
            <InputField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              value={field.value}
              onChange={handleOnChange}
            />
          ))}
          <div>
            <label className="label">
              Blood Pressure (Systolic / Diastolic)
            </label>
            <div className="flex">
              <InputField
                key="systolic"
                name="systolic"
                // label="Systolic"
                type="number"
                value={formDetails.systolic}
                onChange={handleOnChange}
              />

              <span className="mx-2 my-2 text-lg">/</span>
              <InputField
                key="diastolic"
                name="diastolic"
                // label="Diastolic"
                type="number"
                value={formDetails.diastolic}
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
        <div>
          <label className="label">STAT Investigations</label>
        </div>
        <div>
          <div className="grid gap-6 md:grid-cols-2">
            {statFields.map((field) => (
              <InputField
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type}
                value={field.value}
                onChange={handleOnChange}
              />
            ))}
            <div>
              <div>
                <label className="label"> Diabetes?</label>

                <select
                  className="bg-blue-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 mt-4"
                  name="diabetes_mellitus"
                  onChange={handleOnChange}
                >
                  <option>Please Select...</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
