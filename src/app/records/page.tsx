'use client';
import { Patient } from '@/types/Patient';
import { useState } from 'react';
import { PatientSearchInput } from '../../components/PatientSearchbar';
import { PatientRecordTable } from './PatientRecordTable';

export default function RecordPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  return (
    <div className="p-2">
      <h1>Patients List</h1>

      <PatientSearchInput setPatients={setPatients} />
      <PatientRecordTable patients={patients} />
    </div>
  );
}
