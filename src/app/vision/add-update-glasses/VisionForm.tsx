'use client';

import { Button } from '@/components/Button';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { createVision } from '@/data/vision/createVision';
import { patchVision } from '@/data/vision/patchVision';
import { Vision } from '@/types/Vision';
import { FormEvent } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function VisionForm({
  visitId,
  curVision,
}: {
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
        data.visit_id = visitId;

        if (curVision.visit_id === undefined) {
          // Create new vision record with JSON
          createVision(data as Vision).then(() => {
            reset();
            toast.success('Created Vision');
          });
        } else {
          // Update existing vision record with JSON
          data.id = curVision.id; // Ensure we are updating the correct record
          patchVision(data as Vision).then(() => {
            reset();
            toast.success('Updated Vision');
          });
        }
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
        <h2>Glasses Degree</h2>
        <div className="grids-col-1 grid gap-2 md:grid-cols-2">
          <RHFInputField
            name="right_glasses_degree"
            label="Right Eye Prescribed Glasses Degree (Fraction eg. 6/6)"
            type="text"
            placeholder={curVision.right_glasses_degree}
          />
          <RHFInputField
            name="left_glasses_degree"
            label="Left Eye Prescribed Glasses Degree (Fraction eg. 6/6)"
            type="text"
            placeholder={curVision.left_glasses_degree}
          />
        </div>
        <Button text="Add/Update" colour="green" type="submit" />
      </form>
    </FormProvider>
  );
}
