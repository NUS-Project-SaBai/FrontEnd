'use client';
import { PatientRecordTable } from '@/app/records/PatientRecordTable';
import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
import { PatientSearchInput } from '@/components/PatientSearchbar';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { Suspense, useState } from 'react';

export default function RecordPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { isLoading, withLoading } = useLoadingState(true);

  return (
    <div className="p-2">
      <div className="z-1 sticky top-0 w-full bg-white">
        <h1>Patients List</h1>
        <Suspense fallback={<LoadingUI message="Loading search input..." />}>
          <PatientSearchInput
            setPatients={setPatients}
            isLoading={isLoading}
            withLoading={withLoading}
          />
        </Suspense>
      </div>
      <LoadingPage isLoading={isLoading} message="Loading Patients...">
        <PatientRecordTable patients={patients} />
      </LoadingPage>
    </div>
  );
}
