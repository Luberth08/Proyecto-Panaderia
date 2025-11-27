from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import logging
import json

from src.config.settings import FLASK_HOST, FLASK_PORT, OPENAI_API_KEY
from src.services.database_service import DatabaseService
from src.services.ia_service import IAService
from src.generators.pdf_generator import PDFGenerator
from src.generators.excel_generator import ExcelGenerator
from src.generators.chart_generator import ChartGenerator
from src.prompts.report_prompts import obtener_prompt
from src.utils.helpers import configurar_logging

# Configurar logging
logger = configurar_logging()

# Crear app Flask
app = Flask(__name__)
CORS(app)

# Inicializar servicios
db_service = DatabaseService()
ia_service = IAService()
pdf_generator = PDFGenerator()
excel_generator = ExcelGenerator()
chart_generator = ChartGenerator()

# ===== RUTAS PRINCIPALES =====

@app.route('/', methods=['GET'])
def index():
    """Página principal con información del servicio"""
    html = """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>IA Reportes - Panadería</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 900px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #1a472a; border-bottom: 3px solid #2d5a3d; padding-bottom: 10px; }
            h2 { color: #2d5a3d; margin-top: 30px; }
            .status { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; border-radius: 4px; font-family: monospace; }
            .method { display: inline-block; padding: 4px 8px; background: #007bff; color: white; border-radius: 3px; margin-right: 10px; font-weight: bold; }
            .get { background: #28a745; }
            .post { background: #ffc107; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
            ul { line-height: 1.8; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🍞 IA Reportes - Sistema de Reportes Inteligentes</h1>
            <p>Bienvenido al sistema de generación automática de reportes con IA para la Panadería.</p>
            
            <div class="status">
                <strong>✓ Estado:</strong> Servicio activo y listo para usar
            </div>
            
            <h2>📚 Documentación Rápida</h2>
            <ul>
                <li><a href="/api/health">Estado del API</a></li>
                <li><a href="/api/reportes/tipos">Tipos de reportes disponibles</a></li>
                <li><strong>Swagger UI:</strong> <a href="/docs">/docs</a></li>
            </ul>
            
            <h2>🔌 Endpoints Principales</h2>
            
            <div class="endpoint">
                <span class="method get">GET</span> <strong>/api/health</strong><br>
                Verifica que el servicio esté activo
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span> <strong>/api/reportes/tipos</strong><br>
                Lista todos los tipos de reportes disponibles
            </div>
            
            <div class="endpoint">
                <span class="method get">GET</span> <strong>/api/reportes/preview/{tipo}</strong><br>
                Preview de reporte sin generar archivos
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span> <strong>/api/reportes/generar</strong><br>
                Genera un reporte completo con IA
            </div>
            
            <h2>📊 Tipos de Reportes</h2>
            <ul>
                <li><strong>VENTAS:</strong> Análisis completo de ventas</li>
                <li><strong>COMPRAS:</strong> Análisis de compras a proveedores</li>
                <li><strong>PRODUCCION:</strong> Análisis de producción</li>
                <li><strong>INVENTARIO:</strong> Análisis de inventario</li>
                <li><strong>PEDIDOS:</strong> Análisis de pedidos</li>
                <li><strong>CLIENTES:</strong> Análisis de clientes</li>
                <li><strong>FINANCIERO:</strong> Análisis financiero</li>
                <li><strong>TENDENCIAS:</strong> Análisis de tendencias</li>
            </ul>
            
            <h2>🚀 Comenzar</h2>
            <ol>
                <li>Verifica el estado en <a href="/api/health">/api/health</a></li>
                <li>Consulta tipos disponibles en <a href="/api/reportes/tipos">/api/reportes/tipos</a></li>
                <li>Genera un reporte POST a <strong>/api/reportes/generar</strong></li>
            </ol>
            
            <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
                IA Reportes v1.0 | Panadería © 2025
            </p>
        </div>
    </body>
    </html>
    """
    return html, 200

@app.route('/docs', methods=['GET'])
def swagger_ui():
    """Redirige a documentación"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>API Docs - IA Reportes</title>
    </head>
    <body>
        <h1>Documentación API</h1>
        <p>La documentación interactiva estará disponible pronto.</p>
        <p>Por ahora, consulta los endpoints disponibles en la <a href="/">página principal</a></p>
    </body>
    </html>
    """, 200

# ===== RUTAS DE SALUD =====

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verifica que el servicio esté activo"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat(),
        'service': 'IA Reportes API'
    }), 200

