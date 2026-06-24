import { useState, useMemo, useCallback } from 'react';
import { PAGE_SIZE } from '../utils/constants';

export const usePagination = (items, pageSize = PAGE_SIZE) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(items.length / pageSize) || 1,
    [items.length, pageSize]
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const resetPage = useCallback(() => setCurrentPage(1), []);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    resetPage,
    showing: {
      start: (currentPage - 1) * pageSize + 1,
      end: Math.min(currentPage * pageSize, items.length),
      total: items.length
    }
  };
};