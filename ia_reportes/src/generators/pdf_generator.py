from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from datetime import datetime
import logging
from src.config.settings import REPORTS_OUTPUT_DIR, PANADERIA

logger = logging.getLogger(__name__)

class PDFGenerator:
    """Generador de reportes en PDF"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._crear_estilos_personalizados()
    
    def _crear_estilos_personalizados(self):
        """Crea estilos de párrafo personalizados"""
        # Verificar si el estilo no existe antes de agregarlo
        if 'Titulo' not in self.styles:
            self.styles.add(ParagraphStyle(
                name='Titulo',
                parent=self.styles['Heading1'],
                fontSize=24,
                textColor=colors.HexColor('#1a472a'),
                spaceAfter=30,
                alignment=TA_CENTER,
                fontName='Helvetica-Bold'
            ))
        
        if 'Subtitulo' not in self.styles:
            self.styles.add(ParagraphStyle(
                name='Subtitulo',
                parent=self.styles['Heading2'],
                fontSize=14,
                textColor=colors.HexColor('#2d5a3d'),
                spaceAfter=12,
                fontName='Helvetica-Bold'
            ))
        
        # No agregar 'Normal' porque ya existe en getSampleStyleSheet()
    
    def generar_reporte_ventas(self, datos: dict) -> str:
        """Genera reporte de ventas en PDF"""
        try:
            filename = f"{REPORTS_OUTPUT_DIR}/Reporte_Ventas_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            doc = SimpleDocTemplate(filename, pagesize=letter)
            elements = []
            
            # Encabezado
            elements.extend(self._crear_encabezado(f"REPORTE DE VENTAS - {datos.get('periodo', 'N/A')}"))
            
            # Resumen Ejecutivo
            elements.append(Paragraph("RESUMEN EJECUTIVO", self.styles['Subtitulo']))
            elementos_resumen = [
                ['Métrica', 'Valor'],
                ['Total Ventas', f"${datos.get('total_ventas', 0):,.2f}"],
                ['Cantidad de Pedidos', str(datos.get('cantidad_ordenes', 0))],
                ['Ticket Promedio', f"${datos.get('ticket_promedio', 0):,.2f}"],
                ['Productos Vendidos', str(datos.get('productos_vendidos', 0))],
                ['Clientes Únicos', str(datos.get('clientes_unicos', 0))],
                ['Variación M.A.', f"{datos.get('variacion_mes_anterior', 0):+.2f}%"],
            ]
            
            tabla_resumen = Table(elementos_resumen, colWidths=[3*inch, 2*inch])
            tabla_resumen.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a472a')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ]))
            
            elements.append(tabla_resumen)
            elements.append(Spacer(1, 0.3*inch))
            
            # Top Productos
            if datos.get('productos_vendidos_detalle'):
                elements.append(Paragraph("PRODUCTOS MÁS VENDIDOS", self.styles['Subtitulo']))
                elementos_productos = [['Producto', 'Cantidad', 'Total']]
                
                for prod in datos.get('productos_vendidos_detalle', [])[:10]:
                    elementos_productos.append([
                        prod.get('nombre', 'N/A'),
                        str(prod.get('cantidad', 0)),
                        f"${prod.get('total', 0):,.2f}"
                    ])
                
                tabla_productos = Table(elementos_productos, colWidths=[2.5*inch, 1.5*inch, 1.5*inch])
                tabla_productos.setStyle(self._tabla_estilo_standar())
                elements.append(tabla_productos)
                elements.append(Spacer(1, 0.3*inch))
            
            # Insights
            if datos.get('insights'):
                elements.append(Paragraph("INSIGHTS CLAVE", self.styles['Subtitulo']))
                for insight in datos.get('insights', []):
                    elements.append(Paragraph(f"• {insight}", self.styles['Normal']))
                elements.append(Spacer(1, 0.3*inch))
            
            # Recomendaciones
            if datos.get('recomendaciones'):
                elements.append(Paragraph("RECOMENDACIONES", self.styles['Subtitulo']))
                for recom in datos.get('recomendaciones', []):
                    elements.append(Paragraph(f"• {recom}", self.styles['Normal']))
            
            # Pie de página
            elements.extend(self._crear_pie_pagina())
            
            doc.build(elements)
            logger.info(f"PDF de ventas generado: {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error generando PDF de ventas: {str(e)}")
            raise
    
    def generar_reporte_inventario(self, datos: dict) -> str:
        """Genera reporte de inventario en PDF"""
        try:
            filename = f"{REPORTS_OUTPUT_DIR}/Reporte_Inventario_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            doc = SimpleDocTemplate(filename, pagesize=letter)
            elements = []
            
            elements.extend(self._crear_encabezado("REPORTE DE INVENTARIO"))
            
            # Resumen
            elements.append(Paragraph("ESTADO ACTUAL DEL INVENTARIO", self.styles['Subtitulo']))
            elementos_resumen = [
                ['Stock Total (Valor)', f"${datos.get('stock_total_valor', 0):,.2f}"],
                ['Cantidad de Items', str(datos.get('cantidad_items', 0))],
                ['Items Bajo Stock', str(datos.get('productos_bajo_stock', 0))],
                ['Rotación Promedio', f"{datos.get('rotacion_promedio', 0):.2f} veces/mes"],
                ['Items Sin Movimiento', str(datos.get('items_sin_movimiento', 0))],
            ]
            
            tabla_estado = Table([[k, v] for k, v in elementos_resumen], colWidths=[3*inch, 2*inch])
            tabla_estado.setStyle(self._tabla_estilo_standar())
            elements.append(tabla_estado)
            
            doc.build(elements)
            logger.info(f"PDF de inventario generado: {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error generando PDF de inventario: {str(e)}")
            raise
    
    def _crear_encabezado(self, titulo: str) -> list:
        """Crea encabezado estándar para reportes"""
        elementos = []
        
        # Título panadería
        elementos.append(Paragraph(PANADERIA['nombre'].upper(), self.styles['Titulo']))
        elementos.append(Paragraph(f"{PANADERIA['ubicacion']} | {PANADERIA['telefono']}", 
                                  self.styles['Normal']))
        elementos.append(Spacer(1, 0.2*inch))
        
        # Título reporte
        elementos.append(Paragraph(titulo, self.styles['Subtitulo']))
        elementos.append(Paragraph(f"Generado: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", 
                                  self.styles['Normal']))
        elementos.append(Spacer(1, 0.3*inch))
        
        return elementos
    
    def _crear_pie_pagina(self) -> list:
        """Crea pie de página estándar"""
        elementos = []
        elementos.append(Spacer(1, 0.5*inch))
        elementos.append(Paragraph("_" * 80, self.styles['Normal']))
        elementos.append(Paragraph(
            f"Reporte confidencial - {PANADERIA['nombre']} © {datetime.now().year}",
            self.styles['Normal']
        ))
        return elementos
    
    def _tabla_estilo_standar(self) -> TableStyle:
        """Retorna estilo estándar para tablas"""
        return TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a472a')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.lightgrey),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
        ])
