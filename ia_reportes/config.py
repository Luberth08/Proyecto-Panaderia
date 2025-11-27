import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
OPENAI_TEMPERATURE = float(os.getenv("OPENAI_TEMPERATURE", 0.1))
OPENAI_MAX_TOKENS = int(os.getenv("OPENAI_MAX_TOKENS", 1500))

# Database Configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 5432)),
    "database": os.getenv("DB_NAME", "panaderia"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", ""),
}

# Backend API
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

# Flask
FLASK_ENV = os.getenv("FLASK_ENV", "development")
FLASK_PORT = int(os.getenv("FLASK_PORT", 5001))

# Report Limits
MAX_FILAS_REPORTE = int(os.getenv("MAX_FILAS_REPORTE", 1000))
CONTEXTO_EMPRESA_LIMIT = int(os.getenv("CONTEXTO_EMPRESA_LIMIT", 50))

# Tipos de reportes disponibles
TIPOS_REPORTES = {
    "ventas": ["total_periodo", "por_categoria", "clientes_top", "productos_top", "tendencias"],
    "produccion": ["produccion_periodo", "recetas_mas_usadas", "eficiencia", "costos"],
    "inventario": ["estado_stock", "bajo_stock", "rotacion", "valorizacion"],
    "pedidos": ["estado_pedidos", "clientes_frecuentes", "tiempos_entrega", "satisfaccion"],
}
