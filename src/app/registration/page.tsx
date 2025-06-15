'use client';
import { LoadingPage } from '@/components/LoadingPage';
import { PatientInfo } from '@/components/records/patient/PatientInfo';
import { createPatient } from '@/data/patient/createPatient';
import { getPatient } from '@/data/patient/getPatient';
import { createVisit } from '@/data/visit/createVisit';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';
import { FormEvent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { NewPatientModal } from './NewPatientModal';
import { PatientScanForm } from './PatientScanForm';
import { RegistrationAutosuggest } from './RegistrationAutosuggest';

export default function RegistrationPage() {
  const useFormReturn = useForm({ resetOptions: { keepDirtyValues: true } });
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

  const onPatientRegistrationFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    useFormReturn.handleSubmit(
      //onValid
      withLoadingSubmit(async fieldValues => {
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
        useFormReturn.reset();
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
