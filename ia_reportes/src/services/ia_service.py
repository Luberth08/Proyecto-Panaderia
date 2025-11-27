from openai import OpenAI
from src.config.settings import OPENAI_API_KEY, MODEL_IA, TEMPERATURE, MAX_TOKENS
import logging
import json

logger = logging.getLogger(__name__)

class IAService:
    """Servicio de integración con OpenAI API"""
    
    def __init__(self):
        # Inicializar cliente OpenAI
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        self.model = MODEL_IA
        self.temperature = TEMPERATURE
        self.max_tokens = MAX_TOKENS
        logger.info(f"IAService inicializado con OpenAI modelo: {self.model}")
    
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
            
            # Llamar a OpenAI
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": self._system_prompt()
                    },
                    {
                        "role": "user",
                        "content": prompt_completo
                    }
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            contenido = response.choices[0].message.content
            logger.info("Reporte generado exitosamente con OpenAI")
            
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
        """Construye el prompt final con contexto"""
        prompt_final = prompt_usuario
        
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
        except:
            # Si no es JSON válido, estructurar la respuesta
            respuesta = {
                "analysis": contenido,
                "insights": [],
                "recomendaciones": []
            }
        
        return respuesta
