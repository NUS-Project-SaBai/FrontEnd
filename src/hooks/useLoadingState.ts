import { useCallback, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithLoadingType = <T, Args extends any[]>(
  asyncFunc: (...args: Args) => Promise<T>
) => (...args: Args) => Promise<T>;
/**
 * Custom hook to manage loading states with a standardized UI
 * @function
 * @param initialState - The initial loading state (default: false)
 * @returns An object containing:
 * - isLoading: current loading state
 * - withLoading: (asyncFunc) => async (...args) => ReturnType\<asyncFunc\>
 *                function wrapper to handle loading state automatically
 */
export function useLoadingState(initialState = false): {
  isLoading: boolean;
  withLoading: WithLoadingType;
} {
  const [isLoading, setIsLoading] = useState<boolean>(initialState);

  /**
   * Wrap an async function with loading state management
   * @param asyncFunc - The async function to wrap
   * @returns The wrapped function that handles loading state
   */

  // useCallback is required here when withLoading is passed as a dependency to useEffect (e.g., in PatientListContext).
  // Without useCallback, a new function would be created on every render, causing infinite loops or unnecessary re-executions.
  const withLoading: WithLoadingType = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function <T, Args extends any[]>(asyncFunc: (...args: Args) => Promise<T>) {
      return async (...args: Args): Promise<T> => {
        setIsLoading(true);
        try {
          return await asyncFunc(...args);
        } finally {
          setIsLoading(false);
        }
      };
    },
    []
  );

  return {
    isLoading,
    withLoading,
  };
}
