const API_URL = import.meta.env.VITE_API_URL;

// ----------------------------
// Función principal para request
// ----------------------------
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

// ----------------------------
// Funciones específicas para cada módulo
// ----------------------------
export const authAPI = {
  // Login
  login: (credentials) => apiRequest('auth/login', { method: 'POST', body: credentials }),

  // Logout
  logout: () => apiRequest('auth/logout', { method: 'POST' }),
};

export const usuarioAPI = {
  // Obtener todos los usuarios
  getAll: () => apiRequest('api/usuario', { method:'GET' }),

  // Obtener un usuario por su nombre
  getByNombre: (nombre) => apiRequest(`api/usuario/${nombre}`, { method: 'GET' }),

  // Crear un usuario
  create: (usuarioData) => apiRequest('api/usuario', { 
    method: 'POST', 
    body: usuarioData 
  }),

  // Actualizar un usuario
  update: (nombre, usuarioData) => apiRequest(`api/usuario/${nombre}`, { 
    method: 'PUT', 
    body: usuarioData 
  }),

  // Eliminar un usuario
  delete: (nombre) => apiRequest(`api/usuario/${nombre}`, { 
    method: 'DELETE' 
  }),
};

export const rolAPI = {
  // Obtener todos los roles
  getAll: () => apiRequest('api/rol', { method: 'GET' }),
  
  // Obtener rol por ID
  getById: (id) => apiRequest(`api/rol/${id}`, { method: 'GET' }),
  
  // Crear rol
  create: (rolData) => apiRequest('api/rol', { 
    method: 'POST', 
    body: rolData 
  }),
  
  // Actualizar rol
  update: (id, rolData) => apiRequest(`api/rol/${id}`, { 
    method: 'PUT', 
    body: rolData 
  }),
  
  // Eliminar rol
  delete: (id) => apiRequest(`api/rol/${id}`, { 
    method: 'DELETE' 
  }),
};

export const permisoAPI = {
  // Obtener todos los permisos
  getAll: () => apiRequest('api/permiso', { method: 'GET' }),
  
  // Obtener permiso por ID
  getById: (id) => apiRequest(`api/permiso/${id}`, { method: 'GET' }),
  
  // Crear permiso
  create: (permisoData) => apiRequest('api/permiso', { 
    method: 'POST', 
    body: permisoData 
  }),
  
  // Actualizar permiso
  update: (id, permisoData) => apiRequest(`api/permiso/${id}`, { 
    method: 'PUT', 
    body: permisoData 
  }),
  
  // Eliminar permiso
  delete: (id) => apiRequest(`api/permiso/${id}`, { 
    method: 'DELETE' 
  }),
};

export const rolPermisoAPI = {
  // Obtener todas las asociaciones rol-permiso
  getAll: () => apiRequest('api/rol_permiso', { method: 'GET' }),
  
  // Obtener permisos por rol
  getByRol: (id_rol) => {
    // Filtrar en frontend ya que el endpoint devuelve todos
    return rolPermisoAPI.getAll().then(data => 
      data.filter(rp => rp.id_rol === parseInt(id_rol))
    );
  },
  
  // Crear asociación rol-permiso
  create: (data) => apiRequest('api/rol_permiso', {
    method: 'POST',
    body: data
  }),
  
  // Eliminar asociación rol-permiso
  delete: (id_rol, id_permiso) => apiRequest(`api/rol_permiso/${id_rol}/${id_permiso}`, {
    method: 'DELETE'
  }),
};

export const perfilAPI = {
  // Obtener perfil del usuario logueado
  getPerfil: () => apiRequest('api/perfil', { method: 'GET' }),
  
  // Actualizar perfil del usuario logueado
  updatePerfil: (data) => apiRequest('api/perfil', {
    method: 'PUT',
    body: data
  }),

  // Cambiar la contraseña del usuario logueado
  cambiarContrasena: (data) => apiRequest('api/cambiar_contrasena', {
    method: 'PUT',
    body: data
  }),
};

