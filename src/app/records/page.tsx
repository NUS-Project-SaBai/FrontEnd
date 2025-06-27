'use client';
import { PatientRecordTable } from '@/app/records/PatientRecordTable';
import { LoadingPage } from '@/components/LoadingPage';
import { PatientSearchInput } from '@/components/PatientSearchbar';
import { PatientInfo } from '@/components/records/patient/PatientInfo';
import { createPatient } from '@/data/patient/createPatient';
import { getPatient } from '@/data/patient/getPatient';
import { createVisit } from '@/data/visit/createVisit';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';
import { FormEvent, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { NewPatientModal } from '../registration/NewPatientModal';
import { PatientScanForm } from '../registration/PatientScanForm';

export default function RecordPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { isLoading: patientsLoading, withLoading: patientsWithLoading } =
    useLoadingState(true);
  const { isLoading: isSubmitting, withLoading: submitWithLoading } =
    useLoadingState(false);
  const useFormReturn = useForm({ resetOptions: { keepDirtyValues: true } });
  const patientModalState = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const refreshPatientList = patientsWithLoading(() =>
    getPatient().then(setPatients)
  );

  const onPatientRegistrationFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    useFormReturn.handleSubmit(
      //onValid
      submitWithLoading(async fieldValues => {
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
        // togglePatientFormOpen(); // can't trigger the modal to open with this configuration
        refreshPatientList();
      }),
      // onInvalid
      () => {
        toast.error('Missing Input');
      }
    )();
  };

  return (
    <div className="flex h-full flex-col overflow-auto">
      <h1 className="-mb-2">Patients</h1>
      <div className="z-1 sticky top-0 bg-white p-2 drop-shadow-lg">
        <div className="flex gap-x-2">
          <PatientSearchInput
            setPatients={setPatients}
            // isLoading={isLoading}
            withLoading={patientsWithLoading}
          />
          <div className="flex h-[40px] gap-2 self-end">
            <FormProvider {...useFormReturn}>
              <NewPatientModal
                onSubmit={onPatientRegistrationFormSubmit}
                isSubmitting={isSubmitting}
                modalState={patientModalState}
              />
            </FormProvider>
            <PatientScanForm setSelectedPatient={setSelectedPatient} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 p-2">
        <LoadingPage
          isLoading={patientsLoading || isSubmitting}
          message="Loading Patients..."
        >
          <PatientInfo patient={selectedPatient} />
          <PatientRecordTable patients={patients} setPatients={setPatients} />
        </LoadingPage>
      </div>
    </div>
  );
}
