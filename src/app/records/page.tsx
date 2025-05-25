'use client';
import { PatientSearchInput } from '@/components/PatientSearchbar';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { Suspense, useState } from 'react';
import { PatientRecordTable } from './PatientRecordTable';

export default function RecordPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { isLoading, withLoading } = useLoadingState(true);

  return (
    <div className="p-2">
      <h1>Patients List</h1>
      <Suspense fallback={<LoadingUI message="Loading search input..." />}>
        <PatientSearchInput
          setPatients={setPatients}
          isLoading={isLoading}
          withLoading={withLoading}
        />
      </Suspense>
      <LoadingPage isLoading={isLoading} message="Loading Patients...">
        <PatientRecordTable patients={patients} />
      </LoadingPage>
    <div className="flex h-screen flex-col p-2 pb-5">
      {/* Sticky header for the search input */}
      <div className="z-1 sticky left-0 top-0 w-full bg-white pb-2">
        <h1>Patients List test</h1>
        <Suspense>
          <PatientSearchInput setPatients={setPatients} />
        </Suspense>
      </div>
      <div className="flex-1">
        <PatientRecordTable patients={patients} />
      </div>
    </div>
  );
}