export const categoriaAPI = {
  // Obtener todas las categorías
  getAll: () => apiRequest('api/categoria', { method: 'GET' }),
  
  // Obtener categoría por ID
  getById: (id) => apiRequest(`api/categoria${id}`, { method: 'GET' }),
  
  // Crear categoría
  create: (categoriaData) => apiRequest('api/categoria', { 
    method: 'POST', 
    body: categoriaData 
  }),
  
  // Actualizar categoría
  update: (id, categoriaData) => apiRequest(`api/categoria/${id}`, { 
    method: 'PUT', 
    body: categoriaData 
  }),
  
  // Eliminar categoría
  delete: (id) => apiRequest(`api/categoria/${id}`, { 
    method: 'DELETE' 
  }),
};

export const insumoAPI = {
  // Obtener todos los insumos
  getAll: () => apiRequest('api/insumo', { method: 'GET' }),
  
  // Obtener insumo por ID
  getById: (id) => apiRequest(`api/insumo/${id}`, { method: 'GET' }),
  
  // Crear insumo
  create: (insumoData) => apiRequest('api/insumo', { 
    method: 'POST', 
    body: insumoData 
  }),
  
  // Actualizar insumo
  update: (id, insumoData) => apiRequest(`api/insumo/${id}`, { 
    method: 'PUT', 
    body: insumoData 
  }),
  
  // Eliminar insumo
  delete: (id) => apiRequest(`api/insumo/${id}`, { 
    method: 'DELETE' 
  }),
};

export const productoAPI = {
  // Obtener todos los productos
  getAll: () => apiRequest('api/producto', { method: 'GET' }),
  
  // Obtener producto por ID
  getById: (id) => apiRequest(`api/producto/${id}`, { method: 'GET' }),
  
  // Crear producto
  create: (productoData) => apiRequest('api/producto', { 
    method: 'POST', 
    body: productoData 
  }),
  
  // Actualizar producto
  update: (id, productoData) => apiRequest(`api/producto/${id}`, { 
    method: 'PUT', 
    body: productoData 
  }),
  
  // Eliminar producto
  delete: (id) => apiRequest(`api/producto/${id}`, { 
    method: 'DELETE' 
  }),
};

export const recetaAPI = {
  // Obtener todas las recetas
  getAll: () => apiRequest('api/receta', { method: 'GET' }),
  
  // Obtener receta por ID
  getById: (id) => apiRequest(`api/receta/${id}`, { method: 'GET' }),
  
  // Crear receta
  create: (recetaData) => apiRequest('api/receta', { 
    method: 'POST', 
    body: recetaData 
  }),
  
  // Actualizar receta
  update: (id, recetaData) => apiRequest(`api/receta/${id}`, { 
    method: 'PUT', 
    body: recetaData 
  }),
  
  // Eliminar receta
  delete: (id) => apiRequest(`api/receta/${id}`, { 
    method: 'DELETE' 
  }),
};

export const proveedorAPI = {
  // Obtener todos los proveedores
  getAll: () => apiRequest('api/proveedor', { method: 'GET' }),
  
  // Obtener proveedor por código
  getByCodigo: (codigo) => apiRequest(`api/proveedor/${codigo}`, { method: 'GET' }),
  
  // Crear proveedor
  create: (proveedorData) => apiRequest('api/proveedor', { 
    method: 'POST', 
    body: proveedorData 
  }),
  
  // Actualizar proveedor
  update: (codigo, proveedorData) => apiRequest(`api/proveedor/${codigo}`, { 
    method: 'PUT', 
    body: proveedorData 
  }),
  
  // Eliminar proveedor
  delete: (codigo) => apiRequest(`api/proveedor/${codigo}`, { 
    method: 'DELETE' 
  }),
};

