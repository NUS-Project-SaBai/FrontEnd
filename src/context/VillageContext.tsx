'use client';
import { VillagePrefix } from '@/types/VillagePrefixEnum';
import { createContext, useEffect, useState } from 'react';

export const VillageContext = createContext({
  village: VillagePrefix.ALL,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setVillage: (village: VillagePrefix) => {},
});

export function VillageProvider({ children }: { children: React.ReactNode }) {
  const [village, setVillageState] = useState<VillagePrefix>(VillagePrefix.ALL);
  useEffect(() => {
    const cachedVillage = localStorage.getItem('village');
    if (cachedVillage) {
      setVillageState(cachedVillage as VillagePrefix);
    }
  }, []);
  function setVillage(village: VillagePrefix) {
    localStorage.setItem('village', village);
    setVillageState(village);
  }
  return (
    <VillageContext.Provider value={{ village, setVillage }}>
      {children}
    </VillageContext.Provider>
  );
}
