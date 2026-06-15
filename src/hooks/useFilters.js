import { useState, useMemo } from 'react';

export const useFilters = (items, searchKeys = []) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    let result = filter === 'all' 
      ? items 
      : items.filter(item => item.status === filter || item.payment_status === filter);

    if (searchTerm && searchKeys.length) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        searchKeys.some(key => 
          String(item[key] || '').toLowerCase().includes(term)
        )
      );
    }

    return result;
  }, [items, filter, searchTerm, searchKeys]);

  return {
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    filteredItems
  };
};