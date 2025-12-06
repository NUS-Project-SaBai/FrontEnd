'use client';

import { Button } from '@/components/Button';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { createVision } from '@/data/vision/createVision';
import { patchVision } from '@/data/vision/patchVision';
import { patchVital } from '@/data/vital/patchVital';
import { Vision } from '@/types/Vision';
import { Vital } from '@/types/Vital';
import { FormEvent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function VisionForm({
  visitId,
  curVision,
  curVitals,
}: {
  visitId: string;
  curVision: Vision;
  curVitals: Vital;
}) {
  const useFormReturn = useForm();
  const { handleSubmit, reset } = useFormReturn;
  console.log(curVision.notes);

  curVision = curVision;
  curVitals = curVitals;

  const submitVisionFormHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleSubmit(
      async data => {
        const vitalPayload = {
          right_eye_degree: data.right_eye_degree,
          left_eye_degree: data.left_eye_degree,
          right_eye_pinhole: data.right_eye_pinhole,
          left_eye_pinhole: data.left_eye_pinhole,
          right_astigmatism: data.right_astigmatism,
          left_astigmatism: data.left_astigmatism,
          visit_id: visitId,
        };

        const visionCreatePayload = {
          right_glasses_degree: data.right_glasses_degree,
          left_glasses_degree: data.left_glasses_degree,
          notes: data.notes,
          visit_id: visitId, // only for CREATE
        };

        const visionPatchPayload = {
          id: curVision.id, // required for PATCH url helper
          right_glasses_degree: data.right_glasses_degree,
          left_glasses_degree: data.left_glasses_degree,
          notes: data.notes,
          // DO NOT include visit_id in PATCH
        };

        // 2) Filter out empty/undefined so you don’t wipe fields
        const prune = (obj: Record<string, unknown>) =>
          Object.fromEntries(
            Object.entries(obj).filter(([, v]) => v !== undefined && v !== '')
          );

        const vitalBody = prune(vitalPayload);
        const visionCreateBody = prune(visionCreatePayload);
        const visionPatchBody = prune(visionPatchPayload);

        try {
          // 3) Update Vital first
          await patchVital(vitalBody as Vital);
          toast.success('Updated Vital');

          // 4) Create or Patch Vision
          if (curVision.visit_id === undefined) {
            await createVision(visionCreateBody as Vision);
            toast.success('Created Vision');
          } else {
            await patchVision(visionPatchBody as Vision);
            toast.success('Updated Vision');
          }

          // 5) Reset ONCE after both succeed
          reset();
        } catch (e) {
          console.error(e);
          toast.error('Save failed');
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
        <h2>Vision Vitals</h2>
        <div className="grids-col-1 mt-2 grid gap-2 md:grid-cols-2">
          <RHFInputField
            name="right_eye_degree"
            label="Right Eye Degree (Fraction eg. 6/6)"
            type="text"
            placeholder={
              curVitals.right_eye_degree ? curVitals.right_eye_degree : '-'
            }
          />
          <RHFInputField
            name="left_eye_degree"
            label="Left Eye Degree (Fraction eg. 6/6)"
            type="text"
            placeholder={
              curVitals.left_eye_degree ? curVitals.left_eye_degree : '-'
            }
          />
          <RHFInputField
            name="right_eye_pinhole"
            label="Right Eye Pinhole"
            type="text"
            placeholder={
              curVitals.right_eye_pinhole ? curVitals.right_eye_pinhole : '-'
            }
          />
          <RHFInputField
            name="left_eye_pinhole"
            label="Left Eye Pinhole"
            type="text"
            placeholder={
              curVitals.left_eye_pinhole ? curVitals.left_eye_pinhole : '-'
            }
          />
          <RHFInputField
            name="right_astigmatism"
            label="Right Eye Astigmatism"
            type="text"
            placeholder={
              curVitals.right_astigmatism ? curVitals.right_astigmatism : '-'
            }
          />
          <RHFInputField
            name="left_astigmatism"
            label="Left Eye Astigmatism"
            type="text"
            placeholder={
              curVitals.left_astigmatism ? curVitals.left_astigmatism : '-'
            }
          />
        </div>
        <h2>Glasses Details</h2>
        <div className="grids-col-1 mt-2 grid gap-2 md:grid-cols-2">
          <RHFInputField
            name="right_glasses_degree"
            label="Right Eye Prescribed Glasses Degree (Fraction eg. 6/6)"
            type="text"
            placeholder={
              curVision.right_glasses_degree
                ? curVision.right_glasses_degree
                : '-'
            }
          />
          <RHFInputField
            name="left_glasses_degree"
            label="Left Eye Prescribed Glasses Degree (Fraction eg. 6/6)"
            type="text"
            placeholder={
              curVision.left_glasses_degree
                ? curVision.left_glasses_degree
                : '-'
            }
          />
        </div>
        <div className="grids-col-1 my-2 grid">
          <RHFInputField
            name="notes"
            label="General Notes"
            type="textarea"
            placeholder={
              curVision.notes ? curVision.notes : 'Enter any notes here...'
            }
          />
        </div>
        <Button text="Update" colour="green" type="submit" />
      </form>
    </FormProvider>
  );
}
