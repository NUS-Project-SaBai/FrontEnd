'use client';

import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
import { PatientSearchInput } from '@/components/PatientSearchbar';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { Suspense, useState } from 'react';
import { PatientGlassesTable } from './PatientGlassesTable';

export default function VisionPage() {
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
