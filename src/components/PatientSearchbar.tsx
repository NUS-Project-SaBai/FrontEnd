'use client';
import { VillageOptionDropdown } from '@/components/VillageOptionDropdown';
import { VillageContext } from '@/context/VillageContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Search bar component to filter patients.
 *
 * @param data - The list of patient-related data to filter
 * @param setFilteredItems - Function to set the result of the filtered list.
 * @param filterFunction - This function receives the search query as a string and returns a function
 *                        that takes a patient item and returns true if it matches the query. It might
 *                        need to be wrapped with useCallback to avoid unnecessary re-renders.
 */
export function PatientSearchbar<T>({
  data,
  setFilteredItems,
  filterFunction,
  filteringByFace,
  cancelFilteringByFace,
}: {
  data: T[];
  filterFunction: (filterString: string) => (item: T) => boolean;
  setFilteredItems: Dispatch<SetStateAction<T[]>>;
  filteringByFace?: boolean;
  cancelFilteringByFace?: Dispatch<SetStateAction<boolean>>;
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
  }, [queryStr, setFilteredItems, filterFunction, village, data]);

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
    <div className="flex flex-grow gap-x-2">
      <VillageOptionDropdown
        village={village}
        handleVillageChange={setVillage}
        label="Search by Village"
      />
      <div className="flex-grow">
        <label htmlFor="patientSearch" className="block">
          Input Patient ID/Name to search
        </label>
        <div className="flex h-[40px] flex-grow flex-row items-center rounded-lg border-2 border-gray-300 disabled:bg-gray-200">
          {cancelFilteringByFace && filteringByFace && (
            <div className="mx-1 flex h-[30px] items-center rounded-full bg-gray-300 px-2">
              Filtering by scanned face
              <button className="hover">
                <XMarkIcon
                  onClick={() => cancelFilteringByFace(false)}
                  className="ml-1 h-4 w-4"
                />
              </button>
            </div>
          )}
          <input
            id="patientSearch"
            className="h-full flex-grow border-0"
            defaultValue={searchParams.get('query')?.toString()}
            onChange={e => {
              debouncedSearch(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
