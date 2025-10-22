// Este archivo centralizará todas las llamadas al backend usando fetch

const API_URL = import.meta.env.VITE_API_URL;

// Función principal para requests
export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    ...restOptions
  } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...restOptions,
  };

  // Agregar token si existe
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Agregar body si existe
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Funciones específicas para cada módulo

export const authAPI = {
  login: (credentials) => apiRequest('auth/login', { method: 'POST', body: credentials }),
  logout: () => apiRequest('auth/logout', { method: 'POST' }),
};

export const usuarioAPI = {
  getAll: () => apiRequest('api/usuario/read'),
  getByNombre: (nombre) => apiRequest(`api/usuario/read/${nombre}`),
  create: (usuarioData) => apiRequest('api/usuario/create', { 
    method: 'POST', 
    body: usuarioData 
  }),
  update: (nombre, usuarioData) => apiRequest(`api/usuario/update/${nombre}`, { 
    method: 'PUT', 
    body: usuarioData 
  }),
  delete: (nombre) => apiRequest(`api/usuario/delete/${nombre}`, { 
    method: 'DELETE' 
  }),
};

export const rolAPI = {
  // Obtener todos los roles
  getAll: () => apiRequest('api/rol/read'),
  
  // Obtener rol por ID
  getById: (id) => apiRequest(`api/rol/read/${id}`),
  
  // Crear rol
  create: (rolData) => apiRequest('api/rol/create', { 
    method: 'POST', 
    body: rolData 
  }),
  
  // Actualizar rol
  update: (id, rolData) => apiRequest(`api/rol/update/${id}`, { 
    method: 'PUT', 
    body: rolData 
  }),
  
  // Eliminar rol
  delete: (id) => apiRequest(`api/rol/delete/${id}`, { 
    method: 'DELETE' 
  }),
};

export const permisoAPI = {
  // Obtener todos los permisos
  getAll: () => apiRequest('api/permiso/read'),
  
  // Obtener permiso por ID
  getById: (id) => apiRequest(`api/permiso/read/${id}`),
  
  // Crear permiso
  create: (permisoData) => apiRequest('api/permiso/create', { 
    method: 'POST', 
    body: permisoData 
  }),
  
  // Actualizar permiso
  update: (id, permisoData) => apiRequest(`api/permiso/update/${id}`, { 
    method: 'PUT', 
    body: permisoData 
  }),
  
  // Eliminar permiso
  delete: (id) => apiRequest(`api/permiso/delete/${id}`, { 
    method: 'DELETE' 
  }),
};

export const rolPermisoAPI = {
  // Obtener todas las asociaciones rol-permiso
  getAll: () => apiRequest('api/rol_permiso/read'),
  
  // Obtener permisos por rol
  getByRol: (id_rol) => {
    // Filtrar en frontend ya que el endpoint devuelve todos
    return rolPermisoAPI.getAll().then(data => 
      data.filter(rp => rp.id_rol === parseInt(id_rol))
    );
  },
  
  // Crear asociación rol-permiso
  create: (data) => apiRequest('api/rol_permiso/create', {
    method: 'POST',
    body: data
  }),
  
  // Eliminar asociación rol-permiso
  delete: (id_rol, id_permiso) => apiRequest(`api/rol_permiso/delete/${id_rol}/${id_permiso}`, {
    method: 'DELETE'
  }),
};

export const perfilAPI = {
  // Obtener perfil del usuario logueado
  getPerfil: () => apiRequest('api/perfil/read'),
  
  // Actualizar perfil del usuario logueado
  updatePerfil: (data) => apiRequest('api/perfil/update', {
    method: 'PUT',
    body: data
  }),

  cambiarContrasena: (data) => apiRequest('api/cambiar_contrasena/update', {
    method: 'PUT',
    body: data
  }),
};

export const categoriaAPI = {
  // Obtener todas las categorías
  getAll: () => apiRequest('api/categoria/read'),
  
  // Obtener categoría por ID
  getById: (id) => apiRequest(`api/categoria/read/${id}`),
  
  // Crear categoría
  create: (categoriaData) => apiRequest('api/categoria/create', { 
    method: 'POST', 
    body: categoriaData 
  }),
  
  // Actualizar categoría
  update: (id, categoriaData) => apiRequest(`api/categoria/update/${id}`, { 
    method: 'PUT', 
    body: categoriaData 
  }),
  
  // Eliminar categoría
  delete: (id) => apiRequest(`api/categoria/delete/${id}`, { 
    method: 'DELETE' 
  }),
};

export const insumoAPI = {
  // Obtener todos los insumos
  getAll: () => apiRequest('api/insumo/read'),
  
  // Obtener insumo por ID
  getById: (id) => apiRequest(`api/insumo/read/${id}`),
  
  // Crear insumo
  create: (insumoData) => apiRequest('api/insumo/create', { 
    method: 'POST', 
    body: insumoData 
  }),
  
  // Actualizar insumo
  update: (id, insumoData) => apiRequest(`api/insumo/update/${id}`, { 
    method: 'PUT', 
    body: insumoData 
  }),
  
  // Eliminar insumo
  delete: (id) => apiRequest(`api/insumo/delete/${id}`, { 
    method: 'DELETE' 
  }),
};

export const productoAPI = {
  // Obtener todos los productos
  getAll: () => apiRequest('api/producto/read'),
  
  // Obtener producto por ID
  getById: (id) => apiRequest(`api/producto/read/${id}`),
  
  // Crear producto
  create: (productoData) => apiRequest('api/producto/create', { 
    method: 'POST', 
    body: productoData 
  }),
  
  // Actualizar producto
  update: (id, productoData) => apiRequest(`api/producto/update/${id}`, { 
    method: 'PUT', 
    body: productoData 
  }),
  
  // Eliminar producto
  delete: (id) => apiRequest(`api/producto/delete/${id}`, { 
    method: 'DELETE' 
  }),
};

export const recetaAPI = {
  // Obtener todas las recetas
  getAll: () => apiRequest('api/receta/read'),
  
  // Obtener receta por ID
  getById: (id) => apiRequest(`api/receta/read/${id}`),
  
  // Crear receta
  create: (recetaData) => apiRequest('api/receta/create', { 
    method: 'POST', 
    body: recetaData 
  }),
  
  // Actualizar receta
  update: (id, recetaData) => apiRequest(`api/receta/update/${id}`, { 
    method: 'PUT', 
    body: recetaData 
  }),
  
  // Eliminar receta
  delete: (id) => apiRequest(`api/receta/delete/${id}`, { 
    method: 'DELETE' 
  }),
};

export const proveedorAPI = {
  // Obtener todos los proveedores
  getAll: () => apiRequest('api/proveedor/read'),
  
  // Obtener proveedor por código
  getByCodigo: (codigo) => apiRequest(`api/proveedor/read/${codigo}`),
  
  // Crear proveedor
  create: (proveedorData) => apiRequest('api/proveedor/create', { 
    method: 'POST', 
    body: proveedorData 
  }),
  
  // Actualizar proveedor
  update: (codigo, proveedorData) => apiRequest(`api/proveedor/update/${codigo}`, { 
    method: 'PUT', 
    body: proveedorData 
  }),
  
  // Eliminar proveedor
  delete: (codigo) => apiRequest(`api/proveedor/delete/${codigo}`, { 
    method: 'DELETE' 
  }),
};

export const bitacoraAPI = {
  getAll: () => apiRequest('api/bitacora/read'),
  getDetalle: (id) => apiRequest(`api/bitacora/detalle/${id}`),
  getAllDetalles: () => apiRequest('api/bitacora/detalles')
};