# ===== RUTAS DE REPORTES =====

@app.route('/api/reportes/generar', methods=['POST'])
def generar_reporte():
    """
    Genera un reporte completo basado en prompt
    
    POST body:
    {
        "tipo_reporte": "VENTAS|INVENTARIO|PRODUCCION|etc",
        "prompt_custom": "Tu pregunta específica",
        "fecha_inicio": "2024-01-01",
        "fecha_fin": "2024-12-31",
        "formatos": ["pdf", "excel", "json"],
        "incluir_graficos": true
    }
    """
    try:
        datos = request.get_json()
        
        tipo_reporte = datos.get('tipo_reporte', 'GENERAL').upper()
        prompt_custom = datos.get('prompt_custom')
        
        # Manejar fechas con valores por defecto (últimos 30 días)
        fecha_inicio = datos.get('fecha_inicio', '')
        fecha_fin = datos.get('fecha_fin', '')
        
        # Función para convertir fechas de DD/MM/YYYY a YYYY-MM-DD
        def convertir_fecha(fecha_str):
            if not fecha_str or fecha_str.strip() == '':
                return None
            try:
                # Intenta formato DD/MM/YYYY
                from datetime import datetime as dt
                return dt.strptime(fecha_str.strip(), '%d/%m/%Y').strftime('%Y-%m-%d')
            except:
                try:
                    # Si no funciona, intenta formato YYYY-MM-DD
                    from datetime import datetime as dt
                    return dt.strptime(fecha_str.strip(), '%Y-%m-%d').strftime('%Y-%m-%d')
                except:
                    return None
        
        # Convertir fechas y aplicar valores por defecto
        fecha_inicio_convertida = convertir_fecha(fecha_inicio)
        fecha_fin_convertida = convertir_fecha(fecha_fin)
        
        if not fecha_inicio_convertida:
            fecha_inicio_convertida = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        if not fecha_fin_convertida:
            fecha_fin_convertida = datetime.now().strftime('%Y-%m-%d')
        
        fecha_inicio = fecha_inicio_convertida
        fecha_fin = fecha_fin_convertida
        
        formatos = datos.get('formatos', ['json'])
        incluir_graficos = datos.get('incluir_graficos', False)
        
        logger.info(f"Generando reporte: {tipo_reporte} para período {fecha_inicio} a {fecha_fin}")
        
        # Conectar a BD
        db_service.connect()
        
        # Obtener datos según tipo de reporte
        datos_reporte = _obtener_datos_reporte(tipo_reporte, fecha_inicio, fecha_fin)
        
        # Generar análisis con IA
        if prompt_custom:
            prompt = prompt_custom
        else:
            prompt = obtener_prompt(tipo_reporte)
        
        prompt_final = prompt.format(datos=json.dumps(datos_reporte, indent=2, default=str))
        
        analisis_ia = ia_service.generar_reporte(prompt_final, datos_reporte)
        
        # Agregar metadatos
        resultado = {
            'tipo_reporte': tipo_reporte,
            'fecha_generacion': datetime.now().isoformat(),
            'periodo': f"{fecha_inicio} a {fecha_fin}",
            'datos': datos_reporte,
            'analisis_ia': analisis_ia,
            'archivos_generados': []
        }
        
        # Generar archivos según formatos solicitados
        for formato in formatos:
            archivo = _generar_archivo_reporte(tipo_reporte, datos_reporte, analisis_ia, formato)
            if archivo:
                resultado['archivos_generados'].append({
                    'formato': formato,
                    'ruta': archivo
                })
        
        # Generar gráficos si se solicita
        if incluir_graficos:
            graficos = _generar_graficos_reporte(tipo_reporte, datos_reporte)
            resultado['graficos'] = graficos
        
        db_service.disconnect()
        
        return jsonify(resultado), 200
        
    except Exception as e:
        logger.error(f"Error generando reporte: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/reportes/tipos', methods=['GET'])
def listar_tipos_reportes():
    """Lista los tipos de reportes disponibles"""
    tipos = {
        'VENTAS': 'Análisis completo de ventas',
        'COMPRAS': 'Análisis de compras a proveedores',
        'PRODUCCION': 'Análisis de producción',
        'INVENTARIO': 'Análisis de inventario',
        'PEDIDOS': 'Análisis de pedidos',
        'CLIENTES': 'Análisis de clientes',
        'FINANCIERO': 'Análisis financiero',
        'TENDENCIAS': 'Análisis de tendencias'
    }
    return jsonify(tipos), 200

@app.route('/api/reportes/preview/<tipo>', methods=['GET'])
def preview_reporte(tipo):
    """Obtiene una vista previa de un reporte sin generar archivos"""
    try:
        fecha_inicio = request.args.get('fecha_inicio', (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d'))
        fecha_fin = request.args.get('fecha_fin', datetime.now().strftime('%Y-%m-%d'))
        
        db_service.connect()
        datos_reporte = _obtener_datos_reporte(tipo.upper(), fecha_inicio, fecha_fin)
        db_service.disconnect()
        
        return jsonify({
            'tipo': tipo,
            'datos_preview': datos_reporte,
            'periodo': f"{fecha_inicio} a {fecha_fin}"
        }), 200
        
    except Exception as e:
        logger.error(f"Error en preview: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ===== FUNCIONES AUXILIARES =====

def _obtener_datos_reporte(tipo_reporte: str, fecha_inicio: str, fecha_fin: str) -> dict:
    """Obtiene datos de BD según tipo de reporte"""
    datos = {
        'tipo': tipo_reporte,
        'periodo': f"{fecha_inicio} a {fecha_fin}"
    }
    
    if tipo_reporte == 'VENTAS':
        datos['ventas'] = db_service.get_ventas_data(fecha_inicio, fecha_fin)
        datos['por_categoria'] = db_service.get_ventas_por_categoria(fecha_inicio, fecha_fin)
        datos['top_productos'] = db_service.get_productos_mas_vendidos(fecha_inicio, fecha_fin)
        datos['clientes'] = db_service.get_clientes_datos(fecha_inicio, fecha_fin)
    
    elif tipo_reporte == 'INVENTARIO':
        datos['inventario'] = db_service.get_inventario_datos()
        datos['productos'] = db_service.get_productos_stock()
    
    elif tipo_reporte == 'PRODUCCION':
        datos['produccion'] = db_service.get_produccion_datos(fecha_inicio, fecha_fin)
    
    elif tipo_reporte == 'COMPRAS':
        datos['compras'] = db_service.get_compras_datos(fecha_inicio, fecha_fin)
    
    elif tipo_reporte == 'CLIENTES':
        datos['clientes'] = db_service.get_clientes_datos(fecha_inicio, fecha_fin)
    
    return datos

def _generar_archivo_reporte(tipo_reporte: str, datos: dict, analisis_ia: dict, formato: str) -> str:
    """Genera archivo de reporte en formato especificado"""
    try:
        if formato == 'pdf':
            if tipo_reporte == 'VENTAS':
                return pdf_generator.generar_reporte_ventas({**datos, **analisis_ia})
            elif tipo_reporte == 'INVENTARIO':
                return pdf_generator.generar_reporte_inventario({**datos, **analisis_ia})
        
        elif formato == 'excel':
            if tipo_reporte == 'VENTAS':
                return excel_generator.generar_reporte_ventas({**datos, **analisis_ia})
            elif tipo_reporte == 'INVENTARIO':
                return excel_generator.generar_reporte_inventario({**datos, **analisis_ia})
        
        elif formato == 'json':
            # JSON se retorna en respuesta principal
            return None
        
        return None
        
    except Exception as e:
        logger.error(f"Error generando archivo {formato}: {str(e)}")
        return None

def _generar_graficos_reporte(tipo_reporte: str, datos: dict) -> dict:
    """Genera gráficos para reporte"""
    graficos = {}
    
    try:
        if tipo_reporte == 'VENTAS':
            if datos.get('por_categoria'):
                graficos['categorias'] = chart_generator.generar_ventas_por_categoria(datos['por_categoria'])
            if datos.get('top_productos'):
                graficos['productos'] = chart_generator.generar_productos_mas_vendidos(datos['top_productos'])
        
        elif tipo_reporte == 'INVENTARIO':
            if datos.get('inventario'):
                graficos['inventario'] = chart_generator.generar_estado_inventario(datos['inventario'])
        
        elif tipo_reporte == 'CLIENTES':
            if datos.get('clientes'):
                graficos['clientes'] = chart_generator.generar_pie_clientes(datos['clientes'])
        
    except Exception as e:
        logger.error(f"Error generando gráficos: {str(e)}")
    
    return graficos

# ===== INICIO =====

if __name__ == '__main__':
    if not OPENAI_API_KEY:
        logger.warning("⚠️  OPENAI_API_KEY no configurada. La IA no funcionará.")
    
    logger.info(f"Iniciando servidor en {FLASK_HOST}:{FLASK_PORT}")
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=True)
