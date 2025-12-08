'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VILLAGES, VILLAGES_AND_ALL } from '@/constants';
import { VillagePrefix } from '@/types/VillagePrefixEnum';
import { useEffect, useMemo } from 'react';

type Props = {
  village: VillagePrefix;
  handleVillageChange: (villagePrefix: VillagePrefix) => void;
  label?: string;
  required?: boolean;
  excludeALLOption?: boolean;
  dropdownClassName?: string;
};

export function VillageOptionDropdown({
  village,
  handleVillageChange,
  label = 'Village:',
  required = false,
  excludeALLOption = false,
  dropdownClassName = '',
}: Props) {
  const dict = excludeALLOption ? VILLAGES : VILLAGES_AND_ALL;

  const items = useMemo(() => Object.values(dict), [dict]);
  const hasValue = items.some(o => o.key === village);

  // If current value isn't available (e.g. ALL excluded), pick first available
  useEffect(() => {
    if (!items.length) return;
    if (!hasValue) handleVillageChange(items[0].key as VillagePrefix);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasValue, items.length]);

  const triggerTextColor =
    village === VillagePrefix.ALL
      ? 'text-gray-800'
      : (dict[village]?.color ?? 'text-gray-900');

  if (!items.length) {
    return (
      <div className="text-sm font-semibold">
        <label className="block">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <div className="text-gray-500">No villages available</div>
      </div>
    );
  }

  return (
    <div className="text-sm font-semibold">
      <label htmlFor="village_prefix" className="block">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <Select
        value={hasValue ? village : ""}
        onValueChange={val => handleVillageChange(val as VillagePrefix)}
      >
        <SelectTrigger
          id="village_prefix"
          className={`w-full rounded border-2 bg-white p-1 ${triggerTextColor} ${dropdownClassName}`}
        >
          <SelectValue placeholder={"Select village or set current village"}/>
        </SelectTrigger>

        <SelectContent className="border bg-white text-gray-900">
          {items.map(({ key, label, color }) => (
            <SelectItem
              key={key}
              value={key}
              className={`font-semibold ${color}`}
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
