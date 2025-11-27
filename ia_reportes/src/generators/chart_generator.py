import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime
import logging
import pandas as pd
from src.config.settings import REPORTS_OUTPUT_DIR, CHART_CONFIG

logger = logging.getLogger(__name__)

class ChartGenerator:
    """Generador de gráficos para reportes"""
    
    def __init__(self):
        self.style = CHART_CONFIG['style']
        self.dpi = CHART_CONFIG['dpi']
        self.figsize = CHART_CONFIG['figsize']
        plt.style.use(self.style)
        sns.set_palette(CHART_CONFIG['color_palette'])
    
    def generar_ventas_por_categoria(self, datos_categoria: list) -> str:
        """Gráfico de ventas por categoría"""
        try:
            df = pd.DataFrame(datos_categoria)
            
            fig, ax = plt.subplots(figsize=self.figsize)
            
            ax.barh(df['categoria'], df['total_vendido'], color='#2d5a3d')
            ax.set_xlabel('Total Vendido ($)', fontsize=12, fontweight='bold')
            ax.set_ylabel('Categoría', fontsize=12, fontweight='bold')
            ax.set_title('Ventas por Categoría', fontsize=14, fontweight='bold', pad=20)
            
            # Agregar valores en las barras
            for i, v in enumerate(df['total_vendido']):
                ax.text(v, i, f' ${v:,.2f}', va='center', fontweight='bold')
            
            plt.tight_layout()
            
            filename = f"{REPORTS_OUTPUT_DIR}/grafico_ventas_categoria_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            plt.savefig(filename, dpi=self.dpi, bbox_inches='tight')
            plt.close()
            
            logger.info(f"Gráfico de ventas por categoría generado: {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error generando gráfico: {str(e)}")
            raise
    
    def generar_productos_mas_vendidos(self, datos_productos: list, limite=10) -> str:
        """Gráfico de productos más vendidos"""
        try:
            df = pd.DataFrame(datos_productos).head(limite)
            
            fig, ax = plt.subplots(figsize=self.figsize)
            
            barras = ax.bar(range(len(df)), df['cantidad'], color='#1a472a', alpha=0.8)
            ax.set_xticks(range(len(df)))
            ax.set_xticklabels(df['producto'], rotation=45, ha='right')
            ax.set_ylabel('Cantidad Vendida (unidades)', fontsize=12, fontweight='bold')
            ax.set_title('Top 10 Productos Más Vendidos', fontsize=14, fontweight='bold', pad=20)
            
            # Agregar valores en barras
            for barra in barras:
                height = barra.get_height()
                ax.text(barra.get_x() + barra.get_width()/2., height,
                       f'{int(height)}', ha='center', va='bottom', fontweight='bold')
            
            plt.tight_layout()
            
            filename = f"{REPORTS_OUTPUT_DIR}/grafico_productos_vendidos_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            plt.savefig(filename, dpi=self.dpi, bbox_inches='tight')
            plt.close()
            
            logger.info(f"Gráfico de productos vendidos generado: {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error generando gráfico: {str(e)}")
            raise
    
    def generar_tendencias_temporales(self, datos_timeseries: list) -> str:
        """Gráfico de tendencias a lo largo del tiempo"""
        try:
            df = pd.DataFrame(datos_timeseries)
            
            fig, ax = plt.subplots(figsize=self.figsize)
            
            ax.plot(df['fecha'], df['total'], marker='o', linewidth=2, 
                   markersize=8, color='#1a472a', label='Ventas')
            
            ax.fill_between(range(len(df)), df['total'], alpha=0.3, color='#1a472a')
            
            ax.set_xlabel('Fecha', fontsize=12, fontweight='bold')
            ax.set_ylabel('Total ($)', fontsize=12, fontweight='bold')
            ax.set_title('Tendencias de Ventas en el Tiempo', fontsize=14, fontweight='bold', pad=20)
            
            plt.xticks(rotation=45, ha='right')
            plt.tight_layout()
            
            filename = f"{REPORTS_OUTPUT_DIR}/grafico_tendencias_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            plt.savefig(filename, dpi=self.dpi, bbox_inches='tight')
            plt.close()
            
            logger.info(f"Gráfico de tendencias generado: {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error generando gráfico: {str(e)}")
            raise
    
    def generar_estado_inventario(self, datos_inventario: list) -> str:
        """Gráfico comparativo de inventario (actual vs mínimo)"""
        try:
            df = pd.DataFrame(datos_inventario).head(15)
            
            fig, ax = plt.subplots(figsize=self.figsize)
            
            x = range(len(df))
            width = 0.35
            
            ax.bar([i - width/2 for i in x], df['stock_actual'], width, 
                  label='Stock Actual', color='#2d5a3d', alpha=0.8)
            ax.bar([i + width/2 for i in x], df['stock_minimo'], width, 
                  label='Stock Mínimo', color='#e74c3c', alpha=0.8)
            
            ax.set_xticks(x)
            ax.set_xticklabels(df['nombre'], rotation=45, ha='right')
            ax.set_ylabel('Cantidad', fontsize=12, fontweight='bold')
            ax.set_title('Estado de Inventario (Actual vs Mínimo)', fontsize=14, fontweight='bold', pad=20)
            ax.legend()
            
            plt.tight_layout()
            
            filename = f"{REPORTS_OUTPUT_DIR}/grafico_inventario_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            plt.savefig(filename, dpi=self.dpi, bbox_inches='tight')
            plt.close()
            
            logger.info(f"Gráfico de inventario generado: {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error generando gráfico: {str(e)}")
            raise
    
    def generar_pie_clientes(self, datos_clientes: list) -> str:
        """Gráfico de distribución de clientes"""
        try:
            df = pd.DataFrame(datos_clientes)
            
            fig, ax = plt.subplots(figsize=(10, 8))
            
            colores = sns.color_palette(CHART_CONFIG['color_palette'], len(df))
            wedges, texts, autotexts = ax.pie(
                df['total_gastado'], 
                labels=df['nombre'],
                autopct='%1.1f%%',
                colors=colores,
                startangle=90
            )
            
            for autotext in autotexts:
                autotext.set_color('white')
                autotext.set_fontweight('bold')
            
            ax.set_title('Distribución de Ventas por Cliente', fontsize=14, fontweight='bold', pad=20)
            
            plt.tight_layout()
            
            filename = f"{REPORTS_OUTPUT_DIR}/grafico_clientes_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            plt.savefig(filename, dpi=self.dpi, bbox_inches='tight')
            plt.close()
            
            logger.info(f"Gráfico de clientes generado: {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error generando gráfico: {str(e)}")
            raise
    
    def generar_dashboard_interactivo(self, datos_multiples: dict) -> str:
        """Genera dashboard interactivo en HTML con Plotly"""
        try:
            from plotly.subplots import make_subplots
            
            fig = make_subplots(
                rows=2, cols=2,
                subplot_titles=("Ventas por Categoría", "Top Productos", 
                              "Inventario Crítico", "Clientes Top 5")
            )
            
            # Ventas por categoría
            if datos_multiples.get('ventas_categoria'):
                df_cat = pd.DataFrame(datos_multiples['ventas_categoria'])
                fig.add_trace(
                    go.Bar(x=df_cat['categoria'], y=df_cat['total_vendido'], name='Ventas'),
                    row=1, col=1
                )
            
            # Top productos
            if datos_multiples.get('top_productos'):
                df_prod = pd.DataFrame(datos_multiples['top_productos']).head(5)
                fig.add_trace(
                    go.Bar(x=df_prod['producto'], y=df_prod['cantidad'], name='Cantidad'),
                    row=1, col=2
                )
            
            # Inventario crítico
            if datos_multiples.get('inventario_critico'):
                df_inv = pd.DataFrame(datos_multiples['inventario_critico'])
                fig.add_trace(
                    go.Bar(x=df_inv['nombre'], y=df_inv['cantidad'], name='Stock'),
                    row=2, col=1
                )
            
            # Top clientes
            if datos_multiples.get('top_clientes'):
                df_cli = pd.DataFrame(datos_multiples['top_clientes']).head(5)
                fig.add_trace(
                    go.Bar(x=df_cli['nombre'], y=df_cli['total_gastado'], name='Gasto Total'),
                    row=2, col=2
                )
            
            fig.update_layout(height=800, showlegend=False, title_text="Dashboard de Reportes")
            
            filename = f"{REPORTS_OUTPUT_DIR}/dashboard_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
            fig.write_html(filename)
            
            logger.info(f"Dashboard generado: {filename}")
            return filename
            
        except Exception as e:
            logger.error(f"Error generando dashboard: {str(e)}")
            raise
