import { VillageContext } from '@/context/VillageContext';
import { useContext, useEffect, useState } from 'react';

export const VILLAGE_CODE_ALL = 'ALL';

export default function useCachedVillageCode() {
  const [villageCode, setVillageCode] = useState(VILLAGE_CODE_ALL);
  const { village } = useContext(VillageContext);
  useEffect(() => {
    setVillageCode(village);
  }, [village]);

  return [villageCode, setVillageCode];
}
