'use client';
import { VillageContext } from '@/context/VillageContext';
import { WithLoadingType } from '@/hooks/useLoadingState';
import { VillagePrefix } from '@/types/VillagePrefixEnum';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { VillageOptionDropdown } from '../VillageOptionDropdown';

import {
  getReferrals,
  ReferralWithDetails,
} from '@/data/referrals/getReferrals';

export function PatientSearchInputByReferral({
  setReferrals,
  isLoading = false,
  withLoading = x => x,
}: {
  setReferrals: Dispatch<SetStateAction<ReferralWithDetails[]>>;
  isLoading?: boolean;
  withLoading?: WithLoadingType;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryStr = searchParams.get('query')?.toLowerCase();

  const [fullReferralList, setFullReferralList] = useState<
    ReferralWithDetails[]
  >([]);
  const { village, setVillage } = useContext(VillageContext);
  useEffect(() => {
    withLoading(getReferrals)().then(setFullReferralList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filteredList = fullReferralList;

    if (village != VillagePrefix.ALL) {
      filteredList = filteredList.filter(
        r => r.patient.village_prefix == village
      );
    }

    if (queryStr) {
      filteredList = filteredList.filter(r =>
        r.patient.filter_string.toLowerCase().includes(queryStr)
      );
    }

    setReferrals(filteredList);
  }, [fullReferralList, queryStr, setReferrals, village]);

  const debouncedSearch = useDebouncedCallback(query => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="flex gap-x-2">
      <VillageOptionDropdown
        village={village}
        handleVillageChange={setVillage}
        label="Search by Village"
      />
      <div className="flex-grow">
        <label htmlFor="patientSearch" className="block">
          Input Patient ID/Name to search
        </label>
        <input
          id="patientSearch"
          className="w-full disabled:bg-gray-200"
          defaultValue={searchParams.get('query')?.toString()}
          placeholder={isLoading ? 'Loading patients...' : ''}
          disabled={isLoading}
          onChange={e => {
            debouncedSearch(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
