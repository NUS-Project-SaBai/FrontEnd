'use client';

import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { RHFUnitInputField } from '@/components/inputs/RHFUnitInputField';
import { RHFYesNoOption } from '@/components/inputs/RHFYesNoOption';
import { patchVital } from '@/data/vital/patchVital';
import { Patient } from '@/types/Patient';
import { EMPTY_VITAL, Vital } from '@/types/Vital';
import { FormEvent } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ChildVitalsFields } from './ChildVitalsFields';

export function VitalsForm({
  patient,
  visitId,
  curVital,
}: {
  patient: Patient;
  visitId: string;
  curVital: Vital | null;
}) {
  const { register, formState, handleSubmit, reset, setValue, watch } =
    useForm();
  const [formHeight, formWeight] = watch(['height', 'weight']);

  curVital = curVital || EMPTY_VITAL;
  // to ensure that after submitting, the dropdown is correct.
  setValue('gross_motor', curVital.gross_motor);
  setValue('diabetes_mellitus', curVital.diabetes_mellitus);
  const submitVitalsFormHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleSubmit(
      async (data: FieldValues) => {
        data.visit = visitId;
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
    <form
      onSubmit={submitVitalsFormHandler}
      className="rounded-lg bg-blue-50 p-4"
    >
      <h2>Height & Weight</h2>
      <div className="flex flex-wrap justify-between gap-x-1">
        <RHFUnitInputField
          register={register}
          formState={formState}
          name="height"
          label="Height"
          unit="cm"
          type="number"
          placeholder={curVital.height}
        />
        <RHFUnitInputField
          register={register}
          formState={formState}
          name="weight"
          label="Weight"
          unit="kg"
          type="number"
          placeholder={curVital.weight}
        />
        <DisplayField
          label="BMI"
          content={
            formHeight == null ||
            isNaN(parseFloat(formHeight)) ||
            formWeight == null ||
            isNaN(parseFloat(formWeight))
              ? 'Invalid/Missing Height or Weight'
              : (parseFloat(formWeight) / (parseFloat(formHeight) / 100) ** 2)
                  .toFixed(2)
                  .toString()
          }
        />
      </div>
      <h2>Blood Pressure</h2>
      <div className="flex flex-wrap justify-between gap-x-1">
        <RHFUnitInputField
          register={register}
          formState={formState}
          name="systolic"
          label="Systolic"
          unit="mmHg"
          type="integer"
          placeholder={curVital.systolic}
        />
        <RHFUnitInputField
          register={register}
          formState={formState}
          name="diastolic"
          label="Diastolic"
          unit="mmHg"
          type="integer"
          placeholder={curVital.diastolic}
        />
        <RHFUnitInputField
          register={register}
          formState={formState}
          name="heart_rate"
          label="Heart Rate"
          unit="BPM"
          type="integer"
          placeholder={curVital.heart_rate}
        />
      </div>
      <h2>Temperature</h2>
      <RHFUnitInputField
        register={register}
        formState={formState}
        name="temperature"
        label="Temperature"
        unit="°C"
        type="number"
        placeholder={curVital.temperature}
      />
      <h2>Visual Acuity</h2>
      <div className="grids-col-1 grid gap-2 md:grid-cols-2">
        <RHFInputField
          register={register}
          formState={formState}
          name="right_eye_degree"
          label="Right Eye (Fraction eg. 6/6)"
          type="text"
          placeholder={curVital.right_eye_degree}
        />
        <RHFInputField
          register={register}
          formState={formState}
          name="left_eye_degree"
          label="Left Eye (Fraction eg. 6/6)"
          type="text"
          placeholder={curVital.left_eye_degree}
        />
        <RHFInputField
          register={register}
          formState={formState}
          name="right_eye_pinhole"
          label="Right Eye Pinhole (Fraction eg. 6/6)"
          type="text"
          placeholder={curVital.right_eye_pinhole}
        />
        <RHFInputField
          register={register}
          formState={formState}
          name="left_eye_pinhole"
          label="Left Eye Pinhole (Fraction eg. 6/6)"
          type="text"
          placeholder={curVital.left_eye_pinhole}
        />
      </div>
      <h2>STAT Investigations</h2>
      <div className="grids-col-1 grid gap-2 md:grid-cols-2">
        <RHFInputField
          register={register}
          formState={formState}
          name="urine_test"
          label="Urine Dip Test"
          type="text"
          placeholder={curVital.urine_test}
        />
        <RHFUnitInputField
          register={register}
          formState={formState}
          name="hemocue_count"
          label="Hemocue Hb Count"
          type="number"
          unit="mmol/L"
          placeholder={curVital.hemocue_count}
        />
        <RHFUnitInputField
          register={register}
          formState={formState}
          name="blood_glucose_non_fasting"
          label="Non-Fasting Capillary Blood Glucose (Decimal eg. 13.2)"
          unit="mmol/L"
          type="number"
          placeholder={curVital.blood_glucose_non_fasting}
        />
        <RHFUnitInputField
          register={register}
          formState={formState}
          name="blood_glucose_fasting"
          label="Fasting Capillary Blood Glucose (Decimal eg. 13.2)"
          unit="mmol/L"
          type="number"
          placeholder={curVital.blood_glucose_fasting}
        />
        <RHFInputField
          register={register}
          formState={formState}
          name="others"
          label="Others"
          placeholder={curVital.others}
          type="text"
        />
        <RHFYesNoOption
          register={register}
          formState={formState}
          name="diabetes_mellitus"
          label="Diabetes?"
          defaultValue={curVital.diabetes_mellitus}
        />
      </div>
      <ChildVitalsFields
        register={register}
        formState={formState}
        patient={patient}
        curVital={curVital}
      />
      <Button text="Update" colour="green" type="submit" />
    </form>
  );
}
