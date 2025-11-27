import os
from dotenv import load_dotenv
from datetime import datetime

# Cargar variables de entorno
load_dotenv()

# ===== CONFIGURACIÓN BASE =====
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

# ===== BASE DE DATOS =====
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', 5432)),
    'database': os.getenv('DB_NAME', 'panaderia_db'),
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', ''),
    'sslmode': 'require' if os.getenv('DB_SSL', 'False').lower() == 'true' else 'disable'
}

# ===== OPENAI / IA =====
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
MODEL_IA = os.getenv('MODEL_IA', 'gpt-4')
TEMPERATURE = float(os.getenv('TEMPERATURE', 0.7))
MAX_TOKENS = int(os.getenv('MAX_TOKENS', 2000))

# ===== RUTAS =====
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REPORTS_OUTPUT_DIR = os.path.join(BASE_DIR, os.getenv('REPORTS_OUTPUT_DIR', 'outputs'))
REPORTS_LOGS_DIR = os.path.join(BASE_DIR, os.getenv('REPORTS_LOGS_DIR', 'logs'))

# Crear directorios si no existen
os.makedirs(REPORTS_OUTPUT_DIR, exist_ok=True)
os.makedirs(REPORTS_LOGS_DIR, exist_ok=True)

# ===== CONFIGURACIÓN DE REPORTES =====
FECHA_INICIO_OPERACIONES = os.getenv('FECHA_INICIO_OPERACIONES', '2024-01-01')

# ===== CONFIGURACIÓN DE SERVIDOR =====
FLASK_HOST = os.getenv('FLASK_HOST', '127.0.0.1')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
FLASK_ENV = os.getenv('FLASK_ENV', 'development')

# ===== PANADERIA DATA =====
PANADERIA = {
    'nombre': os.getenv('PANADERIA_NOMBRE', 'Mi Panadería'),
    'ubicacion': os.getenv('PANADERIA_UBICACION', 'Tu Ciudad'),
    'telefono': os.getenv('PANADERIA_TELEFONO', '+123456789'),
    'email': os.getenv('PANADERIA_EMAIL', 'info@panaderia.com')
}

# ===== TIPOS DE REPORTES DISPONIBLES =====
REPORT_TYPES = {
    'VENTAS': 'Análisis completo de ventas',
    'COMPRAS': 'Análisis de compras a proveedores',
    'PRODUCCION': 'Análisis de producción y recetas',
    'INVENTARIO': 'Análisis de inventario y stock',
    'PEDIDOS': 'Análisis de pedidos de clientes',
    'CLIENTES': 'Análisis y segmentación de clientes',
    'FINANCIERO': 'Análisis financiero completo',
    'TENDENCIAS': 'Análisis de tendencias y proyecciones'
}

# ===== MÓDULOS DE ANÁLISIS =====
ANALYSIS_MODULES = [
    'ventas',
    'compras',
    'produccion',
    'inventario',
    'pedidos',
    'clientes',
    'financiero'
]

# ===== FORMATOS DE SALIDA =====
OUTPUT_FORMATS = ['pdf', 'excel', 'json']
GRAPH_FORMATS = ['png', 'svg', 'html']

# ===== CONFIGURACIÓN DE GRÁFICOS =====
CHART_CONFIG = {
    'style': 'seaborn-v0_8-darkgrid',
    'dpi': 300,
    'figsize': (14, 8),
    'color_palette': 'husl'
}
