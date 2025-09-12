'use client';

import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
import { PatientSearchbar } from '@/components/PatientSearchbar';
import { PatientGlassesTable } from '@/components/vision/PatientGlassesTable';
import { PatientListContext } from '@/context/PatientListContext';
import { Patient } from '@/types/Patient';
import { Suspense, useContext, useState } from 'react';

export default function VisionPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { patients: allPatients, isLoading } = useContext(PatientListContext);

  return (
    <div className="p-4">
      <h1>Vision</h1>
      <Suspense fallback={<LoadingUI message="Loading search input..." />}>
        <PatientSearchbar
          data={allPatients}
          setFilteredItems={setPatients}
          filterFunction={query => item =>
            item.patient_id.toLowerCase().includes(query.toLowerCase()) ||
            item.name.toLowerCase().includes(query.toLowerCase())
          }
        />
      </Suspense>
      <LoadingPage isLoading={isLoading} message="Loading Patients...">
        <PatientGlassesTable patients={patients} />
      </LoadingPage>
    </div>
  );
}
