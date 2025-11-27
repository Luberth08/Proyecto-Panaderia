from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from datetime import datetime

@dataclass
class ReportMetadata:
    """Metadatos de un reporte"""
    titulo: str
    tipo: str
    fecha_generacion: datetime
    usuario: str
    periodo: str
    descripcion: Optional[str] = None
    tags: List[str] = field(default_factory=list)

@dataclass
class ReportData:
    """Datos principales del reporte"""
    metadata: ReportMetadata
    datos_principales: Dict[str, Any]
    datos_detallados: Dict[str, Any]
    insights: List[str]
    recomendaciones: List[str]
    graficos: Dict[str, str] = field(default_factory=dict)

@dataclass
class VentasReport:
    """Reporte de Ventas"""
    total_ventas: float
    cantidad_ordenes: int
    ticket_promedio: float
    productos_vendidos: int
    clientes_unicos: int
    categoria_mas_vendida: str
    producto_mas_vendido: str
    variacion_mes_anterior: float
    tendencia: str

@dataclass
class ComprasReport:
    """Reporte de Compras"""
    total_compras: float
    cantidad_ordenes_compra: int
    cantidad_proveedores: int
    promedio_compra: float
    proveedor_principal: str
    insumo_mas_comprado: str
    variacion_mes_anterior: float

@dataclass
class ProduccionReport:
    """Reporte de Producción"""
    total_producido: float
    cantidad_lotes: int
    productos_fabricados: int
    recetas_utilizadas: int
    eficiencia_produccion: float
    desperdicio_porcentaje: float
    tiempo_promedio_lote: float

@dataclass
class InventarioReport:
    """Reporte de Inventario"""
    stock_total_valor: float
    cantidad_items: int
    productos_bajo_stock: int
    rotacion_promedio: float
    items_sin_movimiento: int
    categoria_mayor_inventario: str
    insumo_critico: Optional[str]

@dataclass
class PedidosReport:
    """Reporte de Pedidos de Clientes"""
    total_pedidos: int
    pedidos_completados: int
    pedidos_pendientes: int
    tiempo_promedio_entrega: float
    tasa_cumplimiento: float
    cliente_mas_pedidos: str
    producto_mas_pedido: str

@dataclass
class ClientesReport:
    """Reporte de Clientes"""
    total_clientes: int
    clientes_activos: int
    clientes_nuevos_periodo: int
    valor_promedio_cliente: float
    cliente_vip: str
    frecuencia_compra_promedio: int
    tasa_retencion: float
    segmentacion: Dict[str, int]

@dataclass
class FinancieroReport:
    """Reporte Financiero Completo"""
    ingresos_totales: float
    gastos_totales: float
    ganancia_neta: float
    margen_ganancia: float
    rentabilidad_por_producto: Dict[str, float]
    proyeccion_proximos_meses: List[float]
    salud_financiera: str
    indicadores_clave: Dict[str, float]
