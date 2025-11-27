import logging
import json
from datetime import datetime
from src.config.settings import REPORTS_LOGS_DIR

def configurar_logging():
    """Configura logging para la aplicación"""
    log_file = f"{REPORTS_LOGS_DIR}/ia_reportes_{datetime.now().strftime('%Y%m%d')}.log"
    
    # StreamHandler con encoding UTF-8 para Windows
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    
    # FileHandler con encoding UTF-8
    file_handler = logging.FileHandler(log_file, encoding='utf-8')
    file_handler.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
    
    logging.basicConfig(
        level=logging.INFO,
        handlers=[file_handler, stream_handler]
    )
    
    return logging.getLogger(__name__)

def serializar_datos(obj):
    """Serializa objetos para JSON"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif hasattr(obj, '__dict__'):
        return obj.__dict__
    return str(obj)

def deserializar_json(datos_json: str) -> dict:
    """Deserializa JSON a diccionario"""
    try:
        return json.loads(datos_json)
    except Exception as e:
        logging.error(f"Error deserializando JSON: {str(e)}")
        return {}

def formatear_fecha(fecha) -> str:
    """Formatea fecha a formato legible"""
    if isinstance(fecha, str):
        fecha = datetime.fromisoformat(fecha)
    return fecha.strftime('%d/%m/%Y')

def formatear_moneda(valor: float) -> str:
    """Formatea número como moneda"""
    return f"${valor:,.2f}"

def formatear_porcentaje(valor: float, decimales: int = 2) -> str:
    """Formatea número como porcentaje"""
    return f"{valor:.{decimales}f}%"

def calcular_variacion_porcentual(actual: float, anterior: float) -> float:
    """Calcula variación porcentual entre dos valores"""
    if anterior == 0:
        return 0
    return ((actual - anterior) / anterior) * 100

def agrupar_por_fecha(datos: list, clave_fecha: str = 'fecha') -> dict:
    """Agrupa datos por fecha"""
    agrupado = {}
    for item in datos:
        fecha = item.get(clave_fecha)
        if fecha not in agrupado:
            agrupado[fecha] = []
        agrupado[fecha].append(item)
    return agrupado

def sumar_valores(datos: list, clave: str) -> float:
    """Suma valores de una clave en lista de dicts"""
    return sum(item.get(clave, 0) for item in datos)

def promedio_valores(datos: list, clave: str) -> float:
    """Calcula promedio de valores"""
    if not datos:
        return 0
    total = sum(item.get(clave, 0) for item in datos)
    return total / len(datos)

def obtener_maximo(datos: list, clave: str) -> any:
    """Obtiene el máximo valor"""
    if not datos:
        return None
    return max(datos, key=lambda x: x.get(clave, 0))

def obtener_minimo(datos: list, clave: str) -> any:
    """Obtiene el mínimo valor"""
    if not datos:
        return None
    return min(datos, key=lambda x: x.get(clave, 0))
