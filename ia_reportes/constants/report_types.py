class ReportTypes:
    """Tipos de reportes disponibles"""
    
    # Ventas
    VENTAS_TOTAL = "ventas_total"
    VENTAS_CATEGORIA = "ventas_categoria"
    CLIENTES_TOP = "clientes_top"
    PRODUCTOS_TOP = "productos_top"
    TENDENCIAS_VENTAS = "tendencias_ventas"
    
    # Inventario
    ESTADO_STOCK = "estado_stock"
    BAJO_STOCK = "bajo_stock"
    ROTACION_INVENTARIO = "rotacion_inventario"
    VALORIZACION = "valorizacion"
    
    # Producción
    PRODUCCION_PERIODO = "produccion_periodo"
    RECETAS_USADAS = "recetas_usadas"
    EFICIENCIA = "eficiencia"
    COSTOS_PRODUCCION = "costos_produccion"
    
    # Pedidos
    ESTADO_PEDIDOS = "estado_pedidos"
    CLIENTES_FRECUENTES = "clientes_frecuentes"
    TIEMPOS_ENTREGA = "tiempos_entrega"
    SATISFACCION = "satisfaccion"

EJEMPLOS_PROMPTS = {
    "ventas": [
        "¿Cuáles fueron mis ventas en noviembre?",
        "Dime el producto más vendido este mes",
        "Quiero ver los clientes que más han comprado",
        "Genera un reporte de ventas por categoría para el último trimestre",
        "¿Cuánto dinero he ganado este año?",
    ],
    "inventario": [
        "¿Cuáles son los productos con stock bajo?",
        "Necesito ver el estado actual del inventario",
        "¿Qué productos tienen mejor rotación?",
        "Dime el valor total del inventario",
    ],
    "produccion": [
        "¿Cuántas unidades producimos este mes?",
        "¿Cuál es la receta más usada?",
        "Necesito un análisis de eficiencia de producción",
        "¿Cuál fue el costo de producción en octubre?",
    ],
    "pedidos": [
        "¿Cuál es el estado de los pedidos pendientes?",
        "Quién es mi cliente más frecuente?",
        "¿Cuál es el tiempo promedio de entrega?",
        "Necesito un análisis de satisfacción de clientes",
    ],
}

MENSAJES = {
    "error": {
        "solicitud_corta": "La solicitud es muy corta. Proporciona más detalles.",
        "modulo_invalido": "El módulo especificado no es válido",
        "sin_datos": "No se encontraron datos para la solicitud",
        "token_invalido": "El token de autenticación es inválido",
        "error_ia": "Error procesando con IA. Intenta nuevamente.",
    },
    "exito": {
        "reporte_generado": "Reporte generado exitosamente",
        "datos_recuperados": "Datos recuperados correctamente",
    }
}
