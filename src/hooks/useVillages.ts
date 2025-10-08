// Custom React hook for fetching village data from API (only visible villages)
import { axiosClientInstance } from '@/lib/axiosClientInstance';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface Village {
  id: number;
  village_name: string;
  colour_code: string;
  is_hidden: boolean;
}

export const useVillages = () => {
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch only visible villages from API
    const fetchVillages = async () => {
      try {
        const response = await axiosClientInstance.get('/villages/'); // Get visible villages only
        setVillages(response.data);
      } catch (err) {
        // Handle different error types
        if (err instanceof AxiosError) {
          setError(
            err.response?.data?.message ||
              err.message ||
              'Failed to fetch villages'
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch villages');
        }
      } finally {
        setLoading(false); // Always stop loading when request completes
      }
    };

    fetchVillages(); // Execute fetch on component mount
  }, []); // Empty dependency array = run once on mount

  return { villages, loading, error }; // Return current state
};
