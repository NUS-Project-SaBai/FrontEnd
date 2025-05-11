'use client';
import { Button } from '@/components/Button';
import { PatientInfo } from '@/components/records/PatientInfo';
import { createPatient } from '@/data/patient/createPatient';
import { getPatient } from '@/data/patient/getPatient';
import { createVisit } from '@/data/visit/createVisit';
import { useToggle } from '@/hooks/useToggle';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';
import { FormEvent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';
import { PatientForm } from '../../components/records/PatientForm';
import { PatientScanForm } from './PatientScanForm';
import { RegistrationAutosuggest } from './RegistrationAutosuggest';

export default function RegistrationPage() {
  const useFormReturn = useForm({ resetOptions: { keepDirtyValues: true } });
  const [isPatientFormOpen, togglePatientFormOpen] = useToggle(false);
  const [patientList, setPatientList] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  useEffect(() => {
    refreshPatientList();
  }, []);
  function refreshPatientList() {
    getPatient().then(setPatientList);
  }

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
        refreshPatientList();
      },
      // onInvalid
      () => {
        toast.error('Missing Input');
      }
    )();
  };

  return (
    <div className="p-4">
      <h1>Registration</h1>
      <RegistrationAutosuggest
        patientList={patientList}
        setPatient={setSelectedPatient}
      />
      <div className="my-2">
        <div className="flex justify-center">
          <Button
            colour="green"
            onClick={togglePatientFormOpen}
            text={'New Patient'}
          />
          <PatientScanForm setSelectedPatient={setSelectedPatient} />
        </div>
        <ReactModal isOpen={isPatientFormOpen} ariaHideApp={false}>
          <FormProvider {...useFormReturn}>
            <PatientForm onSubmit={onPatientRegistrationFormSubmit} />
          </FormProvider>
          <Button colour="red" onClick={togglePatientFormOpen} text="Close" />
        </ReactModal>
      </div>
      <PatientInfo patient={selectedPatient} />
    </div>
  );
}
