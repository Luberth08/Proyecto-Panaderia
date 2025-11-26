-- Script de migración - Agregar campo ENTREGADO a tabla PEDIDO
-- Ejecutar este script para habilitar la funcionalidad de confirmación de entrega

-- Agregar columna ENTREGADO a la tabla PEDIDO
ALTER TABLE PEDIDO ADD COLUMN ENTREGADO BOOLEAN NOT NULL DEFAULT FALSE;

-- Verificar que la columna fue agregada correctamente
SELECT * FROM information_schema.columns 
WHERE table_name = 'pedido' AND column_name = 'entregado';

-- Mostrar la estructura de la tabla PEDIDO actualizada
\d PEDIDO
