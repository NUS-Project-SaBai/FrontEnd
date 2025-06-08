'use client';

import { Button } from '@/components/Button';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { patchVision } from '@/data/vision/patchVision';
//import { Patient } from '@/types/Patient';
import { Vision } from '@/types/Vision';
import { FormEvent } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function VisionForm({
  //patient,
  visitId,
  curVision,
}: {
  //patient: Patient;
  visitId: string;
  curVision: Vision; // can be EMPTY_GLASSES
}) {
  const useFormReturn = useForm();
  const { handleSubmit, reset } = useFormReturn;

  curVision = curVision;
  const submitVisionFormHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleSubmit(
      async (data: FieldValues) => {
        data.visit = visitId;
        patchVision(data as Vision).then(() => {
          reset();
          toast.success('Updated Vision');
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
        onSubmit={submitVisionFormHandler}
        className="rounded-lg bg-blue-50 p-4"
      >
        <h2>Visual Acuity</h2>
        <div className="grids-col-1 grid gap-2 md:grid-cols-2">
          <RHFInputField
            name="right_eye_degree"
            label="Right Eye (Fraction eg. 6/6)"
            type="text"
            placeholder={curVision.right_eye_degree}
          />
          <RHFInputField
            name="left_eye_degree"
            label="Left Eye (Fraction eg. 6/6)"
            type="text"
            placeholder={curVision.left_eye_degree}
          />
          <RHFInputField
            name="right_eye_pinhole"
            label="Right Eye Pinhole (Fraction eg. 6/6)"
            type="text"
            placeholder={curVision.right_eye_pinhole}
          />
          <RHFInputField
            name="left_eye_pinhole"
            label="Left Eye Pinhole (Fraction eg. 6/6)"
            type="text"
            placeholder={curVision.left_eye_pinhole}
          />
          <RHFInputField
            name="left_eye_prescribed_glasses"
            label="Left Eye Prescribed Glasses Degree (Fraction eg. 6/6)"
            type="text"
            placeholder={curVision.left_eye_glasses_degree}
          />
          <RHFInputField
            name="right_eye_prescribed_glasses"
            label="Right Eye Prescribed Glasses Degree (Fraction eg. 6/6)"
            type="text"
            placeholder={curVision.right_eye_glasses_degree}
          />
        </div>
        <Button text="Update" colour="green" type="submit" />
      </form>
    </FormProvider>
  );
}
