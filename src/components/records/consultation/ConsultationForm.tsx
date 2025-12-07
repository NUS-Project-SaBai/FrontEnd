'use client';
import { Button } from '@/components/Button';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { DiagnosisField } from '@/components/records/consultation/DiagnosisField';
import { MedicationOrderSection } from '@/components/records/consultation/MedicationOrderSection';
import { createConsult } from '@/data/consult/createConsult';
import { getConsultByID } from '@/data/consult/getConsult';
import { patchConsults } from '@/data/consult/patchConsults';
import { getDiagnosisByConsult } from '@/data/diagnosis/getDiagnosis';
import { createReferral } from '@/data/referrals/createReferral';
import { useSaveOnWrite } from '@/hooks/useSaveOnWrite';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Diagnosis } from '@/types/Diagnosis';
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
  const useFormReturn = useForm({ values: formDetails });
  const loadedConsultIdRef = useRef<number | null>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (editConsultId == null) {
      loadedConsultIdRef.current = null;
      isLoadingRef.current = false;
      return;
    }

    // Prevent re-loading if we've already loaded this consult or are currently loading
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

        console.log('Loading consult for edit - Consult ID:', editConsultId);
        console.log('Loaded consult:', consult);
        console.log('Loaded diagnoses:', diagnoses);
        console.log('Number of diagnoses:', diagnoses?.length);

        const formData = {
          past_medical_history: consult.past_medical_history || '',
          consultation: consult.consultation || '',
          diagnoses: (diagnoses || []).map(
            (d: Diagnosis & { id?: number; pk?: number }) => {
              const diagnosis: {
                id?: number;
                details: string;
                category: string;
              } = {
                details: d.details || '',
                category: d.category || '',
              };
              // Preserve ID if it exists (for existing diagnoses)
              if (d.id !== undefined && d.id !== null) {
                diagnosis.id = d.id;
              } else if (d.pk !== undefined && d.pk !== null) {
                diagnosis.id = d.pk;
              }
              console.log('Mapped diagnosis:', diagnosis);
              return diagnosis;
            }
          ),
          plan: consult.plan || '',
          referred_for: consult.referred_for || 'Not Referred',
          referral_notes: consult.referral_notes || '',
          remarks: consult.remarks || '',
          orders:
            consult.prescriptions?.map((p, index: number) => ({
              index,
              medication: p.medication_review?.medicine?.medicine_name || '',
              quantity: p.medication_review?.quantity_changed,
              notes: p.notes || '',
            })) || [],
        };

        console.log('Form data with diagnoses:', formData);
        console.log(
          'Number of diagnoses in form data:',
          formData.diagnoses.length
        );

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
        const { diagnoses: _, ...restOfData } = data;

        Object.entries(restOfData).forEach(([k, v]) => {
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
            default:
              if (isEditing) {
                jsonPayload[k] = v;
              } else {
                jsonPayload['consult'][k] = v;
              }
              break;
          }
        });

        // Include diagnoses in the payload
        if (diagnosesData && diagnosesData.length > 0) {
          const validDiagnoses = diagnosesData
            .filter(d => d?.details?.trim() && d?.category?.trim())
            .map(d => ({
              details: d.details.trim(),
              category: d.category.trim(),
            }));

          if (isEditing) {
            // For editing, diagnoses go at root level
            jsonPayload['diagnoses'] = validDiagnoses;
          } else {
            // For new consults, diagnoses go inside the consult object
            jsonPayload['consult']['diagnoses'] = validDiagnoses;
          }
        }

        console.log(
          'Final payload being sent:',
          JSON.stringify(jsonPayload, null, 2)
        );

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

          // Verify using getConsultByID and getDiagnosisByConsult
          const [verifyConsult, verifyDiagnoses] = await Promise.all([
            getConsultByID(targetConsultId.toString()),
            getDiagnosisByConsult(targetConsultId),
          ]);

          console.log('Verification - Consult:', verifyConsult);
          console.log(
            'Verification - Diagnoses count:',
            verifyDiagnoses.length
          );
          console.log('Verification - Diagnoses:', verifyDiagnoses);

          if (verifyDiagnoses.length !== (diagnosesData?.length || 0)) {
            console.warn(
              `Diagnosis count mismatch: Expected ${diagnosesData?.length || 0}, got ${verifyDiagnoses.length}`
            );
          }

          toast.success(
            isEditing
              ? 'Medical Consult Updated!'
              : 'Medical Consult Completed!'
          );
          reset({});
          clearLocalStorageData();
          if (isEditing && onEditComplete) {
            onEditComplete();
          }
        } catch (error) {
          console.error('Error submitting consultation form:', error);
          toast.error('Unknown Error');
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
                value: 'GlassesFitting',
                label: 'GlassesFitting [Within clinic]',
              },
              {
                value: "Others",
                label: "Others"
              }
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
          {/* TODO: try to remove prop drilling of patient */}
          <MedicationOrderSection patient={patient} />
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
