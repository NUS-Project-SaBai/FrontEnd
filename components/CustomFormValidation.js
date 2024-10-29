import { useState } from 'react';

export const useCustomFormValidation = initialValidationState => {
  const [customFormValidationState, setCustomFormValidationState] = useState(
    initialValidationState
  );
  const resetCustomFormValidationState = () =>
    setCustomFormValidationState(initialValidationState);
  const setCustomErrorState = (
    fieldName,
    message = customFormValidationState[fieldName].message
  ) => {
    setCustomFormValidationState(prevState => ({
      ...prevState,
      [fieldName]: { hasError: true, message }, // Update with the error and message
    }));
  };
  const hasAnyError = Object.values(customFormValidationState).some(
    field => field.hasError === true
  );

  return {
    customFormValidationState,
    resetCustomFormValidationState,
    setCustomErrorState,
    hasAnyError,
  };
};
