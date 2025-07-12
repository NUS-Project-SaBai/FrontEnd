'use client';

import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { RHFBinaryOption } from '@/components/inputs/RHFBinaryOption';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { RHFUnitInputField } from '@/components/inputs/RHFUnitInputField';
import { ChildVitalsFields } from '@/components/records/vital/ChildVitalsFields';
import { patchVital } from '@/data/vital/patchVital';
import { Patient } from '@/types/Patient';
import { displayBMI, Vital } from '@/types/Vital';
import { FormEvent } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function VitalsForm({
  patient,
  visitId,
  curVital,
}: {
  patient: Patient;
  visitId: string;
  curVital: Vital; // can be EMPTY_VITAL
}) {
  const useFormReturn = useForm();
  const { handleSubmit, reset, watch } = useFormReturn;
  const [formHeight, formWeight] = watch(['height', 'weight']);

  curVital = curVital;
  const submitVitalsFormHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleSubmit(
      async (data: FieldValues) => {
        data.visit_id = visitId;
        patchVital(data as Vital).then(() => {
          reset();
          toast.success('Updated Vital');
        });
      },
      () => {
        toast.error('Invalid/Missing Input');
      }
    )();
  };

  return (
    <FormProvider {...useFormReturn}>
      <form
        onSubmit={submitVitalsFormHandler}
        className="rounded-lg bg-blue-50 p-4"
      >
        <h2>Height & Weight</h2>
        <div className="flex flex-wrap justify-between gap-x-1">
          <RHFUnitInputField
            name="height"
            label="Height"
            unit="cm"
            type="number"
            placeholder={curVital.height}
          />
          <RHFUnitInputField
            name="weight"
            label="Weight"
            unit="kg"
            type="number"
            placeholder={curVital.weight}
          />
          <DisplayField
            label="BMI"
            content={displayBMI(formHeight, formWeight)}
          />
        </div>
        <h2>Blood Pressure</h2>
        <div className="flex flex-wrap justify-between gap-x-1">
          <RHFUnitInputField
            name="systolic"
            label="Systolic"
            unit="mmHg"
            type="integer"
            placeholder={curVital.systolic?.toString()}
          />
          <RHFUnitInputField
            name="diastolic"
            label="Diastolic"
            unit="mmHg"
            type="integer"
            placeholder={curVital.diastolic?.toString()}
          />
          <RHFUnitInputField
            name="heart_rate"
            label="Heart Rate"
            unit="BPM"
            type="integer"
            placeholder={curVital.heart_rate?.toString()}
          />
        </div>
        <h2>Temperature</h2>
        <RHFUnitInputField
          name="temperature"
          label="Temperature"
          unit="°C"
          type="number"
          placeholder={curVital.temperature}
        />
        <h2>Visual Acuity</h2>
        <div className="grids-col-1 grid gap-2 md:grid-cols-2">
          <RHFInputField
            name="right_eye_degree"
            label="Right Eye (Fraction eg. 6/6)"
            type="text"
            placeholder={curVital.right_eye_degree}
          />
          <RHFInputField
            name="left_eye_degree"
            label="Left Eye (Fraction eg. 6/6)"
            type="text"
            placeholder={curVital.left_eye_degree}
          />
          <RHFInputField
            name="right_eye_pinhole"
            label="Right Eye Pinhole (Fraction eg. 6/6)"
            type="text"
            placeholder={curVital.right_eye_pinhole}
          />
          <RHFInputField
            name="left_eye_pinhole"
            label="Left Eye Pinhole (Fraction eg. 6/6)"
            type="text"
            placeholder={curVital.left_eye_pinhole}
          />
        </div>
        <h2>STAT Investigations</h2>
        <div className="grids-col-1 grid gap-2 md:grid-cols-2">
          <RHFInputField
            name="urine_test"
            label="Urine Dip Test"
            type="text"
            placeholder={curVital.urine_test}
          />
          <RHFUnitInputField
            name="hemocue_count"
            label="Hemocue Hb Count"
            type="number"
            unit="mmol/L"
            placeholder={curVital.hemocue_count}
          />
          <RHFUnitInputField
            name="blood_glucose_non_fasting"
            label="Non-Fasting Capillary Blood Glucose (Decimal eg. 13.2)"
            unit="mmol/L"
            type="number"
            placeholder={curVital.blood_glucose_non_fasting?.toString()}
          />
          <RHFUnitInputField
            name="blood_glucose_fasting"
            label="Fasting Capillary Blood Glucose (Decimal eg. 13.2)"
            unit="mmol/L"
            type="number"
            placeholder={curVital.blood_glucose_fasting?.toString()}
          />
          <RHFBinaryOption
            name="diabetes_mellitus"
            label="Diabetes?"
            defaultValue={curVital.diabetes_mellitus}
          />
          <RHFInputField
            name="others"
            label="Others"
            placeholder={curVital.others}
            type="text"
          />
        </div>
        <ChildVitalsFields patient={patient} curVital={curVital} />
        <Button text="Update" colour="green" type="submit" />
      </form>
    </FormProvider>
  );
}
