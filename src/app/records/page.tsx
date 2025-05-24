'use client';
import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
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
    </div>
  );
}
