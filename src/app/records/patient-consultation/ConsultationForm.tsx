'use client';
import { Button } from '@/components/Button';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { DiagnosisField } from '@/components/records/consultation/DiagnosisField';
import { createConsult } from '@/data/consult/createConsult';
import { createReferral } from '@/data/referrals/createReferral';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Patient } from '@/types/Patient';
import { FormEvent } from 'react';
import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { MedicationOrderSection } from './MedicationOrderSection';

export function ConsultationForm({
  visitId,
  patient,
}: {
  visitId: string;
  patient: Patient | null;
}) {
  const useFormReturn = useForm();
  const { control, handleSubmit, reset } = useFormReturn;

  const submitConsultationFormHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // TODO: simplify backend to not require nesting of consult fields?
    // TODO: and also to let it handle the creation of referral.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonPayload: { [key: string]: any } = {
      consult: {
        visit_id: visitId,
      },
    };
    handleSubmit(
      async (data: FieldValues) => {
        Object.entries(data).forEach(([k, v]) => {
          switch (k) {
            case 'diagnoses':
              jsonPayload[k] = v;
              break;
            case 'orders':
              jsonPayload[k] =
                v == undefined
                  ? []
                  : v.map((order: ConsultMedicationOrder) => ({
                      medicine: order.medication.split(' ', 1)[0],
                      quantity: order.quantity,
                      notes: order.notes,
                    }));
              break;
            default:
              jsonPayload['consult'][k] = v;
              break;
          }
        });

        const referralPayload: {
          [key: string]: Patient | Date | string | number | null;
        } = {};
        let consultID;

        Object.entries(data).forEach(item => {
          if (item[0] == 'referral_notes' || item[0] == 'referred_for') {
            referralPayload[item[0]] = item[1];
          }
        });

        try {
          const result = await createConsult(jsonPayload);
          if (result == null) {
            toast.error('Error submitting consultation form');
          } else {
            consultID = result.id;
            toast.success('Medical Consult Completed!');
            reset();
          }
        } catch (error) {
          console.error('Error submitting consultation form:', error);
          toast.error('Unknown Error');
        }

        // only submit the form if 'referred_for' is filled in and is not 'Not Referred'
        if ('referred_for' in referralPayload) {
          if (referralPayload['referred_for'] !== '') {
            if (!('referral_notes' in referralPayload)) {
              referralPayload['referral_notes'] = 'No notes entered';
            }

            referralPayload['referral_state'] = 'New';
            referralPayload['consult'] = Number(consultID);
            referralPayload['referral_outcome'] = '';

            try {
              const result = createReferral(referralPayload);
              result
                .then(
                  () => {
                    toast.success('Referral submitted!');
                    reset();
                  },
                  () => console.log('error')
                )
                .catch(() => toast.error('Error submitting consultation form'));
            } catch (error) {
              console.error('Error submitting referral form:', error);
              toast.error('Unknown Error');
            }
          }
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
      <FormProvider {...useFormReturn}>
        <form
          onSubmit={submitConsultationFormHandler}
          className="flex flex-col gap-y-2"
        >
          {/* TODO: Check that the required field is filled up. */}
          <RHFInputField
            name="past_medical_history"
            label="Past Medical History"
            type="textarea"
            placeholder="Type your problems here..."
          />
          <RHFInputField
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
            name="plan"
            label="Plan"
            type="textarea"
            placeholder="Type your plan here..."
          />
          <RHFDropdown
            name="referred_for"
            label="Referral for (optional)"
            options={[
              { value: '', label: 'Not Referred' },
              { value: 'Diagnostic', label: 'Diagnositic' },
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
            name="referral_notes"
            label="Referral Notes"
            type="textarea"
            placeholder="Type your referral notes here..."
          />

          <RHFInputField
            name="remarks"
            label="Remarks"
            type="textarea"
            placeholder="Type your remarks here..."
          />
          {/* TODO: try to remove prop drilling of patient */}
          <MedicationOrderSection patient={patient} />
          <Button colour="green" text="Submit" type="submit" />
        </form>
      </FormProvider>
    </div>
  );
}