export const notaCompraAPI = {
  // Obtener todas las notas de compra
  getAll: () => apiRequest('api/nota_compra', { method: 'GET' }),

  // Obtener nota de compra por ID
  getById: (id) => apiRequest(`api/nota_compra/${id}`, { method: 'GET' }),

  // Crear nueva nota de compra
  create: (notaData) => apiRequest('api/nota_compra', { 
    method: 'POST',
    body: notaData
  }),

  // Actualizar nota de compra por ID
  update: (id, notaData) => apiRequest(`api/nota_compra/${id}`, { 
    method: 'PUT',
    body: notaData
  }),

  // Eliminar nota de compra por ID
  delete: (id) => apiRequest(`api/nota_compra/${id}`, { method: 'DELETE' }),
};

export const detalleRecetaAPI = {
  // Obtener todas los detalle_receta
  getAll: () => apiRequest('api/detalle_receta', { method: 'GET' }),

  // Obtener unn detalle receta por sus IDs
  getByIds: (id_receta, id_insumo) => 
    apiRequest(`api/detalle_receta/${id_receta}/${id_insumo}`, { method: 'GET' }),

  // Añadir un insumo a una receta
  create: (detalleData) =>
    apiRequest('api/detalle_receta', { method: 'POST', body: detalleData }),

  // Añadir informacion de un insumo dado una receta
  update: (id_receta, id_insumo, detalleData) =>
    apiRequest(`api/detalle_receta/${id_receta}/${id_insumo}`, { method: 'PUT', body: detalleData }),

  // Eliminar un insumo de una receta
  delete: (id_receta, id_insumo) =>
    apiRequest(`api/detalle_receta/${id_receta}/${id_insumo}`, { method: 'DELETE' }),
};

export const compraInsumoAPI = {
  // Obtener todas las compras de insumo
  getAll: () => apiRequest('api/compra_insumo', { method: 'GET' }),

  // Obtener una compra de insumo por sus IDs
  getByIds: (id_nota_compra, id_insumo) =>
    apiRequest(`api/compra_insumo/${id_nota_compra}/${id_insumo}`, { method: 'GET' }),

  // Añadir una compra de insumo
  create: (data) => 
    apiRequest('api/compra_insumo', { method: 'POST', body: data }),

  // Actualizar una compra de insumo
  update: (id_nota_compra, id_insumo, data) =>
    apiRequest(`api/compra_insumo/${id_nota_compra}/${id_insumo}`, { method: 'PUT', body: data }),

  // Eliminar una compra de insumo
  delete: (id_nota_compra, id_insumo) =>
    apiRequest(`api/compra_insumo/${id_nota_compra}/${id_insumo}`, { method: 'DELETE' })
};

export const compraProductoAPI = {
  // Obtener todas las compras de insumo
  getAll: () => apiRequest('api/compra_producto', { method: 'GET' }),

  // Obtener una compra de insumo por sus IDs
  getByIds: (id_nota_compra, id_producto) =>
    apiRequest(`api/compra_producto/${id_nota_compra}/${id_producto}`, { method: 'GET' }),

  // Añadir una compra de insumo
  create: (data) => 
    apiRequest('api/compra_producto', { method: 'POST', body: data }),

  // Actualizar una compra de insumo
  update: (id_nota_compra, id_producto, data) =>
    apiRequest(`api/compra_producto/${id_nota_compra}/${id_producto}`, { method: 'PUT', body: data }),

  // Eliminar una compra de insumo
  delete: (id_nota_compra, id_producto) =>
    apiRequest(`api/compra_producto/${id_nota_compra}/${id_producto}`, { method: 'DELETE' })
};

export const produccionAPI = {
  // Obtener todas las producciones
  getAll: () => apiRequest('api/produccion', { method: 'GET' }),

  // Obtener producción por ID
  getById: (id) => apiRequest(`api/produccion/${id}`, { method: 'GET' }),

  // Crear nueva producción
  create: (produccionData) => apiRequest('api/produccion', { 
    method: 'POST',
    body: produccionData
  }),

  // Actualizar producción por ID
  update: (id, produccionData) => apiRequest(`api/produccion/${id}`, { 
    method: 'PUT',
    body: produccionData
  }),

  // Eliminar producción por ID
  delete: (id) => apiRequest(`api/produccion/${id}`, { method: 'DELETE' }),
};

