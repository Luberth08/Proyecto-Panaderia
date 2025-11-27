"""
Templates de prompts para cada tipo de reporte
Adaptados al contexto de una panadería
"""

PROMPT_VENTAS = """
Analiza los siguientes datos de ventas de una panadería y genera un reporte completo:

{datos}

Por favor proporciona:
1. Análisis de desempeño de ventas (total, tendencia, variación)
2. Identificación de productos estrella y productos lentos
3. Análisis de comportamiento de clientes (frecuencia, gasto promedio)
4. Categorías con mejor y peor desempeño
5. Insights sobre patrones de compra
6. 3-5 recomendaciones accionables para mejorar ventas
7. Proyección de ventas para el próximo período

Formato: Proporciona la respuesta estructurada en JSON con las siguientes claves:
- analysis: Análisis general
- insights: Lista de insights principales
- recomendaciones: Lista de recomendaciones
- proyeccion: Proyecciones futuras
"""

PROMPT_INVENTARIO = """
Analiza el estado actual del inventario de una panadería:

{datos}

Por favor proporciona:
1. Evaluación general del estado del inventario
2. Identificación de items críticos (bajo stock)
3. Items sin rotación o con rotación muy lenta
4. Análisis de oportunidades de optimización
5. Riesgos de desabastecimiento
6. Recomendaciones de compra urgentes
7. Estrategia de gestión de inventario
8. Proyección de necesidades para próximas semanas

Formato: JSON con claves: analysis, items_criticos, items_lenta_rotacion, riesgos, recomendaciones, proyeccion
"""

PROMPT_PRODUCCION = """
Analiza los datos de producción de una panadería:

{datos}

Por favor proporciona:
1. Evaluación de eficiencia productiva
2. Análisis de recetas más utilizadas
3. Identificación de cuellos de botella
4. Análisis de desperdicio y pérdidas
5. Oportunidades de optimización
6. Mejoras en tiempos de producción
7. Recomendaciones para aumentar capacidad
8. Plan de producción optimizado

Formato: JSON con claves: analysis, eficiencia, cuellos_botella, desperdicio, recomendaciones, plan_optimizado
"""

PROMPT_CLIENTES = """
Analiza el comportamiento de los clientes de una panadería:

{datos}

Por favor proporciona:
1. Segmentación de clientes (VIP, regulares, ocasionales)
2. Análisis de rentabilidad por cliente
3. Identificación de clientes en riesgo de pérdida
4. Patrones de compra por segmento
5. Oportunidades de cross-selling y upselling
6. Recomendaciones de retención
7. Estrategia de comunicación personalizada
8. Proyección de ingresos por segmento

Formato: JSON con claves: segmentacion, rentabilidad, clientes_riesgo, patrones, oportunidades, recomendaciones
"""

PROMPT_COMPRAS = """
Analiza los datos de compras de una panadería:

{datos}

Por favor proporciona:
1. Evaluación de gastos de compra
2. Análisis de proveedores (costo, calidad, confiabilidad)
3. Oportunidades de negociación
4. Identificación de insumos con volatilidad de precio
5. Análisis de puntualidad de entregas
6. Recomendaciones de optimización de costos
7. Sugerencias de cambio de proveedores
8. Proyección de gastos futuros

Formato: JSON con claves: analysis, proveedores, oportunidades_negociacion, riesgos, recomendaciones, proyeccion
"""

PROMPT_FINANCIERO = """
Realiza un análisis financiero completo de una panadería:

{datos}

Por favor proporciona:
1. Estado financiero actual (ingresos, gastos, ganancias)
2. Análisis de márgenes de ganancia por producto
3. Rentabilidad general del negocio
4. Análisis de cash flow
5. Identificación de costos fijos y variables
6. Oportunidades de optimización de costos
7. Análisis de rentabilidad por cliente/categoría
8. Recomendaciones para mejorar salud financiera
9. Proyecciones financieras para 6 meses

Formato: JSON con claves: analysis, margenes, rentabilidad, cash_flow, costos, oportunidades, recomendaciones, proyecciones
"""

PROMPT_TENDENCIAS = """
Analiza tendencias y realiza proyecciones para una panadería:

{datos}

Por favor proporciona:
1. Tendencias principales identificadas (crecimiento, decline, estabilidad)
2. Ciclos estacionales
3. Comportamiento post-pandemia
4. Impacto de acciones realizadas
5. Análisis comparativo con períodos anteriores
6. Proyecciones realistas para 3, 6 y 12 meses
7. Escenarios (optimista, pesimista, realista)
8. Factores externos que pueden impactar
9. Recomendaciones estratégicas

Formato: JSON con claves: tendencias, estacionalidad, comparativa, proyecciones, escenarios, factores_externos, estrategia
"""

PROMPT_PEDIDOS = """
Analiza los datos de pedidos de clientes de una panadería:

{datos}

Por favor proporciona:
1. Análisis de volumen y frecuencia de pedidos
2. Evaluación del servicio de entregas (tiempo, cumplimiento)
3. Identificación de clientes con pedidos frecuentes
4. Análisis de tamaño promedio de pedidos
5. Productos más solicitados
6. Problemas recurrentes o quejas
7. Oportunidades de mejora en el servicio
8. Recomendaciones para aumentar satisfacción
9. Estrategia de retención de clientes

Formato: JSON con claves: analysis, volumen, entregas, clientes_frecuentes, productos_solicitados, problemas, recomendaciones
"""

PROMPT_GENERAL = """
Genera un reporte ejecutivo completo para una panadería con los siguientes datos:

{datos}

El reporte debe incluir:
1. Resumen ejecutivo general
2. Highlights principales (logros, desafíos)
3. Análisis de desempeño general del negocio
4. Identificación de oportunidades clave
5. Riesgos principales
6. Recomendaciones prioritarias
7. Plan de acción inmediato (próximas 2 semanas)
8. Objetivos para próximo mes

Formato: JSON con claves: resumen, highlights, desempenio, oportunidades, riesgos, recomendaciones, plan_accion, objetivos
"""

# Mapeo de tipos de reportes a prompts
PROMPTS_MAP = {
    'VENTAS': PROMPT_VENTAS,
    'INVENTARIO': PROMPT_INVENTARIO,
    'PRODUCCION': PROMPT_PRODUCCION,
    'CLIENTES': PROMPT_CLIENTES,
    'COMPRAS': PROMPT_COMPRAS,
    'FINANCIERO': PROMPT_FINANCIERO,
    'TENDENCIAS': PROMPT_TENDENCIAS,
    'PEDIDOS': PROMPT_PEDIDOS,
    'GENERAL': PROMPT_GENERAL
}

def obtener_prompt(tipo_reporte: str) -> str:
    """Obtiene el prompt correspondiente al tipo de reporte"""
    return PROMPTS_MAP.get(tipo_reporte.upper(), PROMPT_GENERAL)
