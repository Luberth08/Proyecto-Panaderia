# README para ia_reportes

# 🤖 IA Reportes - Módulo de Generación de Reportes con IA

Módulo independiente en Python para generar reportes con IA usando prompts en lenguaje natural.

## 📁 Estructura

```
ia_reportes/
├── app.py                   # Aplicación Flask
├── config.py                # Configuración
├── routes.py                # Rutas de la API
├── requirements.txt         # Dependencias Python
├── .env.example             # Variables de entorno (plantilla)
├── .env                     # Variables de entorno (privado)
├── services/
│   ├── interpret_service.py # Interpretación con OpenAI
│   ├── report_service.py    # Generación de reportes
│   └── __init__.py
├── db/
│   ├── connection.py        # Conexión a PostgreSQL
│   ├── repositories.py      # Acceso a datos
├── utils/
│   ├── helpers.py           # Funciones auxiliares (dates, formatters, validators)
├── constants/
│   ├── report_types.py      # Tipos de reportes y ejemplos
```

## 🚀 Setup Inicial

### 1. Copiar archivo `.env`

```bash
cp .env.example .env
```

Luego editar `.env` con tus valores reales:
```
OPENAI_API_KEY=sk-tu-clave-aqui
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu-password
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Iniciar servidor

```bash
python app.py
```

Debería ver:
```
🚀 Iniciando servicio IA Reportes en puerto 5001
📍 Entorno: development
```

## 📡 Endpoints

### Verificar salud del servicio
```bash
GET /health
```

Respuesta:
```json
{
  "status": "ok",
  "service": "ia_reportes",
  "environment": "development"
}
```

### Interpretar solicitud
```bash
POST /ia/interpretar
Content-Type: application/json

{
  "texto_solicitud": "Dime mis ventas de este mes",
  "contexto": {}
}
```

Respuesta:
```json
{
  "success": true,
  "solicitud_original": "Dime mis ventas de este mes",
  "interpretacion": {
    "tipo_reporte": "ventas_total",
    "modulo": "ventas",
    "periodo": {
      "fecha_inicio": "2025-11-01",
      "fecha_fin": "2025-11-30"
    },
    "parametros": {
      "limite": 10,
      "ordenar_por": "total"
    }
  }
}
```

### Generar reporte completo
```bash
POST /ia/generar-reporte
Content-Type: application/json

{
  "texto_solicitud": "¿Cuáles fueron mis ventas en noviembre?",
  "modulo": "ventas",
  "usuario_id": 1,
  "formato": "json"
}
```

### Obtener ejemplos para módulo
```bash
GET /ia/reportes/ejemplos/ventas
GET /ia/reportes/ejemplos/inventario
GET /ia/reportes/ejemplos/produccion
GET /ia/reportes/ejemplos/pedidos
```

### Obtener módulos disponibles
```bash
GET /ia/modulos
```

### Obtener contexto de empresa
```bash
GET /ia/contexto/empresa
```

## 🔧 Configuración de OpenAI

Necesitas:
1. Crear cuenta en https://platform.openai.com
2. Generar API Key
3. Agregar a `.env`:
   ```
   OPENAI_API_KEY=sk-tu-clave-aqui
   ```

## 🔌 Integración Backend

En tu Node.js/Express backend, consume el servicio:

```javascript
const axios = require('axios');

const iaReportesAPI = 'http://localhost:5001';

async function generarReporte(texto) {
  try {
    const response = await axios.post(`${iaReportesAPI}/ia/generar-reporte`, {
      texto_solicitud: texto,
      modulo: 'ventas',
      usuario_id: 1,
      formato: 'json'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## 📊 Tipos de Reportes Soportados

### Ventas
- `ventas_total`: Total de ventas en período
- `ventas_categoria`: Ventas por categoría
- `clientes_top`: Clientes con más compras
- `productos_top`: Productos más vendidos
- `tendencias_ventas`: Análisis de tendencias

### Inventario
- `estado_stock`: Estado completo del inventario
- `bajo_stock`: Productos con stock bajo
- `rotacion_inventario`: Análisis de rotación
- `valorizacion`: Valor total del inventario

### Producción
- `produccion_periodo`: Producción en período
- `recetas_usadas`: Recetas más usadas
- `eficiencia`: Análisis de eficiencia
- `costos_produccion`: Costos de producción

### Pedidos
- `estado_pedidos`: Estado de pedidos
- `clientes_frecuentes`: Clientes frecuentes
- `tiempos_entrega`: Tiempos de entrega
- `satisfaccion`: Satisfacción de clientes

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY no configurada"
- Verifica que .env existe y tiene la clave correcta
- Reinicia el servidor

### Error: "Cannot connect to database"
- Verifica que PostgreSQL está corriendo
- Verifica credenciales en .env

### Error: "Invalid response from OpenAI"
- Verifica que la API key es válida
- Verifica que tienes créditos en OpenAI

## 📞 Próximos Pasos

- [ ] Conectar con JWT del backend
- [ ] Agregar exportación a PDF
- [ ] Agregar exportación a Excel
- [ ] Agregar tablas de producción
- [ ] Agregar autenticación con backend
- [ ] Tests unitarios
