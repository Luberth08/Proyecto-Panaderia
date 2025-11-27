"""
IA Reportes - Sistema de generación automática de reportes con IA
Para: Proyecto Panadería

Módulos:
- Database: Conexión y queries a PostgreSQL
- IA Service: Integración con OpenAI para análisis
- Generators: PDF, Excel, Gráficos
- API: Flask para comunicación con Frontend/Backend
"""

import sys
import os

# Agregar src al path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.api.routes import app
from src.utils.helpers import configurar_logging

# Configurar logging
logger = configurar_logging()

if __name__ == '__main__':
    logger.info("=" * 50)
    logger.info("[IA REPORTES] PANADERIA - Sistema de Reportes Inteligentes")
    logger.info("=" * 50)
    logger.info("Sistema de generacion de reportes con IA activado")
    logger.info("Documentacion: /docs o accede a /api/health")
    
    # Importar y ejecutar app Flask
    from src.config.settings import FLASK_HOST, FLASK_PORT, GEMINI_API_KEY
    
    if not GEMINI_API_KEY or GEMINI_API_KEY == 'your_gemini_api_key_here':
        logger.error("⚠️  ERROR: GEMINI_API_KEY no configurada correctamente")
        logger.error("Por favor configura tu .env con una API key válida de Google Gemini")
        sys.exit(1)
    
    app.run(host=FLASK_HOST, port=FLASK_PORT, debug=True)
