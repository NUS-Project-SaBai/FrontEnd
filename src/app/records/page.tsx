'use client';
import { VillageOptionDropdown } from '@/components/VillageOptionDropdown';
import { VillageContext } from '@/context/VillageContext';
import { getPatient } from '@/data/patient/getPatient';
import { Patient } from '@/types/Patient';
import { VillagePrefix } from '@/types/VillagePrefixEnum';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { PatientRecordTable } from './PatientRecordTable';

export default function RecordPage() {
  const { village, setVillage } = useContext(VillageContext);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [fullPatientList, setFullPatientList] = useState<Patient[]>([]);

  const queryStr = useSearchParams().get('query')?.toLowerCase();

  useEffect(() => {
    getPatient().then(setFullPatientList);
  }, []);

  useEffect(() => {
    let filteredList =
      village == VillagePrefix.ALL
        ? fullPatientList
        : fullPatientList.filter(p => p.village_prefix == village);
    if (queryStr) {
      filteredList = filteredList.filter(p =>
        p.filter_string.toLowerCase().includes(queryStr)
      );
    }
    setPatients(filteredList);
  }, [fullPatientList, queryStr, village]);

  return (
    <div className="p-2">
      <h1>Patients List</h1>
      <div className="flex gap-x-2">
        <VillageOptionDropdown
          village={village}
          handleVillageChange={setVillage}
          label="Search by Village"
        />

        <PatientSearchInput />
      </div>
      <PatientRecordTable patients={patients} />
    </div>
  );
}

function PatientSearchInput() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const debouncedSearch = useDebouncedCallback(query => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="flex-grow">
      <label htmlFor="patientSearch" className="block">
        Input Patient ID/Name to search
      </label>
      <input
        id="patientSearch"
        className="w-full"
        defaultValue={searchParams.get('query')?.toString()}
        onChange={e => {
          debouncedSearch(e.target.value);
        }}
      />
    </div>
  );
}
