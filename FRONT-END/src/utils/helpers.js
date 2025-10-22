// src/utils/helpers.js

// Validación de stock bajo
export const isStockBajo = (stock, stockMinimo) => {
  return stock < stockMinimo;
};

// Formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB'
  }).format(amount);
};

// Formatear estado de proveedor
export const formatEstadoProveedor = (estado) => {
  const estados = {
    'ACTIVOP': { text: 'Activo', class: 'estado-activo' },
    'INACTIVOP': { text: 'Inactivo', class: 'estado-inactivo' }
  };
  return estados[estado] || { text: estado, class: '' };
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Debounce para búsquedas
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generar IDs únicos (para keys en React)
export const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

// Capitalizar texto
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Función para manejar errores de API
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return error.message || 'Error de conexión';
};

// Formatear número con separadores de miles
export const formatNumber = (number) => {
  return new Intl.NumberFormat('es-BO').format(number);
};

// Validar teléfono boliviano
export const isValidBolivianPhone = (phone) => {
  const phoneRegex = /^[67]\d{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Obtener iniciales para avatar
export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};