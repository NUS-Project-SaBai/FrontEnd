'use client';
import { Button } from '@/components/Button';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { LoadingPage } from '@/components/LoadingPage';
import { DiagnosisField } from '@/components/records/consultation/DiagnosisField';
import { MedicationOrderSection } from '@/components/records/consultation/MedicationOrderSection';
import { createConsult } from '@/data/consult/createConsult';
import { getConsultByID } from '@/data/consult/getConsult';
import { patchConsults } from '@/data/consult/patchConsults';
import { getDiagnosisByConsult } from '@/data/diagnosis/getDiagnosis';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useSaveOnWrite } from '@/hooks/useSaveOnWrite';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Patient } from '@/types/Patient';
import { useEffect } from 'react';

import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';

export function ConsultationForm({
  visitId,
  patient,
  editConsultId,
  onEditComplete,
}: {
  visitId: string;
  patient: Patient | null;
  editConsultId?: number | null;
  onEditComplete?: () => void;
}) {
  const { isLoading, withLoading } = useLoadingState(true);
  const [formDetails, setFormDetails, clearFormLocalStorage] = useSaveOnWrite(
    'ConsultationForm',
    {} as FieldValues,
    [visitId, editConsultId]
  );

  //form needs to be updated by external data
  const useFormReturn = useForm({ values: formDetails });

  const isEditing = editConsultId != null;
  const referredFor = useFormReturn.watch('referred_for');

  // Debounce localStorage saves to prevent excessive writes
  const debouncedSaveFormDetails = useDebouncedCallback(
    (values: FieldValues) => {
      setFormDetails(values);
    },
    500
  );

  useEffect(() => {
    let isMounted = true;

    if (!editConsultId) {
      return;
    }

    const loadData = withLoading(async () => {
      try {
        const [consult, diagnoses] = await Promise.all([
          getConsultByID(editConsultId.toString()),
          getDiagnosisByConsult(editConsultId),
        ]);

        if (!consult) {
          toast.error('Failed to load consultation data');
          return;
        }

        const formData = {
          past_medical_history: consult.past_medical_history || '',
          consultation: consult.consultation || '',
          diagnoses: diagnoses || [],
          plan: consult.plan || '',
          referred_for: consult.referred_for || 'Not Referred',
          referral_notes: consult.referral_notes || '',
          remarks: consult.remarks || '',
          orders:
            consult.prescriptions?.map((p, index: number) => ({
              index,
              medication: p.medication_review?.medicine?.medicine_name || '',
              quantity: -p.medication_review?.quantity_changed,
              notes: p.notes || '',
            })) || [],
        };

        useFormReturn.reset(formData);
        debouncedSaveFormDetails(formData);
      } catch (error) {
        if (!isMounted) return;
        console.error('Error loading consult data:', error);
        toast.error('Failed to load consultation data');
      }
    });

    loadData();

    //cleanup function
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editConsultId]);

  useEffect(() => {
    if (editConsultId != null) return;

    const unsub = useFormReturn.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        debouncedSaveFormDetails(values);
      },
    });
    return () => {
      unsub();
      if (editConsultId == null) {
        debouncedSaveFormDetails({} as FieldValues);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId, editConsultId]);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useFormReturn;

  const onValidSubmit = async (data: FieldValues) => {
    try {
      const payload = isEditing ? data : { ...data, visit_id: visitId };
      // REMOVE ORDERS FROM THE PAYLOAD FOR NOW
      payload['orders'] =
        payload['orders'] == undefined
          ? []
          : payload['orders'].map((order: ConsultMedicationOrder) => ({
              medicine: order.medication.split(' ', 1)[0],
              quantity: order.quantity,
              notes: order.notes,
            }));

      const result = isEditing
        ? await patchConsults(editConsultId, payload)
        : await createConsult(payload);

      if ((result != null && 'error' in result) || result == null) {
        toast.error(
          isEditing
            ? `Error updating consultation: ${result?.error}`
            : `Error submitting consultation form: ${result?.error}`
        );
        return;
      }

      toast.success(
        isEditing ? 'Medical Consult Updated!' : 'Medical Consult Completed!'
      );

      if (isEditing && onEditComplete) {
        onEditComplete();
      }
      useFormReturn.reset({});
      clearFormLocalStorage();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Unknown Error');
    }
  };

  const onInvalidSubmit = () => {
    toast.error('Missing Input - Please check required fields');
  };

  const submitConsultationFormHandler = handleSubmit(
    onValidSubmit,
    onInvalidSubmit
  );

  const showReferralNotes = referredFor && referredFor !== 'Not Referred';
  return (
    <LoadingPage isLoading={isLoading}>
      <div className="h-full rounded-lg bg-blue-100 p-2 shadow-sm">
        <h3>{isEditing ? 'Edit Consultation' : "Doctor's Consult Form"}</h3>
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
              isRequired={true}
              textAreaRows={10}
            />
            <RHFInputField
              name="consultation"
              label="Consultation"
              type="textarea"
              placeholder="Type your consultation here..."
              isRequired={true}
              textAreaRows={10}
            />
            <Controller
              name="diagnoses"
              control={control}
              defaultValue={[]}
              render={({ field: { value, onChange }, fieldState }) => (
                <DiagnosisField
                  diagnosis={value}
                  setDiagnosis={onChange}
                  error={fieldState.error?.message}
                />
              )}
              rules={{
                validate: {
                  ensureFilled: (
                    val: Array<{
                      id?: number;
                      details: string;
                      category: string;
                    }>
                  ) => {
                    if (!val || val.length === 0)
                      return 'At least one diagnosis is required';
                    if (
                      val.some(
                        d => d.details.trim() === '' || d.category.trim() === ''
                      )
                    ) {
                      return 'All diagnoses must have details and category';
                    }
                    return true;
                  },
                },
              }}
            />

            <RHFInputField
              name="plan"
              label="Plan"
              type="textarea"
              placeholder="Type your plan here..."
              textAreaRows={6}
            />
            <RHFDropdown
              name="referred_for"
              label="Referral for (optional)"
              omitDefaultPrompt={true}
              options={[
                //use empty string '' for "Not Referred"
                { value: 'Not Referred', label: 'Not Referred' },
                { value: 'Diagnostic', label: 'Diagnositic' },
                { value: 'Acute', label: 'Acute' },
                { value: 'Chronic', label: 'Chronic' },
                {
                  value: 'AdvancedVision',
                  label: 'AdvancedVision [Within clinic]',
                },
                {
                  value: 'GlassesFitting',
                  label: 'GlassesFitting [Within clinic]',
                },
                {
                  value: 'Others',
                  label: 'Others',
                },
              ]}
            />
            {showReferralNotes && (
              <RHFInputField
                name="referral_notes"
                label="Referral Notes"
                type="textarea"
                placeholder="Type your referral notes here..."
                isRequired={useFormReturn.watch('referred_for') !== ''}
                textAreaRows={8}
              />
            )}
            <RHFInputField
              name="remarks"
              label="Remarks"
              type="textarea"
              placeholder="Type your remarks here..."
            />
            {/* We don't want to edit this section when editing the consultation */}
            {isEditing ? (
              <div className="rounded-lg bg-gray-50 p-2 shadow">
                <h2>Order</h2>
                <p className="py-2">
                  Medicine orders not supported yet for consultation edit
                </p>
              </div>
            ) : (
              <MedicationOrderSection
                patient={patient}
                isEditable={!isEditing}
              />
            )}
            <Button
              colour="green"
              text={
                isSubmitting
                  ? isEditing
                    ? 'Editing...'
                    : 'Submitting...'
                  : isEditing
                    ? 'Edit'
                    : 'Submit'
              }
              type="submit"
              onClick={() => {
                if (isEditing) {
                  toast.success('Editing...');
                } else {
                  toast.success('Submitting...');
                }
              }}
              disabled={isSubmitting}
            />
            {isEditing && (
              <Button
                colour="red"
                text="Cancel"
                type="button"
                onClick={() => {
                  clearFormLocalStorage();
                  toast.success('Edit cancelled!');
                  if (onEditComplete) {
                    onEditComplete();
                  }
                }}
                disabled={isSubmitting}
              />
            )}
          </form>
        </FormProvider>
      </div>
    </LoadingPage>
  );
}
