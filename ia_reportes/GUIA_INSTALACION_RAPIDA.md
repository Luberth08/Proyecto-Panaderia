# 🚀 Guía Rápida de Instalación - IA Reportes

## Paso 1: Preparar Ambiente (2 minutos)

```powershell
# Navegar a la carpeta IA_REPORTES
cd IA_REPORTES

# Crear entorno virtual
python -m venv venv

# Activar entorno
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

## Paso 2: Configurar Credenciales (1 minuto)

```powershell
# Copiar archivo de ejemplo
copy .env.example .env

# Editar con tu editor favorito
notepad .env
```

**Completa estos campos obligatorios:**
```
OPENAI_API_KEY=sk-... (tu clave de OpenAI)
DB_HOST=tu-bd.com
DB_NAME=panaderia_db
DB_USER=postgres
DB_PASSWORD=...
```

## Paso 3: Verificar Conexión (1 minuto)

```powershell
# Ejecutar test de conexión
python -c "from src.services.database_service import DatabaseService; db = DatabaseService(); db.connect(); print('✅ BD conectada'); db.disconnect()"
```

## Paso 4: Iniciar Servidor (30 segundos)

```powershell
# Iniciar la aplicación
python main.py
```

Deberías ver:
```
==================================================
🍞 IA REPORTES - PANADERÍA
==================================================
Iniciando servidor en 127.0.0.1:5000
```

## Paso 5: Probar API (1 minuto)

Abre en tu navegador:
```
http://127.0.0.1:5000/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "2024-11-26T...",
  "service": "IA Reportes API"
}
```

---

## Uso Rápido con cURL

### Generar reporte de ventas en PDF:
```powershell
$body = @{
    tipo_reporte = "VENTAS"
    formatos = @("pdf")
    fecha_inicio = "2024-01-01"
    fecha_fin = "2024-12-31"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/reportes/generar" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Ver tipos disponibles:
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/reportes/tipos" -Method GET
```

---

## 📁 Dónde Están los Reportes

```
IA_REPORTES/
├── outputs/
│   ├── Reporte_Ventas_20241126_103000.pdf
│   ├── Reporte_Ventas_20241126_103000.xlsx
│   ├── grafico_ventas_categoria_20241126_103000.png
│   └── dashboard_20241126_103000.html
└── logs/
    └── ia_reportes_20241126.log
```

---

## 🔗 Integración con Backend Node.js

En tu `BACK-END/package.json` ya está configurado. Solo necesitas:

```javascript
// BACK-END/src/controllers/reportes.controller.js
const IAReportesAPI = 'http://localhost:5000/api';

exports.generarVentas = async (req, res) => {
    const response = await fetch(`${IAReportesAPI}/reportes/generar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tipo_reporte: 'VENTAS',
            formatos: ['pdf', 'excel'],
            incluir_graficos: true
        })
    });
    res.json(await response.json());
};
```

---

## ✅ Checklist de Verificación

- [ ] Python 3.8+ instalado
- [ ] Entorno virtual activado
- [ ] Dependencias instaladas (`pip list | grep -E 'openai|flask|psycopg2'`)
- [ ] `.env` configurado con credenciales
- [ ] PostgreSQL accesible desde esta máquina
- [ ] OpenAI API Key válida (prueba en https://platform.openai.com/account/api-keys)
- [ ] API respondiendo en `/api/health`

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| `ModuleNotFoundError: No module named 'openai'` | Ejecuta: `pip install -r requirements.txt` |
| `OPENAI_API_KEY not configured` | Verifica `.env` y reinicia el servidor |
| `psycopg2.OperationalError` | Verifica credenciales de BD en `.env` |
| Puerto 5000 ya en uso | Cambia `FLASK_PORT` en `.env` |

---

**¡Listo!** Tu sistema de IA Reportes está funcionando. 🎉
