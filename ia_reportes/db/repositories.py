from db.connection import db
import logging

logger = logging.getLogger(__name__)

class VentasRepository:
    """Acceso a datos de ventas"""
    
    @staticmethod
    def obtener_total_ventas(fecha_inicio, fecha_fin):
        """Total de ventas en un período"""
        query = """
        SELECT 
            SUM(pp.total) as total_ventas,
            COUNT(DISTINCT p.id) as cantidad_pedidos,
            AVG(pp.total) as ticket_promedio
        FROM PEDIDO p
        JOIN PEDIDO_PRODUCTO pp ON p.id = pp.id_pedido
        WHERE p.fecha_pedido BETWEEN %s AND %s
        """
        return db.execute_single(query, (fecha_inicio, fecha_fin))
    
    @staticmethod
    def obtener_ventas_por_categoria(fecha_inicio, fecha_fin):
        """Ventas agrupadas por categoría"""
        query = """
        SELECT 
            c.nombre as categoria,
            COUNT(*) as cantidad_productos,
            SUM(pp.total) as total_ventas,
            AVG(pp.precio) as precio_promedio
        FROM PEDIDO p
        JOIN PEDIDO_PRODUCTO pp ON p.id = pp.id_pedido
        JOIN PRODUCTO pr ON pp.id_producto = pr.id
        JOIN CATEGORIA c ON pr.id_categoria = c.id
        WHERE p.fecha_pedido BETWEEN %s AND %s
        GROUP BY c.id, c.nombre
        ORDER BY total_ventas DESC
        """
        return db.execute_query(query, (fecha_inicio, fecha_fin))
    
    @staticmethod
    def obtener_clientes_top(fecha_inicio, fecha_fin, limite=10):
        """Clientes con más compras"""
        query = """
        SELECT 
            cl.nombre as cliente,
            cl.ci,
            COUNT(p.id) as cantidad_pedidos,
            SUM(pp.total) as total_gastado
        FROM CLIENTE cl
        JOIN PEDIDO p ON cl.ci = p.ci_cliente
        JOIN PEDIDO_PRODUCTO pp ON p.id = pp.id_pedido
        WHERE p.fecha_pedido BETWEEN %s AND %s
        GROUP BY cl.ci, cl.nombre
        ORDER BY total_gastado DESC
        LIMIT %s
        """
        return db.execute_query(query, (fecha_inicio, fecha_fin, limite))
    
    @staticmethod
    def obtener_productos_top(fecha_inicio, fecha_fin, limite=10):
        """Productos más vendidos"""
        query = """
        SELECT 
            pr.nombre as producto,
            pr.precio,
            SUM(pp.cantidad) as total_vendido,
            SUM(pp.total) as ingresos_generados,
            c.nombre as categoria
        FROM PEDIDO p
        JOIN PEDIDO_PRODUCTO pp ON p.id = pp.id_pedido
        JOIN PRODUCTO pr ON pp.id_producto = pr.id
        JOIN CATEGORIA c ON pr.id_categoria = c.id
        WHERE p.fecha_pedido BETWEEN %s AND %s
        GROUP BY pr.id, pr.nombre, pr.precio, c.nombre
        ORDER BY total_vendido DESC
        LIMIT %s
        """
        return db.execute_query(query, (fecha_inicio, fecha_fin, limite))

class InventarioRepository:
    """Acceso a datos de inventario"""
    
    @staticmethod
    def obtener_estado_stock():
        """Estado actual del inventario"""
        query = """
        SELECT 
            pr.nombre as producto,
            pr.stock,
            pr.stock_minimo,
            c.nombre as categoria,
            pr.precio,
            (pr.stock * pr.precio) as valor_total
        FROM PRODUCTO pr
        JOIN CATEGORIA c ON pr.id_categoria = c.id
        ORDER BY pr.stock ASC
        """
        return db.execute_query(query)
    
    @staticmethod
    def obtener_bajo_stock():
        """Productos con stock bajo"""
        query = """
        SELECT 
            pr.nombre as producto,
            pr.stock,
            pr.stock_minimo,
            (pr.stock_minimo - pr.stock) as falta_para_minimo,
            c.nombre as categoria
        FROM PRODUCTO pr
        JOIN CATEGORIA c ON pr.id_categoria = c.id
        WHERE pr.stock < pr.stock_minimo
        ORDER BY (pr.stock_minimo - pr.stock) DESC
        """
        return db.execute_query(query)

class ClientesRepository:
    """Acceso a datos de clientes"""
    
    @staticmethod
    def obtener_informacion_cliente(ci_cliente):
        """Información de un cliente específico"""
        query = """
        SELECT 
            cl.nombre,
            cl.ci,
            cl.telefono,
            COUNT(p.id) as total_pedidos,
            SUM(pp.total) as total_gastado
        FROM CLIENTE cl
        LEFT JOIN PEDIDO p ON cl.ci = p.ci_cliente
        LEFT JOIN PEDIDO_PRODUCTO pp ON p.id = pp.id_pedido
        WHERE cl.ci = %s
        GROUP BY cl.ci, cl.nombre, cl.telefono
        """
        return db.execute_single(query, (ci_cliente,))
