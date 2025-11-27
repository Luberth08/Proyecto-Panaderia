from openai import OpenAI
from config import OPENAI_API_KEY, OPENAI_MODEL, OPENAI_TEMPERATURE, OPENAI_MAX_TOKENS
from constants.report_types import EJEMPLOS_PROMPTS
import logging
import json

logger = logging.getLogger(__name__)

class InterpretService:
    """Servicio para interpretar prompts con IA"""
    
    def __init__(self):
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        self.model = OPENAI_MODEL
    
    def interpretar(self, texto_solicitud, contexto=None):
        """
        Interpreta un prompt en lenguaje natural
        Retorna estructura JSON con tipo de reporte y parámetros
        """
        try:
            # Construir prompt para el sistema
            system_prompt = self._construir_system_prompt()
            
            # Enviar a OpenAI
            response = self.client.chat.completions.create(
                model=self.model,
                temperature=OPENAI_TEMPERATURE,
                max_tokens=OPENAI_MAX_TOKENS,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": texto_solicitud}
                ]
            )
            
            # Extraer respuesta
            contenido = response.choices[0].message.content
            
            # Parsear JSON
            try:
                interpretacion = json.loads(contenido)
            except json.JSONDecodeError:
                # Si no es JSON válido, intentar extraerlo
                interpretacion = self._parse_json_fallback(contenido)
            
            logger.info(f"✅ Interpretación exitosa: {interpretacion}")
            return interpretacion
        
        except Exception as e:
            logger.error(f"❌ Error interpretando: {e}")
            raise
    
    def _construir_system_prompt(self):
        """Construir prompt del sistema para OpenAI"""
        return """Eres un asistente especializado en generar reportes para una panadería.

Tu tarea es interpretar solicitudes en lenguaje natural y retornar un JSON con la siguiente estructura:

{
    "tipo_reporte": "ventas_total|ventas_categoria|clientes_top|productos_top|estado_stock|bajo_stock|produccion_periodo|estado_pedidos",
    "modulo": "ventas|inventario|produccion|pedidos",
    "periodo": {
        "fecha_inicio": "YYYY-MM-DD",
        "fecha_fin": "YYYY-MM-DD"
    },
    "parametros": {
        "limite": 10,
        "ordenar_por": "total|cantidad|nombre",
        "filtro": "categoría especifica o null"
    },
    "formato_salida": "json|excel|pdf"
}

IMPORTANTE: 
- Siempre responde SOLO con JSON válido, sin explicaciones adicionales
- Si el usuario no especifica fechas, usa el mes actual
- Si no especifica formato, usa "json"
- Si pide "top", "principales", "mejores", usa límite de 10
- Detecta correctamente el módulo según las palabras clave:
  * "venta", "cliente", "producto vendido" → ventas
  * "inventario", "stock", "producto" → inventario
  * "producción", "receta" → producción
  * "pedido", "entrega" → pedidos

Ejemplos de interpretaciones válidas:
1. "Dime mis ventas del mes" → tipo: "ventas_total", periodo: mes actual
2. "¿Qué productos vendí más?" → tipo: "productos_top", limite: 10
3. "Stock bajo de productos" → tipo: "bajo_stock"
4. "¿Cómo va la producción?" → tipo: "produccion_periodo"
"""
    
    def _parse_json_fallback(self, contenido):
        """Intenta extraer JSON de una respuesta no estructurada"""
        import re
        
        # Buscar JSON en el contenido
        json_match = re.search(r'\{.*\}', contenido, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group())
            except:
                pass
        
        # Si no encuentra, retornar estructura por defecto
        return {
            "tipo_reporte": "ventas_total",
            "modulo": "ventas",
            "periodo": {"fecha_inicio": None, "fecha_fin": None},
            "error": "No se pudo parsear la respuesta correctamente"
        }
    
    @staticmethod
    def obtener_ejemplos():
        """Obtener ejemplos de prompts"""
        return EJEMPLOS_PROMPTS
