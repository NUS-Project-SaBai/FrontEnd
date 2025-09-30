'use client';
import { VillageOptionDropdown } from '@/components/VillageOptionDropdown';
import { VillageContext } from '@/context/VillageContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Search bar component to filter patients.
 *
 * @param data - The list of patient-related data to filter
 * @param setFilteredItems - Function to set the result of the filtered list.
 * @param filterFunction - This function receives the search query as a string and returns a function that takes a patient item and returns true if it matches the query.
 */
export function PatientSearchbar<T>({
  data,
  setFilteredItems,
  filterFunction,
  isLoading = false,
}: {
  data: T[];
  filterFunction: (filterString: string) => (item: T) => boolean;
  setFilteredItems: Dispatch<SetStateAction<T[]>>;
  isLoading?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryStr = searchParams.get('query')?.toLowerCase();

  const { village, setVillage } = useContext(VillageContext);

  useEffect(() => {
    if (queryStr) {
      const filter = filterFunction(queryStr);
      const filteredList = data.filter(filter);
      setFilteredItems(filteredList);
    } else {
      setFilteredItems(data);
    }
  }, [queryStr, setFilteredItems, village, data]);

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
