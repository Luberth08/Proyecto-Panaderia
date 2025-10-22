// src/hooks/useSearch.js
import { useState, useMemo } from 'react';
import { debounce } from '../utils/helpers';

export const useSearch = (data = [], searchFields = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Debounced search para mejor performance
  const debouncedSearch = debounce(handleSearch, 300);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    setIsSearching(true);
    const lowercasedSearch = searchTerm.toLowerCase().trim();

    const filtered = data.filter(item =>
      searchFields.some(field => {
        const fieldValue = item[field];
        if (!fieldValue) return false;
        
        return fieldValue.toString().toLowerCase().includes(lowercasedSearch);
      })
    );

    setIsSearching(false);
    return filtered;
  }, [data, searchTerm, searchFields]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return {
    searchTerm,
    filteredData,
    isSearching,
    handleSearch: debouncedSearch,
    clearSearch,
    setSearchTerm
  };
};

// Hook específico para búsqueda en tablas CRUD
export const useCRUDSearch = (data = [], defaultSearchFields = ['nombre']) => {
  const search = useSearch(data, defaultSearchFields);

  const noResultsMessage = search.searchTerm && search.filteredData.length === 0 
    ? `No se encontraron resultados para "${search.searchTerm}"`
    : 'No hay datos registrados';

  return {
    ...search,
    noResultsMessage
  };
};