import { VillagePrefix } from './types/VillagePrefixEnum';

type VillageInfo = { key: VillagePrefix; label: string; color: string };

export const VILLAGES: VillageInfo[] = [
  { key: VillagePrefix.PC, label: 'PC', color: 'text-red-300' },
  { key: VillagePrefix.CA, label: 'CA', color: 'text-blue-300' },
  { key: VillagePrefix.TT, label: 'TT', color: 'text-green-300' },
  { key: VillagePrefix.TK, label: 'TK', color: 'text-yellow-300' },
  { key: VillagePrefix.SV, label: 'Smong', color: 'text-purple-300' },
];
