INSERT INTO CATEGORIA (NOMBRE, DESCRIPCION) VALUES
('Panes', 'Todo tipo de pan de avena y trigo'),
('Galletas', 'Galletas y snacks dulces'),
('Empanadas', 'Empanadas y productos rellenos'),
('Postres y bolleria', 'Rollos, croissants, brioche'),
('Bebidas', 'Suero de kefir y otras bebidas'),
('Especiales', 'Pan keto y productos sin gluten');

INSERT INTO INSUMO (NOMBRE, MEDIDA, STOCK, STOCK_MINIMO) VALUES
('Harina de avena', 'kg', 100, 10),
('Harina de trigo', 'kg', 100, 10),
('Harina de trigo integral', 'kg', 100, 10),
('Masa madre', 'kg', 50, 5),
('Sal', 'g', 5000, 500),
('Linaza molida', 'g', 2000, 200),
('Semillas de girasol', 'g', 2000, 200),
('Semillas de chia', 'g', 2000, 200),
('Semillas de sesamo', 'g', 2000, 200),
('Azúcar', 'g', 5000, 500),
('Mantequilla', 'g', 2000, 200),
('Aceite de oliva', 'ml', 5000, 500),
('Queso criollo', 'g', 3000, 300),
('Jamón', 'g', 2000, 200),
('Chocolate chips', 'g', 2000, 200),
('Almendras', 'g', 1500, 150),
('Uvas pasas', 'g', 1500, 150),
('Cúrcuma', 'g', 1000, 100),
('Harina de arroz', 'kg', 50, 5),
('Huevos', 'unid', 200, 20);

INSERT INTO PRODUCTO (NOMBRE, PRECIO, STOCK, STOCK_MINIMO, ID_CATEGORIA) VALUES
('Pan de avena clasico', 25.00, 50, 5, 1),
('Pan de avena con linaza', 25.00, 50, 5, 1),
('Pan de avena con chocolate', 35.00, 50, 5, 1),
('Galleta avena con chocolate bolsa grande', 30.00, 40, 5, 2),
('Galleta clasica mezcla de semillas 150gr', 15.00, 40, 5, 2),
('Pizza de empanada queso y jamon', 7.00, 60, 10, 3),
('Empanada de queso criollo', 7.00, 60, 10, 3),
('Empanada queso espinacas', 7.00, 60, 10, 3),
('Rollo de canela 100gr', 12.00, 40, 5, 4),
('Croissant clasico', 10.00, 40, 5, 4),
('Palmeritas de hojaldre', 8.00, 40, 5, 4),
('Pan keto sin gluten', 8.00, 30, 5, 6),
('Suero de kefir 300ml', 10.00, 50, 5, 5);

INSERT INTO RECETA (UNIDADES, TIEMPO, ID_PRODUCTO) VALUES
(1, '01:30:00', 1),  -- Pan de avena clasico
(1, '01:30:00', 2),  -- Pan de avena con linaza
(1, '01:30:00', 3),  -- Pan de avena con chocolate
(15, '01:00:00', 4), -- Galleta avena con chocolate bolsa grande
(1, '01:00:00', 5),  -- Galleta clasica mezcla de semillas 150gr
(1, '00:30:00', 6),  -- Pizza de empanada queso y jamon
(1, '00:25:00', 7),  -- Empanada de queso criollo
(1, '00:25:00', 8),  -- Empanada queso espinacas
(1, '00:45:00', 9),  -- Rollo de canela 100gr
(1, '00:40:00', 10), -- Croissant clasico
(1, '00:30:00', 11), -- Palmeritas de hojaldre
(1, '00:50:00', 12), -- Pan keto sin gluten
(1, '00:05:00', 13); -- Suero de kefir

INSERT INTO DETALLE_RECETA (ID_RECETA, ID_INSUMO, CANTIDAD, MEDIDA) VALUES
-- Pan de avena clasico
(1, 1, 0.3, 'kg'), -- Harina de avena
(1, 4, 0.05, 'kg'), -- Masa madre
(1, 5, 5, 'g'),    -- Sal

-- Pan de avena con linaza
(2, 1, 0.3, 'kg'), -- Harina de avena
(2, 4, 0.05, 'kg'), -- Masa madre
(2, 5, 5, 'g'),    -- Sal
(2, 6, 10, 'g'),   -- Linaza molida

-- Pan de avena con chocolate
(3, 1, 0.3, 'kg'), -- Harina de avena
(3, 4, 0.05, 'kg'), -- Masa madre
(3, 5, 5, 'g'),    -- Sal
(3, 15, 20, 'g'),  -- Chocolate chips

-- Galleta avena con chocolate bolsa grande (15 unidades)
(4, 1, 0.45, 'kg'), -- Harina de avena
(4, 4, 0.05, 'kg'), -- Masa madre
(4, 10, 30, 'g'),   -- Azúcar
(4, 11, 30, 'g'),   -- Mantequilla
(4, 15, 50, 'g'),   -- Chocolate chips

