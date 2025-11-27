# 📊 Documentación Técnica - IA Reportes

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│        Interfaz para solicitar reportes personalizados       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP REST
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (Node.js/Express)                   │
│         Gestiona rutas y valida solicitudes de reportes    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP REST
                       ↓
┌─────────────────────────────────────────────────────────────┐
│             IA REPORTES API (Python/Flask)                  │
│      Análisis de datos, generación de reportes              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. Database Service (conexión PostgreSQL)          │   │
│  │  2. IA Service (integración OpenAI)                 │   │
│  │  3. PDF/Excel/Chart Generators                      │   │
│  │  4. REST API (endpoints)                            │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────┬──────────────────────┬──────────────────────┘
               │                      │
        ┌──────↓──────┐        ┌─────↓────────┐
        │ PostgreSQL  │        │  OpenAI API  │
        │   (Datos)   │        │  (Análisis)  │
        └─────────────┘        └──────────────┘
```

## Flujo de Generación de Reportes

```
1. SOLICITUD
   Frontend/Backend → POST /api/reportes/generar
   {tipo_reporte, fecha_inicio, fecha_fin, formatos, prompt_custom}
                    ↓
2. EXTRACCIÓN DE DATOS
   DatabaseService.get_*_data() 
   → Conecta a PostgreSQL
   → Ejecuta queries específicas
   → Retorna datos estructurados
                    ↓
3. ANÁLISIS CON IA
   IAService.generar_reporte()
   → Construye prompt enriquecido
   → Envía a OpenAI GPT-4
   → Recibe análisis, insights, recomendaciones
                    ↓
4. GENERACIÓN DE ARCHIVOS
   Para cada formato solicitado:
   - PDF Generator → ReportLab → archivo.pdf
   - Excel Generator → openpyxl → archivo.xlsx
   - Chart Generator → Matplotlib/Plotly → gráficos
                    ↓
5. RESPUESTA
   {análisis_ia, archivos_generados, graficos}
   → Retorna JSON
   → Frontend descarga archivos
```

## Módulos Principales

### 1. DatabaseService (`src/services/database_service.py`)

**Responsabilidad**: Conexión y queries a PostgreSQL

**Métodos principales**:
```python
# Configuración
connect()              # Abre conexión
disconnect()           # Cierra conexión

# Queries genéricas
execute_query(sql, params)        # Retorna múltiples filas
execute_single(sql, params)       # Retorna una fila

# Queries específicas por módulo
get_ventas_data(fecha_inicio, fecha_fin)
get_ventas_por_categoria(fecha_inicio, fecha_fin)
get_productos_mas_vendidos(fecha_inicio, fecha_fin)
get_clientes_datos(fecha_inicio, fecha_fin)
get_inventario_datos()
get_productos_stock()
get_produccion_datos(fecha_inicio, fecha_fin)
get_compras_datos(fecha_inicio, fecha_fin)
```

### 2. IAService (`src/services/ia_service.py`)

**Responsabilidad**: Integración con OpenAI GPT-4

**Métodos principales**:
```python
generar_reporte(prompt, datos_contexto)
    # Genera análisis completo
    # Retorna: {analysis, insights, recomendaciones}

analizar_tendencias(datos_historicos)
    # Analiza tendencias automáticamente

generar_insights(datos_reporte)
    # Extrae insights clave de reportes

# Métodos internos
_construir_prompt(prompt_usuario, contexto)
_system_prompt()               # Instrucciones para el modelo
_parsear_respuesta(contenido)  # Parsea JSON de respuesta
```

**Configuration**:
```python
model = "gpt-4"
temperature = 0.7              # Consistencia vs creatividad
max_tokens = 2000              # Máxima longitud de respuesta
```

### 3. PDFGenerator (`src/generators/pdf_generator.py`)

**Responsabilidad**: Generación de reportes en PDF con ReportLab

**Métodos principales**:
```python
generar_reporte_ventas(datos)      # PDF de ventas
generar_reporte_inventario(datos)  # PDF de inventario

