import { useState } from 'react';

export const useFormValidation = initialValidationState => {
  const [formValidationState, setFormValidationState] = useState(
    initialValidationState
  );
  const resetFormValidationState = () =>
    setFormValidationState(initialValidationState);
  const setErrorState = (
    fieldName,
    message = formValidationState[fieldName].message
  ) => {
    setFormValidationState(prevState => ({
      ...prevState,
      [fieldName]: { hasError: true, message }, // Update with the error and message
    }));
  };
  const hasAnyError = Object.values(formValidationState).some(
    field => field.hasError === true
  );

  return {
    formValidationState,
    resetFormValidationState,
    setErrorState,
    hasAnyError,
  };
};
