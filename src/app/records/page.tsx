'use client';
import { PatientRecordTable } from '@/app/records/PatientRecordTable';
import { Button } from '@/components/Button';
import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
import { PatientSearchInput } from '@/components/PatientSearchbar';
import { PatientForm } from '@/components/records/patient/PatientForm';
import { PatientInfo } from '@/components/records/patient/PatientInfo';
import { createPatient } from '@/data/patient/createPatient';
import { createVisit } from '@/data/visit/createVisit';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useToggle } from '@/hooks/useToggle';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';
import { FormEvent, Suspense, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';
import { PatientScanForm } from '../registration/PatientScanForm';

export default function RecordPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { isLoading, withLoading } = useLoadingState(true);
  const useFormReturn = useForm({ resetOptions: { keepDirtyValues: true } });
  const [isPatientFormOpen, togglePatientFormOpen] = useToggle(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const onPatientRegistrationFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    useFormReturn.handleSubmit(
      //onValid
      async fieldValues => {
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
        togglePatientFormOpen();
        // refreshPatientList();
      },
      // onInvalid
      () => {
        toast.error('Missing Input');
      }
    )();
  };

  return (
    <div className="p-2">
      <div className="z-1 sticky top-0 w-full bg-white">
        <h1>Patients List</h1>
        <div className="flex gap-x-2">
          <Suspense fallback={<LoadingUI message="Loading search input..." />}>
            <PatientSearchInput
              setPatients={setPatients}
              isLoading={isLoading}
              withLoading={withLoading}
            />
          </Suspense>
        </div>
      </div>
      <LoadingPage isLoading={isLoading} message="Loading Patients...">
        <div className="flex flex-shrink">
          <Button
            colour="green"
            onClick={togglePatientFormOpen}
            text={'New Patient'}
          />
          <PatientScanForm setSelectedPatient={setSelectedPatient} />
        </div>
        <PatientInfo patient={selectedPatient} />
        <PatientRecordTable patients={patients} />
      </LoadingPage>
      <ReactModal isOpen={isPatientFormOpen} ariaHideApp={false}>
        <FormProvider {...useFormReturn}>
          <PatientForm onSubmit={onPatientRegistrationFormSubmit} />
        </FormProvider>
        <Button colour="red" onClick={togglePatientFormOpen} text="Close" />
      </ReactModal>
    </div>
  );
}