-- Galleta clasica mezcla de semillas
(5, 4, 0.05, 'kg'),  -- Masa madre
(5, 1, 0.15, 'kg'),  -- Harina de avena
(5, 7, 20, 'g'),     -- Semillas girasol
(5, 8, 10, 'g'),     -- Semillas chia

-- Pizza de empanada queso y jamon
(6, 2, 0.1, 'kg'),  -- Harina de trigo
(6, 13, 50, 'g'),   -- Queso
(6, 14, 50, 'g'),   -- Jamón

-- Empanadas de queso
(7, 3, 0.08, 'kg'), -- Harina trigo integral
(7, 13, 50, 'g'),   -- Queso

-- Empanadas de espinacas
(8, 3, 0.08, 'kg'), -- Harina trigo integral
(8, 13, 30, 'g'),   -- Queso
-- Se podrían agregar espinaca como insumo si la definimos

-- Rollo de canela
(9, 1, 0.1, 'kg'),  -- Harina avena
(9, 19, 0.05, 'kg'), -- Harina arroz
(9, 10, 15, 'g'),    -- Azúcar
(9, 11, 20, 'g'),    -- Mantequilla

-- Croissant clasico
(10, 2, 0.1, 'kg'), -- Harina trigo
(10, 11, 15, 'g'),  -- Mantequilla
(10, 10, 10, 'g'),  -- Azúcar

-- Palmeritas de hojaldre
(11, 2, 0.08, 'kg'), -- Harina trigo
(11, 11, 10, 'g'),   -- Mantequilla
(11, 10, 5, 'g'),    -- Azúcar
(11, 20, 1, 'unid'), -- Huevo

-- Pan keto sin gluten
(12, 19, 0.2, 'kg'), -- Harina arroz (como ejemplo de harina sin gluten)

-- Suero de kefir
(13, 4, 0.05, 'kg'); -- Masa madre como base del kefir

INSERT INTO ROL (NOMBRE) VALUES
('ADMINISTRADOR'),
('EMPLEADO'),
('CLIENTE');

INSERT INTO PERMISO (NOMBRE) VALUES
('CREAR_USUARIO'),
('VER_USUARIO'),
('MODIFICAR_USUARIO'),
('ELIMINAR_USUARIO'),
('CREAR_PERMISO'),
('VER_PERMISO'),
('MODIFICAR_PERMISO'),
('ELIMINAR_PERMISO'),
('CREAR_ROL'),
('VER_ROL'),
('MODIFICAR_ROL'),
('ELIMINAR_ROL'),
('CREAR_ROL_PERMISO'),
('VER_ROL_PERMISO'),
('ELIMINAR_ROL_PERMISO'),
('CREAR_CATEGORIA'),
('VER_CATEGORIA'),
('MODIFICAR_CATEGORIA'),
('ELIMINAR_CATEGORIA'),
('CREAR_PRODUCTO'),
('VER_PRODUCTO'),
('MODIFICAR_PRODUCTO'),
('ELIMINAR_PRODUCTO'),
('CREAR_INSUMO'),
('VER_INSUMO'),
('MODIFICAR_INSUMO'),
('ELIMINAR_INSUMO'),
('CREAR_PROVEEDOR'),
('VER_PROVEEDOR'),
('MODIFICAR_PROVEEDOR'),
('ELIMINAR_PROVEEDOR'),
('CREAR_RECETA'),
('VER_RECETA'),
('MODIFICAR_RECETA'),
('ELIMINAR_RECETA');

INSERT INTO ROL_PERMISO (ID_ROL, ID_PERMISO) VALUES
-- ADMINISTRADOR: puede hacer todo
-- Gestionar Usuario
(1, 1),  
(1, 2),  
(1, 3),  
(1, 4),  
-- Gestionar Permisos
(1, 5),  
(1, 6),  
(1, 7),  
(1, 8),  
-- Gestionar Roles
(1, 9),  
(1, 10), 
(1, 11), 
(1, 12), 
-- Gestionar Rol_permisos
(1, 13), 
(1, 14), 
(1, 15),
-- Gestionar Categorias
(1, 16),
(1, 17),
(1, 18),
(1, 19),
-- Gestionar Producto
(1, 20),
(1, 21),
(1, 22),
(1, 23),
-- Gestionar Insumo
(1, 24),
(1, 25),
(1, 26),
(1, 27),
-- Gestionar Proveedor
(1, 28),
(1, 29),
(1, 30),
(1, 31),
-- Gestionar Receta
(1, 32),
(1, 33),
(1, 34),
(1, 35);

