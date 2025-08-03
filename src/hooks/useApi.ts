import { useState, useEffect } from 'react';
import { ApiResponse } from '@/shared/types';

interface UseApiOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(options: UseApiOptions<T>) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(options.url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const result: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Une erreur est survenue');
      }

      if (result.success && result.data) {
        setState({ data: result.data, loading: false, error: null });
        options.onSuccess?.(result.data);
      } else {
        throw new Error(result.message || 'Une erreur est survenue');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      setState({ data: null, loading: false, error: errorMessage });
      options.onError?.(errorMessage);
    }
  };

  return {
    ...state,
    execute,
  };
}

export function useApiGet<T>(url: string) {
  const { data, loading, error, execute } = useApi<T>({ url });

  useEffect(() => {
    execute();
  }, [url]);

  return { data, loading, error, refetch: execute };
} 