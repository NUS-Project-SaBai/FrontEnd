import { VillageContext } from '@/context/VillageContext';
import { useContext, useEffect, useState } from 'react';

export const VILLAGE_CODE_ALL = 'ALL';

export default function useCachedVillageCode() {
  const { village } = useContext(VillageContext);
  const [villageCode, setVillageCode] = useState(village);
  useEffect(() => {
    setVillageCode(village);
  }, [village]);

  return [villageCode, setVillageCode];
}
