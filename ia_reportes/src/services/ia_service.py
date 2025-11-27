import requests
import logging
import json
from typing import Optional

logger = logging.getLogger(__name__)

class IAService:
    """Servicio de integración con Google Gemini API REST"""
    
    def __init__(self):
        # Importar configuración
        from src.config.settings import GEMINI_API_KEY, GEMINI_MODEL, GEMINI_BASE_URL, TEMPERATURE, MAX_TOKENS
        
        self.api_key = GEMINI_API_KEY
        self.model = GEMINI_MODEL
        self.base_url = GEMINI_BASE_URL
        self.temperature = TEMPERATURE
        self.max_tokens = MAX_TOKENS
        
        logger.info(f"IAService inicializado con Google Gemini API REST: {self.model}")
    
    def generar_reporte(self, prompt: str, datos_contexto: dict = None) -> dict:
        """
        Genera análisis usando IA basado en prompt
        
        Args:
            prompt: Prompt en lenguaje natural del usuario
            datos_contexto: Datos contextuales para enriquecer la respuesta
        
        Returns:
            dict con analysis, insights, recomendaciones
        """
        try:
            # Construir prompt con contexto
            prompt_completo = self._construir_prompt(prompt, datos_contexto)
            
            # URL del endpoint
            url = f"{self.base_url}/{self.model}:generateContent"
            
            # Headers
            headers = {
                'Content-Type': 'application/json',
                'X-goog-api-key': self.api_key
            }
            
            # Payload
            payload = {
                "contents": [
                    {
                        "parts": [
                            {
                                "text": prompt_completo
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": self.temperature,
                    "maxOutputTokens": self.max_tokens,
                }
            }
            
            # Hacer request
            response = requests.post(url, json=payload, headers=headers, timeout=60)
            
            # Verificar respuesta
            if response.status_code != 200:
                logger.error(f"Error en Gemini API: {response.status_code} - {response.text}")
                raise Exception(f"Gemini API error: {response.status_code} - {response.text}")
            
            # Parsear respuesta
            data = response.json()
            contenido = data['candidates'][0]['content']['parts'][0]['text']
            
            logger.info("Reporte generado exitosamente con Google Gemini")
            
            return self._parsear_respuesta(contenido)
            
        except Exception as e:
            logger.error(f"Error generando reporte con IA: {str(e)}")
            raise
    
    def analizar_tendencias(self, datos_historicos: list) -> dict:
        """Analiza tendencias en datos históricos"""
        try:
            prompt = f"""
            Analiza las siguientes tendencias de datos de una panadería:
            
            {json.dumps(datos_historicos, indent=2, default=str)}
            
            Proporciona:
            1. Análisis de tendencias identificadas
            2. Patrones significativos
            3. Proyecciones para próximos períodos
            4. Recomendaciones basadas en tendencias
            
            Formato: JSON con keys: tendencias, patrones, proyecciones, recomendaciones
            """
            
            return self.generar_reporte(prompt)
            
        except Exception as e:
            logger.error(f"Error analizando tendencias: {str(e)}")
            raise
    
    def generar_insights(self, datos_reporte: dict) -> list:
        """Genera insights automáticos a partir de datos de reporte"""
        try:
            prompt = f"""
            Dados estos datos de un reporte de panadería, genera 5 insights principales:
            
            {json.dumps(datos_reporte, indent=2, default=str)}
            
            Cada insight debe ser:
            - Accionable
            - Basado en datos
            - Relevante para el negocio
            
            Retorna solo una lista JSON de strings con los insights.
            """
            
            response = self.generar_reporte(prompt)
            return response.get('insights', [])
            
        except Exception as e:
            logger.error(f"Error generando insights: {str(e)}")
            raise
    
    def _construir_prompt(self, prompt_usuario: str, contexto: dict = None) -> str:
        """Construye el prompt final con contexto y system instructions"""
        # Incluir system prompt como parte del contenido
        prompt_final = f"{self._system_prompt()}\n\n---\n\n{prompt_usuario}"
        
        if contexto:
            prompt_final += f"\n\nContexto adicional:\n{json.dumps(contexto, indent=2, default=str)}"
        
        return prompt_final
    
    def _system_prompt(self) -> str:
        """System prompt para el modelo IA"""
        return """Eres un experto en análisis de datos y reportería empresarial para panaderías. 
        Tu rol es generar reportes detallados, insights accionables y recomendaciones basadas en datos.
        
        Características de tus respuestas:
        - Preciso en cálculos y análisis
        - Práctico en recomendaciones
        - Enfocado en mejora del negocio
        - Estructura clara y organizada
        - Siempre justifica tus recomendaciones con datos
        
        Cuando generes reportes, incluye siempre:
        1. Resumen ejecutivo
        2. Análisis detallado
        3. Insights clave
        4. Recomendaciones accionables
        5. Métricas de desempeño
        
        Retorna respuestas en formato JSON cuando sea posible para facilitar integración."""
    
    def _parsear_respuesta(self, contenido: str) -> dict:
        """Parsea respuesta de IA a formato estructurado"""
        try:
            # Intentar parsear como JSON
            respuesta = json.loads(contenido)
            return respuesta
        except:
            # Si no es JSON válido, estructurar la respuesta extrayendo secciones
            respuesta = {
                "analysis": contenido,
                "insights": [],
                "recomendaciones": []
            }
            
            # Intentar extraer insights del texto
            if "insight" in contenido.lower():
                # Buscar líneas que comiencen con "- " o "* " después de "Insights"
                lineas = contenido.split('\n')
                en_insights = False
                for linea in lineas:
                    if 'insight' in linea.lower():
                        en_insights = True
                        continue
                    if en_insights and (linea.strip().startswith('-') or linea.strip().startswith('*')):
                        insight = linea.strip().lstrip('-*').strip()
                        if insight and len(insight) > 5:  # Evitar líneas muy cortas
                            respuesta['insights'].append(insight)
                    elif en_insights and linea.strip() == '':
                        continue
                    elif en_insights and not (linea.strip().startswith('-') or linea.strip().startswith('*')):
                        en_insights = False
            
            # Intentar extraer recomendaciones del texto
            if "recomendación" in contenido.lower():
                lineas = contenido.split('\n')
                en_recom = False
                for linea in lineas:
                    if 'recomendación' in linea.lower():
                        en_recom = True
                        continue
                    if en_recom and (linea.strip().startswith('-') or linea.strip().startswith('*')):
                        recom = linea.strip().lstrip('-*').strip()
                        if recom and len(recom) > 5:
                            respuesta['recomendaciones'].append(recom)
                    elif en_recom and linea.strip() == '':
                        continue
                    elif en_recom and not (linea.strip().startswith('-') or linea.strip().startswith('*')):
                        en_recom = False
            
            # Si no encontró insights/recomendaciones, fragmentar el analysis en párrafos para insights
            if not respuesta['insights']:
                parrafos = contenido.split('\n\n')
                respuesta['insights'] = [p.strip() for p in parrafos[1:4] if p.strip() and len(p.strip()) > 20][:5]
            
            return respuesta
