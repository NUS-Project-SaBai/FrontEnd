'use client';
import { Patient } from '@/types/Patient';
import { Suspense, useState } from 'react';
import { PatientSearchInput } from '../../components/PatientSearchbar';
import { PatientRecordTable } from './PatientRecordTable';

export default function RecordPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  return (
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
