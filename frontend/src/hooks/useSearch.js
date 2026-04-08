import { useSearchParams } from 'react-router-dom';

/**
 * useSearch — reads from / writes to URL search params.
 * Usage:
 *   const { from, to, date, setParam } = useSearch();
 *   setParam('sort', 'price_asc');
 */
export default function useSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === null || value === undefined) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const setParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    });
    setSearchParams(next);
  };

  return { from, to, date, searchParams, setParam, setParams };
}