# Métodos internos
_crear_encabezado(titulo)
_crear_pie_pagina()
_tabla_estilo_standar()
```

**Características**:
- Logo y datos de panadería en encabezado
- Tablas con colores corporativos (#1a472a)
- Datos clave resumidos
- Insights y recomendaciones
- Pie de página con fecha

### 4. ExcelGenerator (`src/generators/excel_generator.py`)

**Responsabilidad**: Generación de reportes en Excel con openpyxl

**Métodos principales**:
```python
generar_reporte_ventas(datos)
generar_reporte_inventario(datos)
generar_reporte_completo(datos_multiples)  # Multi-módulo

# Métodos internos (crean pestañas)
_crear_resumen_ventas()
_crear_detalle_productos()
_crear_detalle_clientes()
_crear_detalle_categoria()
_crear_resumen_inventario()
```

**Características**:
- Múltiples pestañas por tipo de reporte
- Formato automático de moneda
- Auto-ajuste de columnas
- Encabezados con color
- Compatible con análisis Excel

### 5. ChartGenerator (`src/generators/chart_generator.py`)

**Responsabilidad**: Generación de gráficos

**Métodos - Matplotlib/Seaborn**:
```python
generar_ventas_por_categoria()     # Gráfico de barras horizontal
generar_productos_mas_vendidos()   # Top 10 productos
generar_tendencias_temporales()    # Línea de tendencia
generar_estado_inventario()        # Comparativo actual vs mínimo
generar_pie_clientes()             # Distribución de clientes
```

**Métodos - Plotly**:
```python
generar_dashboard_interactivo()    # Dashboard HTML interactivo
```

**Configuración**:
```python
figsize = (14, 8)                  # Tamaño de figura
dpi = 300                          # Resolución
color_palette = 'husl'             # Paleta de colores
```

### 6. ReportPrompts (`src/prompts/report_prompts.py`)

**Responsabilidad**: Templates de prompts para cada tipo de reporte

**Prompts disponibles**:
- `PROMPT_VENTAS` - Análisis de ingresos y productos
- `PROMPT_INVENTARIO` - Estado de stock
- `PROMPT_PRODUCCION` - Eficiencia productiva
- `PROMPT_CLIENTES` - Segmentación y rentabilidad
- `PROMPT_COMPRAS` - Gastos de proveedores
- `PROMPT_FINANCIERO` - Análisis financiero completo
- `PROMPT_TENDENCIAS` - Proyecciones y tendencias
- `PROMPT_GENERAL` - Reporte ejecutivo general

**Cada prompt incluye**:
- Instrucciones específicas de análisis
- Formato esperado de respuesta (JSON)
- Métricas a calcular
- Recomendaciones a generar

### 7. Flask API (`src/api/routes.py`)

**Responsabilidad**: Endpoints REST para comunicación

**Endpoints**:

#### Health Check
```http
GET /api/health
```
Retorna estado del servicio

#### Listar Tipos
```http
GET /api/reportes/tipos
```
Retorna diccionario de tipos disponibles

#### Generar Reporte
```http
POST /api/reportes/generar
Content-Type: application/json

{
  "tipo_reporte": "VENTAS",
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-12-31",
  "formatos": ["pdf", "excel", "json"],
  "incluir_graficos": true,
  "prompt_custom": "Analiza..."
}
```

#### Preview
```http
GET /api/reportes/preview/VENTAS
```
Retorna datos sin generar archivos

**Flujo interno**:
1. Recibe solicitud JSON
2. Valida parámetros
3. Llama `_obtener_datos_reporte()`
4. Llama `ia_service.generar_reporte()`
5. Genera archivos según formatos
6. Genera gráficos si se solicitan
7. Retorna JSON con rutas de archivos

## Dataclasses (Modelos)

### ReportMetadata
```python
@dataclass
class ReportMetadata:
    titulo: str
    tipo: str
    fecha_generacion: datetime
    usuario: str
    periodo: str
    descripcion: Optional[str]
    tags: List[str]
```

### ReportData
```python
@dataclass
class ReportData:
    metadata: ReportMetadata
    datos_principales: Dict[str, Any]
    datos_detallados: Dict[str, Any]
    insights: List[str]
    recomendaciones: List[str]
    graficos: Dict[str, str]
