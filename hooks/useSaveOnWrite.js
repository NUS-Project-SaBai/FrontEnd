import { useState, useEffect } from 'react';

export default function useSaveOnWrite(
  name,
  initialFormDetails,
  dependencies = []
) {
  const [formDetails, setFormDetails] = useState(initialFormDetails);

  // Generate the storage key dynamically based on dependencies
  const generateStorageKey = () => {
    const dependencyKey = dependencies
      .map((dep, index) => `dep${index + 1}=${dep}`)
      .join('_');
    return `current_${name}_form_details_${dependencyKey}`;
  };

  const storageKey = generateStorageKey();

  // Load saved data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      console.log(savedData);
      setFormDetails(JSON.parse(savedData));
    }
  }, dependencies);

  // Save registration form data to localStorage whenever it changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(formDetails));
    }, 500);
    return () => clearTimeout(timeout);
  }, [...dependencies, formDetails]);

  // Purge data from localStorage on successful submit
  const clearLocalStorageData = () => {
    localStorage.removeItem(storageKey);
    setFormDetails(initialFormDetails);
  };

  return [formDetails, setFormDetails, clearLocalStorageData];
}
