// src/hooks/useApi.js - Generic API Hook with loading/error states

import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for API calls with automatic loading and error state management
 *
 * @param {Function} apiFunction - The API function to call
 * @param {boolean} executeOnMount - Whether to execute the API call on component mount
 * @param {Array} dependencies - Dependencies array for re-executing the API call
 *
 * @returns {Object} { data, loading, error, execute, reset }
 *
 * @example
 * const { data, loading, error, execute } = useApi(
 *   () => workoutService.getWorkoutPlans(),
 *   true // execute on mount
 * );
 */
export const useApi = (apiFunction, executeOnMount = false, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(executeOnMount);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (executeOnMount) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, execute, reset };
};

/**
 * Hook for paginated API calls
 *
 * @param {Function} apiFunction - The API function to call
 * @param {Object} initialParams - Initial pagination parameters
 *
 * @example
 * const { data, loading, page, setPage, hasMore } = usePaginatedApi(
 *   (page, limit) => workoutService.getWorkoutLogs(limit, page),
 *   { page: 1, limit: 20 }
 * );
 */
export const usePaginatedApi = (apiFunction, initialParams = { page: 1, limit: 20 }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialParams.page);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(page, initialParams.limit);

      if (Array.isArray(result)) {
        setData(prev => [...prev, ...result]);
        setHasMore(result.length === initialParams.limit);
      } else {
        setData(prev => [...prev, ...result.items]);
        setHasMore(result.hasMore);
      }

      setPage(prev => prev + 1);
    } catch (err) {
      setError(err);
      console.error('Pagination Error:', err);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, initialParams.limit]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialParams.page);
    setHasMore(true);
    setError(null);
  }, [initialParams.page]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    loading,
    error,
    page,
    setPage,
    hasMore,
    loadMore,
    reset,
  };
};

export default useApi;