export const participaAPI = {
  // Obtener todas las participaciones
  getAll: () => apiRequest('api/participa', { method: 'GET' }),

  // Obtener participación por IDs (usuario + producción)
  getByIds: (id_usuario, id_produccion) =>
    apiRequest(`api/participa/${id_usuario}/${id_produccion}`, { method: 'GET' }),

  // Crear nueva participación
  create: (participaData) => apiRequest('api/participa', { 
    method: 'POST',
    body: participaData
  }),

  // Actualizar participación por IDs
  update: (id_usuario, id_produccion, participaData) =>
    apiRequest(`api/participa/${id_usuario}/${id_produccion}`, { 
      method: 'PUT',
      body: participaData
    }),

  // Eliminar participación por IDs
  delete: (id_usuario, id_produccion) =>
    apiRequest(`api/participa/${id_usuario}/${id_produccion}`, { method: 'DELETE' }),
};

export const bitacoraAPI = {
  // Obtener todos las bitacoras
  getAll: () => apiRequest('api/bitacora', { method: 'GET' }),

  // Obtener todos los detalle de una bitacora
  getDetalle: (id) => apiRequest(`api/detalle_bitacora/${id}`, { method: 'GET' }),
};

export const clienteAPI = {
  // Obtener todos los clientes
  getAll: () => apiRequest('api/cliente', { method: 'GET' }),
  
  // Obtener cliente por CI
  getByCi: (ci) => apiRequest(`api/cliente/${ci}`, { method: 'GET' }),
  
  // Crear cliente
  create: (clienteData) => apiRequest('api/cliente', { 
    method: 'POST', 
    body: clienteData 
  }),
  
  // Actualizar cliente
  update: (ci, clienteData) => apiRequest(`api/cliente/${ci}`, { 
    method: 'PUT', 
    body: clienteData 
  }),
  
  // Eliminar cliente
  delete: (ci) => apiRequest(`api/cliente/${ci}`, { 
    method: 'DELETE' 
  }),
};

export const pedidoAPI = {
  // Obtener todos los pedidos
  getAll: () => apiRequest('api/pedido', { method: 'GET' }),
  
  // Obtener pedido por ID
  getById: (id) => apiRequest(`api/pedido/${id}`, { method: 'GET' }),
  
  // Obtener estado del pedido
  getEstado: (id) => apiRequest(`api/pedido/${id}/estado`, { method: 'GET' }),
  
  // Crear pedido
  create: (pedidoData) => apiRequest('api/pedido', { 
    method: 'POST', 
    body: pedidoData 
  }),
  
  // Actualizar pedido
  update: (id, pedidoData) => apiRequest(`api/pedido/${id}`, { 
    method: 'PUT', 
    body: pedidoData 
  }),
  
  // Confirmar entrega de pedido
  confirmarEntrega: (id) => apiRequest(`api/pedido/${id}/confirmar-entrega`, { 
    method: 'PUT' 
  }),
  
  // Eliminar pedido
  delete: (id) => apiRequest(`api/pedido/${id}`, { 
    method: 'DELETE' 
  }),
};

export const detallePedidoAPI = {
  // Obtener todos los detalles
  getAll: () => apiRequest('api/detalle_pedido', { method: 'GET' }),
  
  // Obtener detalles de un pedido
  getByPedidoId: (id_pedido) => apiRequest(`api/detalle_pedido/pedido/${id_pedido}`, { method: 'GET' }),
  
  // Obtener detalle específico
  getByIds: (id_producto, id_pedido) => apiRequest(`api/detalle_pedido/${id_producto}/${id_pedido}`, { method: 'GET' }),
  
  // Crear detalle de pedido
  create: (detalleData) => apiRequest('api/detalle_pedido', { 
    method: 'POST', 
    body: detalleData 
  }),
  
  // Actualizar detalle de pedido
  update: (id_producto, id_pedido, detalleData) => apiRequest(`api/detalle_pedido/${id_producto}/${id_pedido}`, { 
    method: 'PUT', 
    body: detalleData 
  }),
  
  // Eliminar detalle de pedido
  delete: (id_producto, id_pedido) => apiRequest(`api/detalle_pedido/${id_producto}/${id_pedido}`, { 
    method: 'DELETE' 
  }),
};

