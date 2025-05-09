'use client';
import { VillageContext } from '@/context/VillageContext';
import { getPatient } from '@/data/patient/getPatient';
import { Patient } from '@/types/Patient';
import { VillagePrefix } from '@/types/VillagePrefixEnum';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { VillageOptionDropdown } from './VillageOptionDropdown';

export function PatientSearchInput({
  setPatients,
}: {
  setPatients: Dispatch<SetStateAction<Patient[]>>;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryStr = useSearchParams().get('query')?.toLowerCase();

  const [fullPatientList, setFullPatientList] = useState<Patient[]>([]);
  const { village, setVillage } = useContext(VillageContext);

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
  }, [fullPatientList, queryStr, setPatients, village]);

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
    <div className="flex gap-x-2">
      <VillageOptionDropdown
        village={village}
        handleVillageChange={setVillage}
        label="Search by Village"
      />
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
    </div>
  );
}
