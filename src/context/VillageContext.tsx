'use client';
import { ALL_VILLAGES } from '@/types/VillageTypes';
import { createContext, useEffect, useState } from 'react';

// Update to use string instead of VillagePrefix enum
export const VillageContext = createContext({
  village: ALL_VILLAGES,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setVillage: (village: string) => {},
});

export function VillageProvider({ children }: { children: React.ReactNode }) {
  // Change from VillagePrefix to string
  const [village, setVillageState] = useState<string>('ALL');
  // Load cached village selection from localStorage on mount
  useEffect(() => {
    const cachedVillage = localStorage.getItem('village');
    if (cachedVillage) {
      setVillageState(cachedVillage);
    }
  }, []);
  // Update village and persist to localStorage
  function setVillage(village: string) {
    localStorage.setItem('village', village);
    setVillageState(village);
  }
  return (
    <VillageContext.Provider value={{ village, setVillage }}>
      {children}
    </VillageContext.Provider>
  );
}
