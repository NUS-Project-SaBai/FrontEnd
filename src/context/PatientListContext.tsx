'use client';
import { getPatient } from '@/data/patient/getPatient';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { VillagePrefix } from '@/types/VillagePrefixEnum';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { VillageContext } from './VillageContext';

export const PatientListContext = createContext<{
  patients: Patient[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  setPatients: Dispatch<SetStateAction<Patient[]>>;
}>({
  patients: [],
  isLoading: true,
  refresh: async () => {},
  setPatients: () => {},
});

export function PatientListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { village } = useContext(VillageContext);
  const { isLoading, withLoading } = useLoadingState(true);

  const refresh = useCallback(
    () =>
      withLoading(() =>
        getPatient().then(data => {
          const tmp = data.filter(
            p => village === VillagePrefix.ALL || p.village_prefix === village
          );
          setPatients(tmp);
        })
      )(),
    [village]
  );

  useEffect(() => {
    refresh();
  }, [village, refresh]);

  return (
    <PatientListContext.Provider
      value={{ patients, isLoading, refresh, setPatients }}
    >
      {children}
    </PatientListContext.Provider>
  );
}
