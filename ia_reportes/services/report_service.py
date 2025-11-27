from db.repositories import VentasRepository, InventarioRepository, ClientesRepository
from utils.helpers import DateUtils, Formatters, Validators
from constants.report_types import EJEMPLOS_PROMPTS, TIPOS_REPORTES
import logging

logger = logging.getLogger(__name__)

class ReportService:
    """Servicio para generar reportes basados en interpretación"""
    
    def generar_reporte(self, texto_solicitud, modulo, usuario_id=None, formato="json"):
        """
        Generar reporte completo
        """
        try:
            # Validar entrada
            es_valido, mensaje = Validators.validate_texto_solicitud(texto_solicitud)
            if not es_valido:
                raise ValueError(mensaje)
            
            # Validar módulo
            if not Validators.validate_modulo(modulo):
                raise ValueError(f"Módulo '{modulo}' no válido")
            
            # Generar según módulo
            if modulo == "ventas":
                datos = self._generar_reporte_ventas()
            elif modulo == "inventario":
                datos = self._generar_reporte_inventario()
            elif modulo == "produccion":
                datos = self._generar_reporte_produccion()
            elif modulo == "pedidos":
                datos = self._generar_reporte_pedidos()
            else:
                raise ValueError(f"Módulo no soportado: {modulo}")
            
            # Formatear según salida
            if formato == "json":
                return datos
            elif formato == "excel":
                return self._exportar_excel(datos, modulo)
            elif formato == "pdf":
                return self._exportar_pdf(datos, modulo)
            else:
                return datos
        
        except Exception as e:
            logger.error(f"❌ Error generando reporte: {e}")
            raise
    
    def _generar_reporte_ventas(self):
        """Generar reporte de ventas"""
        try:
            inicio, fin = DateUtils.get_current_month_range()
            
            # Obtener datos
            total = VentasRepository.obtener_total_ventas(inicio, fin)
            por_categoria = VentasRepository.obtener_ventas_por_categoria(inicio, fin)
            clientes_top = VentasRepository.obtener_clientes_top(inicio, fin)
            productos_top = VentasRepository.obtener_productos_top(inicio, fin)
            
            # Formatear respuesta
            return {
                "tipo": "ventas",
                "periodo": {
                    "inicio": inicio.isoformat(),
                    "fin": fin.isoformat()
                },
                "resumen": {
                    "total_ventas": Formatters.format_currency(total['total_ventas']),
                    "cantidad_pedidos": total['cantidad_pedidos'],
                    "ticket_promedio": Formatters.format_currency(total['ticket_promedio'])
                },
                "por_categoria": [
                    {
                        "categoria": item['categoria'],
                        "cantidad": item['cantidad_productos'],
                        "total": Formatters.format_currency(item['total_ventas']),
                        "precio_promedio": Formatters.format_currency(item['precio_promedio'])
                    }
                    for item in por_categoria
                ],
                "clientes_top": [
                    {
                        "nombre": item['cliente'],
                        "ci": item['ci'],
                        "pedidos": item['cantidad_pedidos'],
                        "total_gastado": Formatters.format_currency(item['total_gastado'])
                    }
                    for item in clientes_top
                ],
                "productos_top": [
                    {
                        "nombre": item['producto'],
                        "categoria": item['categoria'],
                        "precio": Formatters.format_currency(item['precio']),
                        "vendidos": item['total_vendido'],
                        "ingresos": Formatters.format_currency(item['ingresos_generados'])
                    }
                    for item in productos_top
                ]
            }
        except Exception as e:
            logger.error(f"❌ Error en reporte ventas: {e}")
            raise
    
    def _generar_reporte_inventario(self):
        """Generar reporte de inventario"""
        try:
            estado = InventarioRepository.obtener_estado_stock()
            bajo_stock = InventarioRepository.obtener_bajo_stock()
            
            return {
                "tipo": "inventario",
                "fecha_generacion": DateUtils.get_current_month_range()[1].isoformat(),
                "resumen": {
                    "total_productos": len(estado),
                    "productos_bajo_stock": len(bajo_stock),
                    "valor_total_inventario": Formatters.format_currency(
                        sum([item.get('valor_total', 0) for item in estado])
                    )
                },
                "estado_completo": [
                    {
                        "producto": item['producto'],
                        "categoria": item['categoria'],
                        "stock": item['stock'],
                        "stock_minimo": item['stock_minimo'],
                        "precio": Formatters.format_currency(item['precio']),
                        "valor_total": Formatters.format_currency(item['valor_total'])
                    }
                    for item in estado
                ],
                "bajo_stock": [
                    {
                        "producto": item['producto'],
                        "categoria": item['categoria'],
                        "stock_actual": item['stock'],
                        "stock_minimo": item['stock_minimo'],
                        "falta": item['falta_para_minimo']
                    }
                    for item in bajo_stock
                ]
            }
        except Exception as e:
            logger.error(f"❌ Error en reporte inventario: {e}")
            raise
    
    def _generar_reporte_produccion(self):
        """Generar reporte de producción (placeholder)"""
        return {
            "tipo": "produccion",
            "estado": "pendiente_configuracion",
            "mensaje": "Módulo de producción requiere tablas específicas"
        }
    
    def _generar_reporte_pedidos(self):
        """Generar reporte de pedidos (placeholder)"""
        return {
            "tipo": "pedidos",
            "estado": "pendiente_configuracion",
            "mensaje": "Módulo de pedidos requiere consultas específicas"
        }
    
    def obtener_ejemplos_modulo(self, modulo):
        """Obtener ejemplos para un módulo"""
        if modulo not in EJEMPLOS_PROMPTS:
            raise ValueError(f"Módulo '{modulo}' no tiene ejemplos")
        return EJEMPLOS_PROMPTS[modulo]
    
    def obtener_contexto_empresa(self):
        """Obtener contexto de la empresa para consultas"""
        from db.repositories import VentasRepository, InventarioRepository
        
        try:
            # Obtener datos contextuales
            return {
                "nombre_empresa": "Panadería",
                "modulos_disponibles": list(TIPOS_REPORTES.keys()),
                "tipos_reportes": TIPOS_REPORTES,
                "ejemplos": EJEMPLOS_PROMPTS
            }
        except Exception as e:
            logger.error(f"❌ Error obteniendo contexto: {e}")
            raise
    
    def _exportar_excel(self, datos, modulo):
        """Exportar reporte a Excel"""
        # Implementar con openpyxl
        return {
            "status": "pendiente",
            "formato": "excel",
            "modulo": modulo
        }
    
    def _exportar_pdf(self, datos, modulo):
        """Exportar reporte a PDF"""
        # Implementar con reportlab
        return {
            "status": "pendiente",
            "formato": "pdf",
            "modulo": modulo
        }
