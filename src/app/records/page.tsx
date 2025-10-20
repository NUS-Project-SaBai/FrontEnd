'use client';
import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
import { PatientSearchbar } from '@/components/PatientSearchbar';
import { PatientRecordTable } from '@/components/records/PatientRecordTable';
import { PatientListContext } from '@/context/PatientListContext';
import { Patient } from '@/types/Patient';
import { Suspense, useCallback, useContext, useState } from 'react';

export default function RecordPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { patients: allPatients, isLoading } = useContext(PatientListContext);

  // Memoize filter function to prevent unnecessary re-renders in PatientSearchbar
  const filterFunction = useCallback(
    (query: string) => (item: Patient) =>
      item.patient_id.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase()),
    [] // Empty dependency array, filter logic never changes
  );

  return (
    <div className="p-2">
      <div className="z-1 sticky top-0 w-full bg-white">
        <h1>Patients List</h1>
        <Suspense fallback={<LoadingUI message="Loading search input..." />}>
          <PatientSearchbar
            data={allPatients}
            setFilteredItems={setPatients}
            filterFunction={filterFunction}
            isLoading={isLoading}
          />
        </Suspense>
      </div>
      <LoadingPage isLoading={isLoading} message="Loading Patients...">
        <PatientRecordTable patients={patients} />
      </LoadingPage>
    </div>
  );
}
