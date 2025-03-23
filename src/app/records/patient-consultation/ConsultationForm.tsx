'use client';
import { Button } from '@/components/Button';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { DiagnosisField } from '@/components/records/DiagnosisField';
import { Consult } from '@/types/Consult';
import { FormEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function ConsultationForm({
  visitId,
  submitConsultation,
}: {
  visitId: string;
  submitConsultation: (formData: object) => Promise<Consult | null>;
}) {
  const { register, control, handleSubmit, reset } = useForm();

  const submitConsultationFormHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const oldFormData = new FormData(event.target as HTMLFormElement);
    // TODO: simplify backend to not require nesting of consult fields?
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonPayload: { [key: string]: any } = {
      consult: {
        visit: visitId,
      },
    };
    oldFormData.entries().forEach(([k, v]) => {
      if (k === 'diagnoses' || k === 'order') {
        jsonPayload[k] = v;
      } else {
        jsonPayload['consult'][k] = v;
      }
    });
    handleSubmit(
      async () => {
        try {
          const result = await submitConsultation(jsonPayload);
          if (result == null) {
            toast.error('Error submitting conusultation form');
          } else {
            toast.success('Medical Consult Completed!');
            reset();
          }
        } catch (error) {
          console.error('Error submitting consultation form:', error);
          toast.error('Unknown Error');
        }
      },
      () => {
        toast.error('Missing Input');
      }
    )();
  };
  return (
    <div className="h-full rounded-lg bg-blue-100 p-2 shadow-sm">
      <h3>Doctor&apos;s Consult Form</h3>
      <form onSubmit={submitConsultationFormHandler}>
        {/* TODO: Check that the required field is filled up. */}
        <RHFInputField
          register={register}
          name="past_medical_history"
          label="Past Medical History"
          type="textarea"
          placeholder="Type your problems here..."
        />
        <RHFInputField
          register={register}
          name="consultation"
          label="Consultation"
          type="textarea"
          placeholder="Type your consultation here..."
        />
        <Controller
          name="diagnoses"
          control={control}
          defaultValue={[]}
          render={({ field: { value, onChange } }) => (
            <DiagnosisField diagnosis={value} setDiagnosis={onChange} />
          )}
        />

        <RHFInputField
          register={register}
          name="plan"
          label="Plan"
          type="textarea"
          placeholder="Type your plan here..."
        />
        <RHFDropdown
          register={register}
          name="referred_for"
          label="Referral for (optional)"
          options={[
            { value: 'Diagnositic', label: 'Diagnositic' },
            { value: 'Acute', label: 'Acute' },
            { value: 'Chronic', label: 'Chronic' },
            {
              value: 'AdvancedVision',
              label: 'AdvancedVision [Within clinic]',
            },
            {
              value: 'GlassessFitting',
              label: 'GlassessFitting [Within clinic]',
            },
          ]}
        />
        <RHFInputField
          register={register}
          name="referral_notes"
          label="Referral Notes"
          type="textarea"
          placeholder="Type your referral notes here..."
        />

        <RHFInputField
          register={register}
          name="remarks"
          label="Remarks"
          type="textarea"
          placeholder="Type your remarks here..."
        />
        {/* TODO: Implement add medicine order functionality */}
        <p>medicine orders</p>
        <Button colour="green" text="Submit" type="submit" />
      </form>
    </div>
  );
}
