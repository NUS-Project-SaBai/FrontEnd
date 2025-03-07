// context/VillageContext.js
import { createContext, useContext, useEffect, useState } from 'react';

export const VillageContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const VillageProvider = ({ children }) => {
  const [village, setVillageState] = useState('ALL');

  useEffect(() => {
    const cachedVillage = localStorage.getItem('village');
    cachedVillage && setVillageState(cachedVillage);
  }, []);

  function setVillage(village) {
    localStorage.setItem('village', village);
    setVillageState(village);
  }

  return (
    <VillageContext.Provider value={{ village, setVillage }}>
      {children}
    </VillageContext.Provider>
  );
};
