// src/hooks/useSearch.js
import { useState, useEffect, useMemo } from 'react';
import { debounce } from '../utils/helpers';

export const useSearch = (data = [], searchFields = []) => {
  const [searchTerm, setSearchTerm] = useState('');       // Lo que escribe el usuario (INSTANTÁNEO)
  const [searchValue, setSearchValue] = useState('');     // Lo que se usa para filtrar (DEBOUNCEADO)

  // Debounce REAL: aplica retraso solo al valor que filtra, no al input
  const debouncedUpdate = useMemo(
    () =>
      debounce((value) => {
        setSearchValue(value);
      }, 300),
    []
  );

  const handleSearch = (value) => {
    setSearchTerm(value);       // ← actualiza input INSTANTÁNEO
    debouncedUpdate(value);     // ← filtra con retraso suave
  };

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return data;

    const lower = searchValue.toLowerCase().trim();

    return data.filter((item) =>
      searchFields.some((field) => {
        const fieldValue = item[field];
        if (!fieldValue) return false;
        return fieldValue.toString().toLowerCase().includes(lower);
      })
    );
  }, [data, searchValue, searchFields]);

  return {
    searchTerm,
    filteredData,
    handleSearch,
  };
};

// Wrapper para CRUD
export const useCRUDSearch = (data = [], defaultSearchFields = ['nombre']) => {
  const search = useSearch(data, defaultSearchFields);

  const noResultsMessage =
    search.searchValue && search.filteredData.length === 0
      ? `No se encontraron resultados para "${search.searchValue}"`
      : 'No hay datos registrados';

  return {
    ...search,
    noResultsMessage,
  };
};
