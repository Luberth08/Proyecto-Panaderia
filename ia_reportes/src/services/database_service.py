import psycopg2
from psycopg2.extras import RealDictCursor
from src.config.settings import DB_CONFIG
import logging

logger = logging.getLogger(__name__)

class DatabaseService:
    """Servicio de conexión a base de datos"""
    
    def __init__(self):
        self.connection = None
    
    def connect(self):
        """Establece conexión con BD"""
        try:
            self.connection = psycopg2.connect(**DB_CONFIG)
            logger.info("Conexión a BD establecida")
        except Exception as e:
            logger.error(f"Error conectando a BD: {str(e)}")
            raise
    
    def disconnect(self):
        """Cierra conexión con BD"""
        if self.connection:
            self.connection.close()
            logger.info("Conexión a BD cerrada")
    
    def execute_query(self, query: str, params=None):
        """Ejecuta query y retorna resultados"""
        try:
            with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, params)
                return cursor.fetchall()
        except Exception as e:
            logger.error(f"Error ejecutando query: {str(e)}")
            raise
    
    def execute_single(self, query: str, params=None):
        """Ejecuta query y retorna un solo resultado"""
        try:
            with self.connection.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute(query, params)
                return cursor.fetchone()
        except Exception as e:
            logger.error(f"Error ejecutando query: {str(e)}")
            raise
    
    # ===== QUERIES VENTAS =====
    def get_ventas_data(self, fecha_inicio, fecha_fin):
        """Obtiene datos de ventas en período"""
        query = """
        SELECT 
            p.id,
            p.fecha_pedido,
            p.total,
            c.nombre as cliente,
            COUNT(pp.id_producto) as cantidad_items,
            STRING_AGG(pr.nombre, ', ') as productos
        FROM PEDIDO p
        LEFT JOIN CLIENTE c ON p.ci_cliente = c.ci
        LEFT JOIN PEDIDO_PRODUCTO pp ON p.id = pp.id_pedido
        LEFT JOIN PRODUCTO pr ON pp.id_producto = pr.id
        WHERE p.fecha_pedido BETWEEN %s AND %s
        GROUP BY p.id, c.nombre
        ORDER BY p.fecha_pedido DESC
        """
        return self.execute_query(query, (fecha_inicio, fecha_fin))
    
    def get_ventas_por_categoria(self, fecha_inicio, fecha_fin):
        """Obtiene ventas agregadas por categoría"""
        query = """
        SELECT 
            cat.nombre as categoria,
            SUM(pp.cantidad) as cantidad_vendida,
            SUM(pp.total) as total_vendido,
            COUNT(DISTINCT p.id) as pedidos
        FROM PEDIDO p
        JOIN PEDIDO_PRODUCTO pp ON p.id = pp.id_pedido
        JOIN PRODUCTO pr ON pp.id_producto = pr.id
        JOIN CATEGORIA cat ON pr.id_categoria = cat.id
        WHERE p.fecha_pedido BETWEEN %s AND %s
        GROUP BY cat.nombre
        ORDER BY total_vendido DESC
        """
        return self.execute_query(query, (fecha_inicio, fecha_fin))
    
    def get_productos_mas_vendidos(self, fecha_inicio, fecha_fin, limite=10):
        """Obtiene productos más vendidos"""
        query = """
        SELECT 
            pr.nombre as producto,
            SUM(pp.cantidad) as cantidad,
            SUM(pp.total) as total_vendido,
            AVG(pp.precio) as precio_promedio
        FROM PEDIDO_PRODUCTO pp
        JOIN PRODUCTO pr ON pp.id_producto = pr.id
        JOIN PEDIDO p ON pp.id_pedido = p.id
        WHERE p.fecha_pedido BETWEEN %s AND %s
        GROUP BY pr.nombre
        ORDER BY cantidad DESC
        LIMIT %s
        """
        return self.execute_query(query, (fecha_inicio, fecha_fin, limite))
    
    def get_clientes_datos(self, fecha_inicio, fecha_fin):
        """Obtiene datos agregados de clientes"""
        query = """
        SELECT 
            c.ci,
            c.nombre,
            COUNT(p.id) as total_pedidos,
            SUM(p.total) as total_gastado,
            AVG(p.total) as ticket_promedio,
            MAX(p.fecha_pedido) as ultima_compra
        FROM CLIENTE c
        LEFT JOIN PEDIDO p ON c.ci = p.ci_cliente
            AND p.fecha_pedido BETWEEN %s AND %s
        GROUP BY c.ci, c.nombre
        ORDER BY total_gastado DESC NULLS LAST
        """
        return self.execute_query(query, (fecha_inicio, fecha_fin))
    
    # ===== QUERIES INVENTARIO =====
    def get_inventario_datos(self):
        """Obtiene estado actual del inventario"""
        query = """
        SELECT 
            i.id,
            i.nombre,
            i.stock,
            i.stock_minimo,
            i.medida,
            CASE 
                WHEN i.stock < i.stock_minimo THEN 'BAJO'
                WHEN i.stock < i.stock_minimo * 1.5 THEN 'ALERTA'
                ELSE 'NORMAL'
            END as estado_stock
        FROM INSUMO i
        ORDER BY i.stock ASC
        """
        return self.execute_query(query)
    
    def get_productos_stock(self):
        """Obtiene estado de productos terminados"""
        query = """
        SELECT 
            pr.id,
            pr.nombre,
            cat.nombre as categoria,
            pr.stock,
            pr.stock_minimo,
            pr.precio,
            (pr.stock * pr.precio) as valor_inventario
        FROM PRODUCTO pr
        JOIN CATEGORIA cat ON pr.id_categoria = cat.id
        ORDER BY pr.stock ASC
        """
        return self.execute_query(query)
    
    # ===== QUERIES PRODUCCIÓN =====
    def get_produccion_datos(self, fecha_inicio, fecha_fin):
        """Obtiene datos de producción"""
        query = """
        SELECT 
            prod.id,
            prod.fecha,
            prod.descripcion,
            prod.terminado,
            r.id as id_receta,
            pr.nombre as producto
        FROM PRODUCCION prod
        JOIN RECETA r ON prod.id_receta = r.id
        JOIN PRODUCTO pr ON r.id_producto = pr.id
        WHERE prod.fecha BETWEEN %s AND %s
        ORDER BY prod.fecha DESC
        """
        return self.execute_query(query, (fecha_inicio, fecha_fin))
    
    # ===== QUERIES COMPRAS =====
    def get_compras_datos(self, fecha_inicio, fecha_fin):
        """Obtiene datos de compras a proveedores"""
        query = """
        SELECT 
            nc.id,
            nc.fecha_pedido,
            nc.fecha_entrega,
            pr.nombre as proveedor,
            SUM(ci.cantidad) as cantidad_items,
            SUM(ci.total) as total_compra
        FROM NOTA_COMPRA nc
        JOIN PROVEEDOR pr ON nc.codigo_proveedor = pr.codigo
        LEFT JOIN COMPRA_INSUMO ci ON nc.id = ci.id_nota_compra
        WHERE nc.fecha_pedido BETWEEN %s AND %s
        GROUP BY nc.id, pr.nombre, nc.fecha_pedido, nc.fecha_entrega
        ORDER BY nc.fecha_pedido DESC
        """
        return self.execute_query(query, (fecha_inicio, fecha_fin))
