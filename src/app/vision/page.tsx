'use client';

// Shared Components
import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
//import { PatientInfo } from '@/components/records/patient/PatientInfo';
import { PatientSearchInput } from '@/components/PatientSearchbar';

// Patient Components
//import { createPatient } from '@/data/patient/createPatient';
//import { getPatient } from '@/data/patient/getPatient';
//import { createVisit } from '@/data/visit/createVisit';

import { useLoadingState } from '@/hooks/useLoadingState';

import { Patient } from '@/types/Patient';
//import { urlToFile } from '@/utils/urlToFile';

import { Suspense, useState } from 'react';
//import { useForm } from 'react-hook-form';
//import toast from 'react-hot-toast';
import { PatientGlassesTable } from './PatientGlassesTable';

export default function RegistrationPage() {
  //const useFormReturn = useForm({ resetOptions: { keepDirtyValues: true } });
  //const [patientList, setPatientList] = useState<Patient[]>([]);
  //const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const { isLoading, withLoading } = useLoadingState(true);

  return (
    <div className="p-4">
      <h1>Vision</h1>
      <Suspense fallback={<LoadingUI message="Loading search input..." />}>
        <PatientSearchInput
          setPatients={setPatients}
          isLoading={isLoading}
          withLoading={withLoading}
        />
      </Suspense>
      <LoadingPage isLoading={isLoading} message="Loading Patients...">
        <PatientGlassesTable patients={patients} />
      </LoadingPage>
    </div>
  );
}