export const reporteAPI = {
  // Generar reporte de ventas
  generarReporteVentas: (formato, fecha_inicio, fecha_fin) => {
    const params = new URLSearchParams();
    params.append('formato', formato);
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);
    return fetch(`${API_URL}/api/reporte/ventas?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => res.blob());
  },
  
  // Generar reporte de producción
  generarReporteProduccion: (formato, fecha_inicio, fecha_fin) => {
    const params = new URLSearchParams();
    params.append('formato', formato);
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);
    return fetch(`${API_URL}/api/reporte/produccion?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => res.blob());
  },
  
  // Generar reporte de inventario
  generarReporteInventario: (formato) => {
    const params = new URLSearchParams();
    params.append('formato', formato);
    return fetch(`${API_URL}/api/reporte/inventario?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => res.blob());
  },
  
  // Generar reporte de pedidos y clientes
  generarReportePedidosClientes: (formato, fecha_inicio, fecha_fin) => {
    const params = new URLSearchParams();
    params.append('formato', formato);
    if (fecha_inicio) params.append('fecha_inicio', fecha_inicio);
    if (fecha_fin) params.append('fecha_fin', fecha_fin);
    return fetch(`${API_URL}/api/reporte/pedidos-clientes?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => res.blob());
  },
};

// ----------------------------
// API para Reportes IA
// ----------------------------
const IA_REPORTES_URL = import.meta.env.VITE_IA_REPORTES_URL || 'http://localhost:5001';

export const reportesIAAPI = {
  // Verificar estado del servicio IA
  verificarEstado: async () => {
    try {
      const response = await fetch(`${IA_REPORTES_URL}/api/health`);
      return await response.json();
    } catch (error) {
      console.error('Error verificando estado IA:', error);
      throw error;
    }
  },

  // Obtener tipos de reportes disponibles
  obtenerTiposReportes: async () => {
    try {
      const response = await fetch(`${IA_REPORTES_URL}/api/reportes/tipos`);
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo tipos:', error);
      throw error;
    }
  },

  // Generar reporte con IA
  generarReporte: async (tipoReporte, promptCustom, fechaInicio, fechaFin, formatos = ['json'], incluirGraficos = true) => {
    try {
      const response = await fetch(`${IA_REPORTES_URL}/api/reportes/generar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_reporte: tipoReporte,
          prompt_custom: promptCustom,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          formatos: formatos,
          incluir_graficos: incluirGraficos,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generando reporte IA:', error);
      throw error;
    }
  },

  // Preview de reporte (sin generar archivos)
  previewReporte: async (tipoReporte, fechaInicio, fechaFin) => {
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append('fecha_inicio', fechaInicio);
      if (fechaFin) params.append('fecha_fin', fechaFin);

      const response = await fetch(
        `${IA_REPORTES_URL}/api/reportes/preview/${tipoReporte}?${params}`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo preview:', error);
      throw error;
    }
  },

  // Descargar archivo (PDF o Excel)
  descargarArchivo: async (rutaArchivo, nombreArchivo) => {
    try {
      // Extraer solo el nombre del archivo (sin carpetas)
      // Puede venir como: "outputs/Reporte_Ventas_20251127_070454.pdf" o "D:\...\outputs\Reporte_..."
      let nombreFile = rutaArchivo.split('\\').pop() || rutaArchivo.split('/').pop();
      
      // Si aún contiene "outputs/", extraer lo que viene después
      if (nombreFile.includes('/')) {
        nombreFile = nombreFile.split('/').pop();
      }
      if (nombreFile.includes('\\')) {
        nombreFile = nombreFile.split('\\').pop();
      }
      
      // Usar la nueva ruta de descarga del API
      const response = await fetch(`${IA_REPORTES_URL}/api/reportes/descargar/${nombreFile}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nombreArchivo || nombreFile);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando archivo:', error);
      throw error;
    }
  },
};