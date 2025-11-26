-- Script SQL para crear permisos del Ciclo 4 - Gestión de Ventas y Reportes
-- Ejecutar este script en la base de datos PANADERIA

-- Permisos para Clientes
INSERT INTO permiso (nombre) VALUES ('CREAR_CLIENTE');
INSERT INTO permiso (nombre) VALUES ('VER_CLIENTE');
INSERT INTO permiso (nombre) VALUES ('MODIFICAR_CLIENTE');
INSERT INTO permiso (nombre) VALUES ('ELIMINAR_CLIENTE');

-- Permisos para Pedidos
INSERT INTO permiso (nombre) VALUES ('CREAR_PEDIDO');
INSERT INTO permiso (nombre) VALUES ('VER_PEDIDO');
INSERT INTO permiso (nombre) VALUES ('MODIFICAR_PEDIDO');
INSERT INTO permiso (nombre) VALUES ('ELIMINAR_PEDIDO');
INSERT INTO permiso (nombre) VALUES ('CONFIRMAR_ENTREGA_PEDIDO');

-- Permisos para Detalles de Pedido
INSERT INTO permiso (nombre) VALUES ('CREAR_DETALLE_PEDIDO');
INSERT INTO permiso (nombre) VALUES ('VER_DETALLE_PEDIDO');
INSERT INTO permiso (nombre) VALUES ('MODIFICAR_DETALLE_PEDIDO');
INSERT INTO permiso (nombre) VALUES ('ELIMINAR_DETALLE_PEDIDO');

-- Permisos para Reportes
INSERT INTO permiso (nombre) VALUES ('VER_REPORTE_VENTAS');
INSERT INTO permiso (nombre) VALUES ('VER_REPORTE_PRODUCCION');
INSERT INTO permiso (nombre) VALUES ('VER_REPORTE_INVENTARIO');
INSERT INTO permiso (nombre) VALUES ('VER_REPORTE_PEDIDOS');

-- Opcional: Verificar que los permisos fueron creados
SELECT * FROM permiso WHERE nombre LIKE '%CLIENTE%' 
   OR nombre LIKE '%PEDIDO%' 
   OR nombre LIKE '%REPORTE%' 
   OR nombre LIKE '%DETALLE%'
ORDER BY nombre;
