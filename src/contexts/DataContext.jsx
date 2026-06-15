// src/contexts/DataContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { catalogAPI } from '@services/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const data = await catalogAPI.getCategories();
      if (data.status === 'success' && data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  const fetchBrands = useCallback(async (categoryId) => {
    if (!categoryId) { setBrands([]); return; }
    setIsLoadingBrands(true);
    try {
      const data = await catalogAPI.getBrands(categoryId);
      if (data.status === 'success' && data.brands) {
        setBrands(data.brands);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      setBrands([]);
    } finally {
      setIsLoadingBrands(false);
    }
  }, []);

  const fetchAllBrands = useCallback(async () => {
    try {
      const data = await catalogAPI.getAllBrands();
      if (data.status === 'success' && data.brands) return data.brands;
      return [];
    } catch (error) {
      console.error('Failed to fetch all brands:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    categories,
    brands,
    isLoadingCategories,
    isLoadingBrands,
    fetchCategories,
    fetchBrands,
    fetchAllBrands,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// ✅ हे नवीन add केलं
export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
};