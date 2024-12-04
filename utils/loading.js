import { useLoading } from '@/context/LoadingContext';

function useWithLoading(asyncFunction) {
  const { setLoading } = useLoading();

  return async function (...args) {
    setLoading(true);
    try {
      await asyncFunction(...args);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };
}

export default useWithLoading;
