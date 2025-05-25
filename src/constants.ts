import { VillagePrefix } from './types/VillagePrefixEnum';

type VillageInfo = { key: VillagePrefix; label: string; color: string };

export const VILLAGES: {
  [key in Exclude<VillagePrefix, VillagePrefix.ALL>]: VillageInfo;
} = {
  [VillagePrefix.PC]: {
    key: VillagePrefix.PC,
    label: 'PC',
    color: 'text-red-400',
  },
  [VillagePrefix.CA]: {
    key: VillagePrefix.CA,
    label: 'CA',
    color: 'text-blue-400',
  },
  [VillagePrefix.TT]: {
    key: VillagePrefix.TT,
    label: 'TT',
    color: 'text-green-400',
  },
  [VillagePrefix.TK]: {
    key: VillagePrefix.TK,
    label: 'TK',
    color: 'text-yellow-400',
  },
  [VillagePrefix.SV]: {
    key: VillagePrefix.SV,
    label: 'Smong',
    color: 'text-purple-400',
  },
};

export const VILLAGES_AND_ALL: {
  [key in VillagePrefix]: VillageInfo;
} = {
  [VillagePrefix.ALL]: {
    key: VillagePrefix.ALL,
    label: 'ALL',
    color: 'text-black-400',
  },
  ...VILLAGES,
};
