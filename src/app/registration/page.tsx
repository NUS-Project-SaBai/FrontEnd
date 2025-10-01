'use client';
import { LoadingPage } from '@/components/LoadingPage';
import { PatientInfo } from '@/components/records/patient/PatientInfo';
import { NewPatientModal } from '@/components/registration/NewPatientModal';
import { PatientScanForm } from '@/components/registration/PatientScanForm';
import { RegistrationAutosuggest } from '@/components/registration/RegistrationAutosuggest';
import { createPatient } from '@/data/patient/createPatient';
import { getPatient } from '@/data/patient/getPatient';
import { createVisit } from '@/data/visit/createVisit';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useSaveOnWrite } from '@/hooks/useSaveOnWrite';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';
import { FormEvent, useEffect, useState } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function RegistrationPage() {
  const [patientList, setPatientList] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { isLoading, withLoading } = useLoadingState(true);
  const { isLoading: isSubmitting, withLoading: withLoadingSubmit } =
    useLoadingState(false);
  useEffect(() => {
    refreshPatientList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const refreshPatientList = withLoading(() =>
    getPatient().then(setPatientList)
  );

  const [formDetails, setFormDetails, clearLocalStorageData] = useSaveOnWrite(
    'RegistrationForm',
    {} as FieldValues,
    []
  );

  const useFormReturn = useForm({
    values: formDetails,
    resetOptions: { keepDirtyValues: true },
  });

  useEffect(() => {
    const unsub = useFormReturn.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        setFormDetails(values);
      },
    });
    return () => {
      unsub();
      useFormReturn.reset({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPatientRegistrationFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();

    useFormReturn.handleSubmit(
      //onValid
      withLoadingSubmit(async fieldValues => {
        Object.entries(fieldValues).map(([key, value]) =>
          formData.append(key, value)
        );
        formData.append(
          'picture',
          await urlToFile(
            fieldValues.picture,
            'patient_screenshot.jpg',
            'image/jpg'
          )
        );
        const patient = await createPatient(formData);
        if (patient == null) {
          toast.error('Unknown error creating patient');
          return;
        }
        useFormReturn.reset({});
        clearLocalStorageData();

        toast.success('Patient Created!');
        // TODO: implement check for recent visit
        createVisit(patient);
        toast.success('New Visit Created!');
        refreshPatientList();
      }),
      // onInvalid
      () => {
        toast.error('Missing Input');
      }
    )();
  };

  return (
    <div className="p-4">
      <h1>Registration</h1>
      <LoadingPage isLoading={isLoading} message="Loading Patients...">
        <RegistrationAutosuggest
          patientList={patientList}
          setPatient={setSelectedPatient}
        />
        <div className="my-2">
          <div className="flex justify-center">
            <FormProvider {...useFormReturn}>
              <NewPatientModal
                onSubmit={onPatientRegistrationFormSubmit}
                isSubmitting={isSubmitting}
              />
            </FormProvider>
            <PatientScanForm setSelectedPatient={setSelectedPatient} />
          </div>
        </div>
        <PatientInfo patient={selectedPatient} />
      </LoadingPage>
    </div>
  );
}
