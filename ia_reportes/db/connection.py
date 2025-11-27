import psycopg2
from psycopg2.extras import RealDictCursor
from config import DB_CONFIG
import logging

logger = logging.getLogger(__name__)

class DatabaseConnection:
    """Maneja conexiones a PostgreSQL"""
    
    def __init__(self):
        self.connection = None
    
    def connect(self):
        """Establecer conexión"""
        try:
            self.connection = psycopg2.connect(**DB_CONFIG)
            logger.info("✅ Conectado a la base de datos")
            return self.connection
        except Exception as e:
            logger.error(f"❌ Error conectando BD: {e}")
            raise
    
    def disconnect(self):
        """Cerrar conexión"""
        if self.connection:
            self.connection.close()
            logger.info("❌ Desconectado de la base de datos")
    
    def execute_query(self, query, params=None):
        """Ejecutar query y retornar resultados"""
        try:
            if not self.connection:
                self.connect()
            
            cursor = self.connection.cursor(cursor_factory=RealDictCursor)
            cursor.execute(query, params or ())
            self.connection.commit()
            
            return cursor.fetchall()
        except Exception as e:
            logger.error(f"❌ Error ejecutando query: {e}")
            self.connection.rollback()
            raise
    
    def execute_single(self, query, params=None):
        """Ejecutar query y retornar un solo resultado"""
        try:
            if not self.connection:
                self.connect()
            
            cursor = self.connection.cursor(cursor_factory=RealDictCursor)
            cursor.execute(query, params or ())
            self.connection.commit()
            
            return cursor.fetchone()
        except Exception as e:
            logger.error(f"❌ Error ejecutando query: {e}")
            self.connection.rollback()
            raise

# Instancia global
db = DatabaseConnection()
