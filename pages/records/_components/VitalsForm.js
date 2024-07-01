import {
  Button,
  InputField,
  DisplayField,
  DropDown,
} from '@/components/TextComponents';

export function VitalsForm({ handleOnChange, formDetails, onSubmit, patient }) {
  const vitalFields = [
    {
      name: 'height',
      label: 'Height / CM',
      value: formDetails.height,
      type: 'number',
      unit: 'cm',
    },
    {
      name: 'weight',
      label: 'Weight / KG',
      value: formDetails.weight,
      type: 'number',
      unit: 'kg',
    },
    {
      name: 'temperature',
      label: 'Temperature / °C',
      value: formDetails.temperature,
      type: 'number',
      unit: '°C',
    },
    {
      name: 'heart_rate',
      label: 'Heart Rate / BPM',
      value: formDetails.heart_rate,
      type: 'number',
      unit: 'BPM',
    },
    {
      name: 'left_eye_degree',
      label: 'Left Eye (Fraction eg. 6/6)',
      value: formDetails.left_eye_degree,
      type: 'text',
    },
    {
      name: 'right_eye_degree',
      label: 'Right Eye (Fraction eg. 6/6)',
      value: formDetails.right_eye_degree,
      type: 'text',
    },
    {
      name: 'left_eye_pinhole',
      label: 'Left Eye Pinhole (Fraction eg. 6/12)',
      value: formDetails.left_eye_pinhole,
      type: 'text',
    },
    {
      name: 'right_eye_pinhole',
      label: 'Right Eye Pinhole (Fraction eg. 6/12)',
      value: formDetails.right_eye_pinhole,
      type: 'text',
    },
    // Add more fields as needed
  ];

  const statFields = [
    {
      name: 'urine_test',
      label: 'Urine Dip Test (Text eg. Anyth)',
      value: formDetails.urine_test,
      type: 'text',
    },
    {
      name: 'hemocue_count',
      label: 'Hemocue Hb Count (Number)',
      value: formDetails.hemocue_count,
      type: 'number',
    },
    {
      name: 'blood_glucose',
      label: 'Capillary Blood Glucose (Decimal eg. 13.2)',
      value: formDetails.blood_glucose,
      type: 'number',
      unit: 'mmol/L',
    },
    {
      name: 'others',
      label: 'Others (Text eg. Anyth)',
      value: formDetails.others,
      type: 'text',
    },
  ];

  return (
    <form className="bg-blue-100 p-4 rounded-lg relative">
      <div>
        <label className="label text-lg font-semibold">
          Current Vital Signs
        </label>
      </div>
      <div>
        <div className="grid gap-6 md:grid-cols-3">
          {vitalFields.slice(0, 2).map((field) => (
            <InputField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              value={field.value}
              onChange={handleOnChange}
              unit={field.unit}
            />
          ))}
          <DisplayField
            label="BMI"
            content={
              isNaN(formDetails.weight / formDetails.height ** 2)
                ? 'Please enter valid height and weight'
                : (
                    formDetails.weight /
                    (formDetails.height / 100) ** 2
                  ).toFixed(2)
            }
          />
        </div>
        <div className="my-4">
          <label className="label">
            Blood Pressure (Systolic / Diastolic) / mmHg
          </label>
          <div className="flex">
            <InputField
              key="systolic"
              name="systolic"
              type="number"
              value={formDetails.systolic}
              onChange={handleOnChange}
              unit="mmHg"
            />
            <span className="mx-2 my-2 text-lg">/</span>
            <InputField
              key="diastolic"
              name="diastolic"
              type="number"
              value={formDetails.diastolic}
              onChange={handleOnChange}
              unit="mmHg"
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {vitalFields.slice(2).map((field) => (
            <InputField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              value={field.value}
              onChange={handleOnChange}
              unit={field.unit}
            />
          ))}
        </div>

        <div>
          <label className="label text-lg font-semibold">
            STAT Investigations
          </label>
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
                unit={field.unit}
              />
            ))}
            <div className="flex items-center space-x-4">
              <DropDown
                name="diabetes_mellitus"
                label="Diabetes?"
                defaultValue="Please select..."
                options={['Please select...', 'No', 'Yes']}
                onChange={handleOnChange}
                value={formDetails.diabetes_mellitus}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <Button colour="green" text={'Submit'} onClick={onSubmit} />
      </div>
    </form>
  );
}
