'use client';
import { Button } from '@/components/Button';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { DiagnosisField } from '@/components/records/consultation/DiagnosisField';
import { MedicationOrderSection } from '@/components/records/consultation/MedicationOrderSection';
import { createConsult } from '@/data/consult/createConsult';
import { getConsultByID } from '@/data/consult/getConsult';
import { patchConsults } from '@/data/consult/patchConsults';
import { createDiagnosis } from '@/data/diagnosis/createDiagnosis';
import { deleteDiagnosis } from '@/data/diagnosis/deleteDiagnosis';
import { getDiagnosisByConsult } from '@/data/diagnosis/getDiagnosis';
import { patchDiagnosis } from '@/data/diagnosis/patchDiagnosis';
import { createReferral } from '@/data/referrals/createReferral';
import useSafeguardUnsavedChanges from '@/hooks/safeguardUnsavedChanges';
import { useSaveOnWrite } from '@/hooks/useSaveOnWrite';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Patient } from '@/types/Patient';
import { FormEvent, useEffect, useRef } from 'react';

import {
  Controller,
  FieldValues,
  FormProvider,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';

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
  const [formDetails, setFormDetails, clearLocalStorageData] = useSaveOnWrite(
    'ConsultationForm',
    {} as FieldValues,
    [visitId, editConsultId]
  );
  const useFormReturn = useForm();
  const loadedConsultIdRef = useRef<number | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (!editConsultId && formDetails && Object.keys(formDetails).length > 0) {
      useFormReturn.reset(formDetails);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editConsultId == null) {
      loadedConsultIdRef.current = null;
      isLoadingRef.current = false;
      return;
    }

    if (loadedConsultIdRef.current === editConsultId || isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    const loadData = async () => {
      try {
        const [consult, diagnoses] = await Promise.all([
          getConsultByID(editConsultId.toString()),
          getDiagnosisByConsult(editConsultId),
        ]);

        if (consult == null) {
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

        loadedConsultIdRef.current = editConsultId;
        useFormReturn.reset(formData);
        setFormDetails(formData);
        isLoadingRef.current = false;
      } catch (error) {
        console.error('Error loading consult data:', error);
        toast.error('Failed to load consultation data');
        isLoadingRef.current = false;
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editConsultId]);

  useEffect(() => {
    if (editConsultId != null) return;

    const unsub = useFormReturn.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        setFormDetails(values);
      },
    });
    return () => {
      unsub();
      if (editConsultId == null) {
        useFormReturn.reset({});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId, editConsultId]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useFormReturn;
  const referredFor = useFormReturn.watch('referred_for');
  const isEditing = editConsultId != null;

  useSafeguardUnsavedChanges(
    useFormReturn.formState.isDirty,
    'You have unsaved changes to the consultation form. Are you sure you want to leave?',
    () => {
      // When user confirms they want to leave, clear the form state
      reset({});
      clearLocalStorageData();
    }
  );

  // Helper function to process and validate diagnoses
  const processDiagnoses = (
    diagnoses: Array<{
      id?: number;
      details: string;
      category: string;
    }>,
    includeId = false
  ) => {
    return diagnoses
      .filter(d => d?.details?.trim() && d?.category?.trim())
      .map(d => ({
        ...(includeId && d.id !== undefined ? { id: d.id } : {}),
        details: d.details.trim(),
        category: d.category.trim(),
      }));
  };

  const submitConsultationFormHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonPayload: { [key: string]: any } = isEditing
      ? {}
      : {
          consult: {
            visit_id: visitId,
          },
        };
    handleSubmit(
      async (data: FieldValues) => {
        // Get diagnoses data
        const diagnosesData =
          (data.diagnoses as Array<{
            id?: number;
            details: string;
            category: string;
          }>) || [];

        // Include diagnoses in the payload instead of removing them
        Object.entries(data).forEach(([k, v]) => {
          switch (k) {
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
            case 'diagnoses':
              break;
            default:
              if (isEditing) {
                jsonPayload[k] = v;
              } else {
                jsonPayload['consult'][k] = v;
              }
              break;
          }
        });

        if (!isEditing && diagnosesData && diagnosesData.length > 0) {
          jsonPayload['diagnoses'] = processDiagnoses(diagnosesData);
        }

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
          const result =
            isEditing && editConsultId
              ? await patchConsults(editConsultId, jsonPayload)
              : await createConsult(jsonPayload);

          if (result != null && 'error' in result) {
            toast.error(
              isEditing
                ? `Error updating consultation: ${result.error}`
                : `Error submitting consultation form: ${result.error}`
            );
            return;
          }
          if (result == null) {
            toast.error(
              isEditing
                ? 'Error updating consultation'
                : 'Error submitting consultation form'
            );
            return;
          }

          consultID = result.id;
          const targetConsultId = isEditing ? editConsultId : consultID;

          // Handle diagnoses separately
          const validDiagnoses = processDiagnoses(diagnosesData, isEditing);

          if (isEditing) {
            // Sync diagnoses manually when editing
            const existingDiagnoses =
              await getDiagnosisByConsult(targetConsultId);

            // Update or create diagnoses
            for (const diagnosis of validDiagnoses) {
              if (diagnosis.id) {
                // Update existing diagnosis
                await patchDiagnosis(diagnosis.id, {
                  details: diagnosis.details,
                  category: diagnosis.category,
                });
              } else {
                // Create new diagnosis
                await createDiagnosis({
                  consult_id: targetConsultId,
                  details: diagnosis.details,
                  category: diagnosis.category,
                });
              }
            }

            // Delete diagnoses that were removed
            const currentDiagnosisIds = validDiagnoses
              .filter(d => d.id !== undefined)
              .map(d => d.id as number);
            for (const existingDiag of existingDiagnoses) {
              if (
                existingDiag.id &&
                !currentDiagnosisIds.includes(existingDiag.id)
              ) {
                await deleteDiagnosis(existingDiag.id);
              }
            }
          } else if (validDiagnoses.length > 0) {
            // For new consults, verify diagnoses were created
            const verifyDiagnoses =
              await getDiagnosisByConsult(targetConsultId);

            if (verifyDiagnoses.length !== validDiagnoses.length) {
              // Create missing diagnoses
              for (const diagnosis of validDiagnoses) {
                await createDiagnosis({
                  consult_id: targetConsultId,
                  details: diagnosis.details,
                  category: diagnosis.category,
                });
              }
            }
          }

          toast.success(
            isEditing
              ? 'Medical Consult Updated!'
              : 'Medical Consult Completed!'
          );
        } catch (error) {
          console.error('Error submitting consultation form:', error);
          toast.error('Unknown Error');
          return; // Don't clear form if there was an error
        }

        // Clear form after successful submission

        reset({});
        clearLocalStorageData();
        if (isEditing && onEditComplete) {
          onEditComplete();
        }

        // only submit the form if 'referred_for' is filled in and is not 'Not Referred'
        if ('referred_for' in referralPayload) {
          if (referralPayload['referred_for'] !== 'Not Referred') {
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
  const showReferralNotes = referredFor && referredFor !== 'Not Referred';
  return (
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
                  val: Array<{ id?: number; details: string; category: string }>
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
            <MedicationOrderSection patient={patient} isEditable={!isEditing} />
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
                clearLocalStorageData();
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
  );
}
