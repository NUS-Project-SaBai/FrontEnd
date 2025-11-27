import { useEffect, useState } from 'react';

/**
 * Custom hook to save form details to localStorage and retrieve them on component mount.
 *
 * @param name - The name of the form, used to create a unique key for localStorage.
 * @param initialFormDetails - The initial form details to set when the component mounts.
 * @param dependencies - An array of dependencies that, when changed, will trigger a re-save of the form details.
 * @returns [formDetails, setFormDetails, clearLocalStorageData]
 */
export function useSaveOnWrite<T extends object>(
  name: string,
  initialFormDetails: T,
  dependencies: unknown[] = []
) {
  const [formDetails, setFormDetails] = useState<T>(initialFormDetails);

  const storageKey: string = `${name}_form_details_${dependencies.map((dep, index) => `dep${index + 1}=${dep}`).join('_')}`;
  // Load saved data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      setFormDetails(JSON.parse(savedData));
    }
  }, [storageKey]);

  // Save registration form data to localStorage whenever it changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(formDetails));
    }, 500);
    return () => clearTimeout(timeout);
  }, [formDetails, storageKey]);

  // Purge data from localStorage on successful submit
  const clearLocalStorageData = () => {
    localStorage.removeItem(storageKey);
    setFormDetails(initialFormDetails);
  };

  return [formDetails, setFormDetails, clearLocalStorageData] as [
    T,
    typeof setFormDetails,
    () => void,
  ];
}
