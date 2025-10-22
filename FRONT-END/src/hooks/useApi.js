// src/hooks/useApi.js
import { useState, useEffect } from 'react';
import { handleApiError } from '../utils/helpers';

export const useApi = (apiFunction, immediate = false) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

// Hook específico para operaciones CRUD
export const useCRUD = (api) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await api.getAll();
      setItems(data);
      return data;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const create = async (itemData) => {
    try {
      const newItem = await api.create(itemData);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    }
  };

  const update = async (id, itemData) => {
    try {
      const updatedItem = await api.update(id, itemData);
      setItems(prev => prev.map(item => 
        item.id === id ? updatedItem : item
      ));
      return updatedItem;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
    setItems
  };
};