INSERT INTO USUARIO (NOMBRE, SEXO, EMAIL, CONTRASENA, TELEFONO, ID_ROL) VALUES
('Luberth', 'M', 'luberthgutierrez@gmail.com', '$2b$10$xntLD/h19xNfNES3JN0MOeym.bwYGL4jO9rdhGJnKtTW9cL02NEgu', '69275363', 1),
('Sergio', 'M', 'sergio@gmail.com', '$2b$10$cXk52UUG15v1TwfPvbhlLu4b07rCOI8B62HgBjzjY0FNfZL9m0Xv6', '65894253', 1),
('Alejandro', 'M', 'alejandro@gmail.com', '$2b$10$PftFjV30LZYWTK/xMxYP1.S70GQbTt5S1c5Ihi4/DQ71hhL0GUYcu', '71152938', 1),
('Melissa', 'F', 'melissa@gmail.com', '$2b$10$qrthn.2hM.W0dIFWt5HAEeBTl/7NRT6Hy8/ZecqKkOSclnAjxigfu', '68752493', 1),
('Jhoel', 'M', 'jhoel@gmail.com', '$2b$10$1RGHwsoHB4HSAvXEcDSSm.7K4B8nvI3Xf2lSP5p./dXXLcJEwiXlG', '62129358', 2),
('Rodrigo', 'M', 'rodrigo@gmail.com', '$2b$10$/4ByApIivPNW7ncfTIiZT.cc1sinu3yf/Nkl9eTuouDkLq1PugLKC', '76351664', 3);

INSERT INTO PROVEEDOR (CODIGO, NOMBRE, SEXO, TELEFONO, ESTADO) VALUES
('PRV001', 'Juan Pérez', 'M', '71236517', 'ACTIVO'),
('PRV002', 'María López', 'F', '77234568', 'ACTIVO'),
('PRV003', 'Carlos Gómez', 'M', '61334269', 'ACTIVO'),
('PRV004', 'Ana Fernández', 'F', '75734670', 'ACTIVO'),
('PRV005', 'Luis Rodríguez', 'M', '69261571', 'ACTIVO');

INSERT INTO NOTA_COMPRA (FECHA_PEDIDO, FECHA_ENTREGA, ID_USUARIO, CODIGO_PROVEEDOR) VALUES
('2025-09-01', '2025-09-03', '1', 'PRV001'),
('2025-09-05', '2025-09-07', '2', 'PRV002'),
('2025-09-08', '2025-09-10', '3', 'PRV003');

INSERT INTO COMPRA_INSUMO (ID_NOTA_COMPRA, ID_INSUMO, CANTIDAD, PRECIO, TOTAL) VALUES
(1, 1, 10, 20.00, 200.00),
(1, 2, 5, 15.00, 75.00),
(2, 3, 12, 8.00, 96.00),
(2, 4, 8, 25.00, 200.00),
(3, 1, 5, 20.00, 100.00),
(3, 5, 7, 30.00, 210.00);

INSERT INTO COMPRA_PRODUCTO (ID_NOTA_COMPRA, ID_PRODUCTO, CANTIDAD, PRECIO, TOTAL) VALUES
(1, 1, 20, 25.00, 500.00),
(2, 3, 15, 35.00, 525.00),
(3, 5, 10, 12.00, 120.00);

INSERT INTO PRODUCCION (DESCRIPCION, FECHA, HORA_INICIO, TERMINADO, ID_RECETA) VALUES
('Producción de Pan de avena clásico', '2025-09-02', '07:00', TRUE, 1),
('Producción de Galleta de avena', '2025-09-05', '08:00', TRUE, 4),
('Producción de Croissant Clásico', '2025-09-08', '06:30', TRUE, 12);

INSERT INTO PARTICIPA (ID_USUARIO, ID_PRODUCCION, FECHA) VALUES
('1', 1, '2025-09-02'),
('2', 1, '2025-09-02'),
('3', 2, '2025-09-05'),
('1', 3, '2025-09-08'),
('2', 3, '2025-09-08');

INSERT INTO CLIENTE (CI, NOMBRE, SEXO, TELEFONO) VALUES
('13334249', 'Carlos Rivera', 'M', '72012345'),
('7794986', 'Ana Pérez', 'F', '72123456'),
('69425076', 'Luis Gómez', 'M', '72234567');

INSERT INTO FACTURA_INTERNA (TOTAL, FECHA, ID_USUARIO, CI_CLIENTE) VALUES
(125.00, '2025-09-02', '1', '13334249'),
(70.00,  '2025-09-05', '2', '7794986'),
(105.00, '2025-09-08', '3', '69425076');

INSERT INTO DETALLE_FACTURA (ID_FACTURA_INTERNA, ID_PRODUCTO, CANTIDAD, PRECIO, TOTAL) VALUES
-- Factura 1
(1, 1, 2, 25.00, 50.00),   -- Pan de avena clásico
(1, 3, 1, 35.00, 35.00),   -- Pan de avena con chispas de chocolate
(1, 4, 2, 20.00, 40.00),   -- Galleta de avena bolsa pequeña
-- Factura 2
(2, 5, 2, 15.00, 30.00),   -- Galleta clásica mezcla semillas
(2, 6, 2, 20.00, 40.00),   -- Galletas mixtas de semillas con cúrcuma
-- Factura 3
(3, 3, 2, 35.00, 70.00),   -- Pan de avena con chispas de chocolate
(3, 7, 1, 35.00, 35.00);   -- Pan de avena con almendras y uvas pasas

select * from bitacora;
select * from detalle_bitacora;
select * from usuario;
select * from rol;
select * from permiso;
select * from rol_permiso;
select * from categoria;

select * from producto;
select * from insumo;
select * from receta;
select * from proveedor;
