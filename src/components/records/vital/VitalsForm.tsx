'use client';

import { Button } from '@/components/Button';
import { gridStyle } from '@/components/commonStyles';
import { DisplayField } from '@/components/DisplayField';
import { RHFCustomSelect } from '@/components/inputs/RHFCustomSelect';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { RHFUnitInputField } from '@/components/inputs/RHFUnitInputField';
import { ChildVitalsFields } from '@/components/records/vital/ChildVitalsFields';
import { NAOption } from '@/constants';
import { patchVital } from '@/data/vital/patchVital';
import useSafeguardUnsavedChanges from '@/hooks/safeguardUnsavedChanges';
import { useSaveOnWrite } from '@/hooks/useSaveOnWrite';
import { Patient } from '@/types/Patient';
import { displayBMI, validateVisualAcuity, Vital } from '@/types/Vital';
import { FormEvent, useEffect, useState } from 'react';
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
  const [formDetails, setFormDetails, clearLocalStorageData] = useSaveOnWrite(
    'VitalsForm',
    {} as FieldValues,
    [visitId, curVital]
  );
  const useFormReturn = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const { handleSubmit, reset, watch } = useFormReturn;
  const [formHeight, formWeight] = watch(['height', 'weight']);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const formValues = useFormReturn.watch();
  useEffect(() => {
    if (formValues && Object.keys(formValues).length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [formValues]);

  useSafeguardUnsavedChanges(
    hasUnsavedChanges,
    'You have unsaved changes to the vitals form. Are you sure you want to leave?',
    () => {
      reset({});
      clearLocalStorageData();
    }
  );

  // if the user hasn’t provided a new height/weight, fall back
  // to the current vital values (curVital.height, curVital.weight).
  const heightToUse =
    formHeight != null && formHeight !== ''
      ? String(formHeight)
      : curVital.height;
  const weightToUse =
    formWeight != null && formWeight !== ''
      ? String(formWeight)
      : curVital.weight;

  const submitVitalsFormHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleSubmit(
      async (data: FieldValues) => {
        data.visit_id = visitId;
        console.log('SUBMIT DATA', data);
        patchVital(data as Vital).then(() => {
          // super jank because idh time to figure out why RHF keeps resetting this to the wrong value,
          // and how it interacts with the default value given later
          reset({ diabetes_mellitus: data.diabetes_mellitus });
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
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Patient Vitals
        </h2>
        <h2>Height & Weight</h2>
        <div className={gridStyle(100)}>
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
            content={displayBMI(heightToUse, weightToUse)}
          />
        </div>
        <h2>Blood Pressure</h2>
        <div className={gridStyle(100)}>
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
        <div className={gridStyle(100)}>
          <RHFUnitInputField
            name="temperature"
            label="Temperature"
            unit="°C"
            type="number"
            placeholder={curVital.temperature}
          />
        </div>
        <h2>Visual Acuity</h2>
        <div className={gridStyle(100) + ' grid-cols-2 gap-2'}>
          <RHFInputField
            name="right_eye_degree"
            label="Right Eye (eg. 6/6)"
            type="text"
            placeholder={curVital.right_eye_degree}
            validate={{
              validFormat: (value: string) =>
                validateVisualAcuity(value, false),
            }}
          />
          <RHFInputField
            name="left_eye_degree"
            label="Left Eye (eg. 6/6)"
            type="text"
            placeholder={curVital.left_eye_degree}
            validate={{
              validFormat: (value: string) =>
                validateVisualAcuity(value, false),
            }}
          />
          <RHFInputField
            name="right_eye_pinhole"
            label="Right Eye Pinhole (eg. 6/6)"
            type="text"
            placeholder={curVital.right_eye_pinhole}
            validate={{
              validFormat: (value: string) =>
                validateVisualAcuity(value, false),
            }}
          />
          <RHFInputField
            name="left_eye_pinhole"
            label="Left Eye Pinhole (eg. 6/6)"
            type="text"
            placeholder={curVital.left_eye_pinhole}
            validate={{
              validFormat: (value: string) =>
                validateVisualAcuity(value, false),
            }}
          />
        </div>
        <h2>STAT Investigations</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <RHFUnitInputField
            name="hbA1c"
            label="HbA1c"
            unit="%"
            type="number"
            placeholder={curVital.hbA1c?.toString()}
          />
          <RHFCustomSelect
            name="diabetes_mellitus"
            label="Diabetes?"
            defaultValue={curVital.diabetes_mellitus}
            unselectedValue={NAOption}
            options={['Yes', 'No']}
          />
        </div>
        <ChildVitalsFields patient={patient} curVital={curVital} />
        <h2>Other notes</h2>
        <RHFInputField
          name="others"
          placeholder={curVital.others}
          type="textarea"
        />
        <div className="h-4" />
        <Button text="Update" colour="green" type="submit" />
      </form>
    </FormProvider>
  );
}
