// src/utils/constants.js

// Estados de proveedores
export const PROVEEDOR_ESTADOS = {
  ACTIVO: 'ACTIVOP',
  INACTIVO: 'INACTIVOP'
};

// Opciones de género
export const GENERO_OPCIONES = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' }
];

// Unidades de medida para insumos
export const UNIDADES_MEDIDA = ['kg', 'gr', 'lt', 'ml', 'unid'];

// Roles del sistema
export const ROLES_SISTEMA = {
  ADMIN: 1,
  USUARIO: 2
};

// Estados de stock
export const ESTADO_STOCK = {
  NORMAL: 'normal',
  BAJO: 'bajo'
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  EMAIL: 'El formato de email es inválido',
  MIN_LENGTH: 'Debe tener al menos {n} caracteres',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden'
};

// Configuración de API
export const API_CONFIG = {
  TIMEOUT: 10000,
  MAX_RETRIES: 3
};

// Rutas de la aplicación
export const APP_ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  USUARIOS: '/usuarios',
  ROLES: '/roles',
  PERMISOS: '/permisos',
  PERFIL: '/perfil',
  CAMBIAR_CONTRASENA: '/cambiar-contrasena',
  CATEGORIAS: '/categorias',
  INSUMOS: '/insumos',
  PRODUCTOS: '/productos',
  RECETAS: '/recetas',
  PROVEEDORES: '/proveedores'
};