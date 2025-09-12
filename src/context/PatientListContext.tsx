'use client';
import { getPatient } from '@/data/patient/getPatient';
import { useLoadingState, WithLoadingType } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { VillagePrefix } from '@/types/VillagePrefixEnum';
import { createContext, useContext, useEffect, useState } from 'react';
import { VillageContext } from './VillageContext';

export const PatientListContext = createContext<{
  patients: Patient[];
  isLoading: boolean;
  withLoading: WithLoadingType;
}>({
  patients: [],
  isLoading: true,
  withLoading: x => x,
});

export function PatientListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { village } = useContext(VillageContext);
  const { isLoading, withLoading } = useLoadingState(true);

  useEffect(() => {
    withLoading(() =>
      getPatient().then(data => {
        const tmp = data.filter(
          p => village === VillagePrefix.ALL || p.village_prefix === village
        );
        setPatients(tmp);
      })
    )();
  }, [village, withLoading]);

  return (
    <PatientListContext.Provider value={{ patients, isLoading, withLoading }}>
      {children}
    </PatientListContext.Provider>
  );
}