```

### Reportes Específicos
- `VentasReport`: total_ventas, cantidad_ordenes, productos_vendidos, etc.
- `InventarioReport`: stock_total_valor, items_bajo_stock, rotacion_promedio, etc.
- `ClientesReport`: total_clientes, valor_promedio_cliente, segmentacion, etc.
- `FinancieroReport`: ingresos, gastos, margen_ganancia, proyecciones, etc.

## Configuración (Settings)

### Conexión BD
```python
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'panaderia_db',
    'user': 'postgres',
    'password': 'xxx',
    'sslmode': 'disable'
}
```

### OpenAI
```python
OPENAI_API_KEY = 'sk-...'
MODEL_IA = 'gpt-4'
TEMPERATURE = 0.7
MAX_TOKENS = 2000
```

### Formatos
```python
OUTPUT_FORMATS = ['pdf', 'excel', 'json']
GRAPH_FORMATS = ['png', 'svg', 'html']
```

## Helpers Utilities

### Formatting
```python
formatear_fecha(fecha)              # DD/MM/YYYY
formatear_moneda(valor)             # $X,XXX.XX
formatear_porcentaje(valor)         # X.XX%
calcular_variacion_porcentual()      # (A-B)/B*100
```

### Análisis
```python
agrupar_por_fecha(datos, clave)     # Agrupa lista por fecha
sumar_valores(datos, clave)         # Suma una columna
promedio_valores(datos, clave)      # Calcula promedio
obtener_maximo(datos, clave)        # Máximo valor
obtener_minimo(datos, clave)        # Mínimo valor
```

## Queries SQL Principales

### Ventas
```sql
SELECT p.id_pedido, p.fecha_pedido, p.total, c.nombre,
       COUNT(pp.id_producto) as cantidad_items
FROM PEDIDO p
LEFT JOIN CLIENTE c ON p.id_cliente = c.id_cliente
LEFT JOIN PEDIDO_PRODUCTO pp ON p.id_pedido = pp.id_pedido
WHERE p.fecha_pedido BETWEEN %s AND %s
GROUP BY p.id_pedido, c.nombre
```

### Inventario
```sql
SELECT i.id_insumo, i.nombre, cat.nombre,
       i.cantidad_disponible, i.cantidad_minima,
       CASE WHEN i.cantidad_disponible < i.cantidad_minima 
            THEN 'BAJO' ELSE 'NORMAL' END
FROM INSUMO i
JOIN CATEGORIA cat ON i.id_categoria = cat.id_categoria
ORDER BY i.cantidad_disponible ASC
```

### Clientes
```sql
SELECT c.id_cliente, c.nombre, COUNT(p.id_pedido) as total_pedidos,
       SUM(p.total) as total_gastado, AVG(p.total) as ticket_promedio
FROM CLIENTE c
LEFT JOIN PEDIDO p ON c.id_cliente = p.id_cliente
GROUP BY c.id_cliente, c.nombre
ORDER BY total_gastado DESC
```

## Manejo de Errores

```python
# Try-Catch estándar en todos los servicios
try:
    # Operación
    logger.info("Operación completada")
except Exception as e:
    logger.error(f"Error: {str(e)}")
    raise  # Re-raise para API
```

## Logging

```python
logger.info(f"Generando reporte: {tipo_reporte}")
logger.error(f"Error conectando a BD: {str(e)}")
logger.warning(f"⚠️  OPENAI_API_KEY no configurada")
```

Archivos de log: `logs/ia_reportes_YYYYMMDD.log`

## Performance Tips

1. **Caché de datos**: Cachear queries frecuentes por 1 hora
2. **Batch queries**: Agrupar múltiples queries de BD
3. **Async API calls**: Para llamadas a OpenAI, usar async
4. **Compress PDFs**: Comprimir PDFs para reducir tamaño
5. **Límites de token**: Ajustar MAX_TOKENS según necesidad

---

**Versión**: 1.0.0  
**Última actualización**: 26 de Noviembre de 2024
