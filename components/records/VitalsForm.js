import React from 'react';
import {
  Button,
  InputField,
  DisplayField,
  DropDown,
} from '@/components/TextComponents';

import { ChildrenVitalsFields } from '@/components/records';

export function VitalsForm({
  handleOnChange,
  formDetails,
  onSubmit,
  patient,
  visit,
  vitals,
}) {
  const vitalFields = [
    {
      name: 'height',
      label: 'Height / CM',
      placeholder: vitals.height,
      value: formDetails.height,
      type: 'number',
      unit: 'cm',
      allowDecimals: true,
    },
    {
      name: 'weight',
      label: 'Weight / KG',
      placeholder: vitals.weight,
      value: formDetails.weight,
      type: 'number',
      unit: 'kg',
      allowDecimals: true,
    },
    {
      name: 'systolic',
      label: 'Systolic / mmHg',
      placeholder: vitals.systolic,
      value: formDetails.systolic,
      type: 'number',
      unit: 'mmHg',
    },
    {
      name: 'diastolic',
      label: 'Diastolic / mmHg',
      placeholder: vitals.diastolic,
      value: formDetails.diastolic,
      type: 'number',
      unit: 'mmHg',
    },
    {
      name: 'heart_rate',
      label: 'Heart Rate / BPM',
      placeholder: vitals.heart_rate,
      value: formDetails.heart_rate,
      type: 'number',
      unit: 'BPM',
    },
    {
      name: 'temperature',
      label: 'Temperature / °C',
      placeholder: vitals.temperature,
      value: formDetails.temperature,
      type: 'number',
      unit: '°C',
      allowDecimals: true,
    },
    {
      name: 'right_eye_degree',
      label: 'Right Eye (Fraction eg. 6/6)',
      placeholder: vitals.right_eye_degree,
      value: formDetails.right_eye_degree,
      type: 'text',
    },
    {
      name: 'left_eye_degree',
      label: 'Left Eye (Fraction eg. 6/6)',
      placeholder: vitals.left_eye_degree,
      value: formDetails.left_eye_degree,
      type: 'text',
    },
    {
      name: 'right_eye_pinhole',
      label: 'Right Eye Pinhole (Fraction eg. 6/12)',
      placeholder: vitals.right_eye_pinhole,
      value: formDetails.right_eye_pinhole,
      type: 'text',
    },
    {
      name: 'left_eye_pinhole',
      label: 'Left Eye Pinhole (Fraction eg. 6/12)',
      placeholder: vitals.left_eye_pinhole,
      value: formDetails.left_eye_pinhole,
      type: 'text',
    },
  ];

  const vitalFieldsComponent = vitalFields.map(field => {
    return (
      <InputField
        key={field.name}
        name={field.name}
        label={field.label}
        type={field.type}
        placeholder={field.placeholder}
        value={field.value || ''} //use empty string if value is null or undefined
        onChange={handleOnChange}
        unit={field.unit}
        allowNegativeNumbers={field.allowNegativeNumbers}
        allowDecimals={field.allowDecimals}
      />
    );
  });

  const statFields = [
    {
      name: 'urine_test',
      label: 'Urine Dip Test (Text eg. Anyth)',
      placeholder: vitals.urine_test,
      value: formDetails.urine_test,
      type: 'text',
    },
    {
      name: 'hemocue_count',
      label: 'Hemocue Hb Count (Number)',
      placeholder: vitals.hemocue_count,
      value: formDetails.hemocue_count,
      type: 'number',
      allowDecimals: true,
    },
    {
      name: 'blood_glucose',
      label: 'Capillary Blood Glucose (Decimal eg. 13.2)',
      placeholder: vitals.blood_glucose,
      value: formDetails.blood_glucose,
      type: 'number',
      unit: 'mmol/L',
      allowDecimals: true,
    },
    {
      name: 'others',
      label: 'Others (Text eg. Anyth)',
      placeholder: vitals.others,
      value: formDetails.others,
      type: 'text',
    },
  ];

  const statFieldsComponent = statFields.map(field => {
    return (
      <InputField
        key={field.name}
        name={field.name}
        label={field.label}
        type={field.type}
        placeholder={field.placeholder}
        value={field.value || ''}
        onChange={handleOnChange}
        unit={field.unit}
        allowDecimals={field.allowDecimals}
        allowNegativeNumbers={field.allowNegativeNumbers}
      />
    );
  });

  return (
    <form className="bg-blue-50 p-4 rounded-lg relative">
      <div>
        <label className="label text-lg font-semibold">
          Current Vital Signs
        </label>
      </div>
      <div>
        <div>
          <label className="label text-lg font-semibold">Height / Weight</label>
          <div className="grid gap-6 md:grid-cols-3">
            {vitalFieldsComponent.slice(0, 2)}
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
        </div>

        <div className="my-4">
          <label className="label text-lg font-semibold">
            Blood Pressure (Systolic / Diastolic) / mmHg and Heart Rate / BPM
          </label>
          <div className="flex gap-6">
            {vitalFieldsComponent.slice(2, 3)}
            <span className="mx-2 my-2 text-lg">/</span>
            {vitalFieldsComponent.slice(3, 5)}
          </div>
        </div>

        <div>
          <label className="label text-lg font-semibold">
            Temperature Fields
          </label>
          <div className="flex">{vitalFieldsComponent.slice(5, 6)}</div>
        </div>

        <div>
          <label className="label text-lg font-semibold">Visual Acuity</label>
          <div className="grid gap-6 md:grid-cols-2">
            {vitalFieldsComponent.slice(6)}
          </div>
        </div>

        <div>
          <label className="label text-lg font-semibold">
            STAT Investigations
          </label>
          <div>
            <div className="grid gap-6 md:grid-cols-2">
              {statFieldsComponent}
              <div className="flex items-center space-x-4">
                <DropDown
                  key="diabetes_mellitus"
                  name="diabetes_mellitus"
                  label="Diabetes?"
                  defaultValue="Please select..."
                  options={['Please select...', 'Yes', 'No']}
                  onChange={handleOnChange}
                  value={formDetails.diabetes_mellitus}
                />
              </div>
            </div>
          </div>
        </div>

        <ChildrenVitalsFields
          handleOnChange={handleOnChange}
          formDetails={formDetails}
          patient={patient}
          visit={visit}
        />
      </div>

      <div style={{ height: '50px' }}></div>

      <div className="absolute bottom-4 right-4">
        <Button colour="green" text={'Submit'} onClick={onSubmit} />
      </div>
    </form>
  );
}
