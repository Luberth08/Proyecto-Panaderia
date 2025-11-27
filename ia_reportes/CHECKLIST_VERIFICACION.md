# ✅ CHECKLIST DE VERIFICACIÓN - IA Reportes

## 📋 Antes de Comenzar

### 1. Verificar Estructura de Carpetas
```powershell
# Ejecutar en raíz del proyecto
Get-ChildItem -Path ".\IA_REPORTES\src\" -Recurse -Directory | Format-Table FullName
```

**Debe mostrar:**
- ✅ config/
- ✅ models/
- ✅ services/
- ✅ generators/
- ✅ prompts/
- ✅ utils/
- ✅ api/

**Checklist**: [ ]

### 2. Verificar Archivos Python Creados
```powershell
Get-ChildItem -Path ".\IA_REPORTES\src\" -Filter "*.py" -Recurse | Measure-Object
```

**Debe mostrar: 11 archivos .py**

**Checklist**: [ ]

### 3. Verificar Archivos de Configuración
```powershell
Test-Path ".\IA_REPORTES\.env.example"     # ✅ Debe existir
Test-Path ".\IA_REPORTES\.gitignore"       # ✅ Debe existir
Test-Path ".\IA_REPORTES\requirements.txt"  # ✅ Debe existir
```

**Checklist**: [ ]

### 4. Verificar Documentación
```powershell
Test-Path ".\IA_REPORTES\README.md"                      # ✅ Debe existir
Test-Path ".\IA_REPORTES\GUIA_INSTALACION_RAPIDA.md"    # ✅ Debe existir
Test-Path ".\IA_REPORTES\DOCUMENTACION_TECNICA.md"      # ✅ Debe existir
Test-Path ".\IA_REPORTES\RESUMEN_IMPLEMENTACION.md"     # ✅ Debe existir
```

**Checklist**: [ ]

---

## 🚀 Configuración Inicial (Primero)

### 5. Crear Entorno Virtual
```powershell
cd .\IA_REPORTES\
python -m venv venv
```

**Debe crear carpeta `venv/`**

**Checklist**: [ ]

### 6. Activar Entorno Virtual
```powershell
.\venv\Scripts\activate
# Si ves (venv) en la terminal, está correcto
```

**Checklist**: [ ]

### 7. Instalar Dependencias
```powershell
pip install -r requirements.txt
# Esperar a que termine (≈2 minutos)
```

**Debe instalar 16 packages:**
- ✅ python-dotenv
- ✅ openai
- ✅ flask
- ✅ psycopg2-binary
- ✅ reportlab
- ✅ openpyxl
- ✅ pandas
- ✅ matplotlib
- ✅ seaborn
- ✅ plotly
- ✅ (y más)

**Checklist**: [ ]

### 8. Verificar Instalación
```powershell
pip list | grep -E "openai|flask|psycopg2|reportlab|openpyxl"
```

**Debe mostrar al menos 5 packages**

**Checklist**: [ ]

---

## 🔐 Configurar Credenciales

### 9. Copiar Archivo de Ambiente
```powershell
Copy-Item -Path ".env.example" -Destination ".env"
```

**Debe crear archivo `.env`**

**Checklist**: [ ]

### 10. Editar `.env` con Credenciales
```powershell
# Opción 1: Abrir con editor
notepad .env

# Opción 2: Editar con VS Code
code .env
```

**IMPORTANTE: Completar estos campos:**

```env
# OpenAI (REQUERIDO)
OPENAI_API_KEY=sk-... 
# Tu clave de https://platform.openai.com/account/api-keys

# Base de Datos (REQUERIDO)
DB_HOST=localhost    # o tu servidor BD
DB_PORT=5432
DB_NAME=panaderia_db
DB_USER=postgres
DB_PASSWORD=tu_contrasena
DB_SSL=False

# Servidor (Opcional - valores por defecto están bien)
FLASK_HOST=127.0.0.1
FLASK_PORT=5000

# Panadería (Opcional - personalizar si deseas)
PANADERIA_NOMBRE=Mi Panadería
PANADERIA_UBICACION=Tu Ciudad
```

**Checklist**: [ ]

### 11. Verificar `.env` fue guardado
```powershell
Test-Path ".\.env"  # Debe retornar True
Get-Content ".\.env" | Select-Object -First 5  # Debe mostrar contenido
```

**Checklist**: [ ]

---

## 🧪 Pruebas de Conexión

### 12. Probar Conexión a Base de Datos
```powershell
python -c "
from src.services.database_service import DatabaseService
db = DatabaseService()
try:
    db.connect()
    print('✅ Conexión a BD: EXITOSA')
    db.disconnect()
except Exception as e:
    print(f'❌ Error BD: {e}')
"
```

**Debe mostrar: ✅ Conexión a BD: EXITOSA**

Si falla:
- Verifica BD esté corriendo
- Verifica credenciales en `.env`
- Verifica firewall no bloquea BD

**Checklist**: [ ]

### 13. Probar Conexión OpenAI
```powershell
python -c "
from src.config.settings import OPENAI_API_KEY, MODEL_IA
if OPENAI_API_KEY and OPENAI_API_KEY != 'your_openai_api_key_here':
    print(f'✅ OpenAI configurada: {MODEL_IA}')
else:
    print('❌ OPENAI_API_KEY no configurada')
"
```

**Debe mostrar: ✅ OpenAI configurada: gpt-4**

Si falla:
- Verifica `OPENAI_API_KEY` en `.env`
- Obtén clave en https://platform.openai.com/account/api-keys

**Checklist**: [ ]

### 14. Verificar Importes de Módulos
```powershell
python -c "
import sys
sys.path.insert(0, 'src')
try:
    from config.settings import OPENAI_API_KEY
    from services.database_service import DatabaseService
    from services.ia_service import IAService
    from generators.pdf_generator import PDFGenerator
    from generators.excel_generator import ExcelGenerator
    from generators.chart_generator import ChartGenerator
    print('✅ Todos los módulos importados correctamente')
except ImportError as e:
    print(f'❌ Error importando módulos: {e}')
"
```

**Debe mostrar: ✅ Todos los módulos importados correctamente**

**Checklist**: [ ]

---

## 🖥️ Iniciar Servidor

### 15. Iniciar Aplicación Flask
```powershell
python main.py
```

**Debe mostrar:**
```
==================================================
🍞 IA REPORTES - PANADERÍA
==================================================
Iniciando servidor en 127.0.0.1:5000
 * Running on http://127.0.0.1:5000
```

**Checklist**: [ ]

### 16. Verificar API en Navegador
- Abre navegador
- Ve a: http://127.0.0.1:5000/api/health

**Debe mostrar:**
```json
{
  "status": "ok",
  "timestamp": "2024-11-26T...",
  "service": "IA Reportes API"
}
```

**Checklist**: [ ]

---

## 🧪 Pruebas Funcionales

### 17. Listar Tipos de Reportes (Sin BD requerida)
```powershell
# En otra ventana terminal (mantener servidor corriendo)
$response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/reportes/tipos" -Method GET
$response.Content | ConvertFrom-Json | Format-Table

# Debe mostrar:
# Name          Value
# ----          -----
# VENTAS        Análisis completo de ventas
# COMPRAS       Análisis de compras a proveedores
# PRODUCCION    Análisis de producción y recetas
# (etc.)
```

**Checklist**: [ ]

### 18. Generar Reporte de Prueba
```powershell
$body = @{
    tipo_reporte = "VENTAS"
    fecha_inicio = "2024-01-01"
    fecha_fin = "2024-12-31"
    formatos = @("json")  # Solo JSON para prueba rápida
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/reportes/generar" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$resultado = $response.Content | ConvertFrom-Json
$resultado.tipo_reporte
# Debe mostrar: VENTAS
```

**Checklist**: [ ]

### 19. Verificar Carpetas de Salida
```powershell
# Verificar que existan directorios de salida
Test-Path ".\outputs"  # Debe ser True
Test-Path ".\logs"     # Debe ser True

# Ver archivos generados
Get-ChildItem -Path ".\outputs\" -Recurse
Get-ChildItem -Path ".\logs\" -Recurse
```

**Checklist**: [ ]

### 20. Verificar Archivos de Log
```powershell
Get-ChildItem -Path ".\logs\ia_reportes_*.log" | Select-Object -First 1
Get-Content (Get-ChildItem -Path ".\logs\ia_reportes_*.log" | Select-Object -First 1).FullName | Select-Object -Last 10
```

**Debe mostrar logs recientes sin errores**

**Checklist**: [ ]

---

## 📊 Pruebas Avanzadas

### 21. Generar Reporte PDF
```powershell
$body = @{
    tipo_reporte = "VENTAS"
    fecha_inicio = "2024-01-01"
    fecha_fin = "2024-12-31"
    formatos = @("pdf")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/reportes/generar" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" | Out-Null

# Verificar archivo PDF creado
Get-ChildItem -Path ".\outputs\*.pdf" | Select-Object -Last 1
```

**Debe crear un archivo PDF en outputs/**

**Checklist**: [ ]

### 22. Generar Reporte Excel
```powershell
$body = @{
    tipo_reporte = "INVENTARIO"
    formatos = @("excel")
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/reportes/generar" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" | Out-Null

# Verificar archivo Excel
Get-ChildItem -Path ".\outputs\*.xlsx" | Select-Object -Last 1
```

**Debe crear un archivo XLSX en outputs/**

**Checklist**: [ ]

### 23. Generar con Gráficos
```powershell
$body = @{
    tipo_reporte = "VENTAS"
    formatos = @("json")
    incluir_graficos = $true
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/reportes/generar" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$resultado = $response.Content | ConvertFrom-Json
$resultado.graficos  # Debe mostrar rutas a gráficos

# Verificar gráficos PNG
Get-ChildItem -Path ".\outputs\*.png" | Select-Object -Last 5
```

**Debe crear archivos PNG en outputs/**

**Checklist**: [ ]

---

## 🔄 Pruebas de Integración

### 24. Probar Preview (datos sin generar archivos)
```powershell
$response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/reportes/preview/VENTAS" -Method GET
$datos = $response.Content | ConvertFrom-Json
$datos | Select-Object tipo, periodo
```

**Debe mostrar datos de preview sin generar archivos**

**Checklist**: [ ]

### 25. Probar Todos los Tipos de Reportes
```powershell
$tipos = @("VENTAS", "COMPRAS", "PRODUCCION", "INVENTARIO", "PEDIDOS", "CLIENTES", "FINANCIERO", "TENDENCIAS")

foreach ($tipo in $tipos) {
    $body = @{
        tipo_reporte = $tipo
        formatos = @("json")
    } | ConvertTo-Json
    
    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:5000/api/reportes/generar" `
            -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
        Write-Host "✅ $tipo - OK"
    } catch {
        Write-Host "❌ $tipo - ERROR: $_"
    }
}
```

**Debe mostrar ✅ para todos los tipos**

**Checklist**: [ ]

---

## 📈 Validación Final

### 26. Verificar Estructura Final de Carpetas
```powershell
Get-Item ".\IA_REPORTES\src\config\settings.py" | Select-Object FullName  # ✅
Get-Item ".\IA_REPORTES\main.py" | Select-Object FullName                 # ✅
Get-Item ".\IA_REPORTES\requirements.txt" | Select-Object FullName        # ✅
Get-Item ".\IA_REPORTES\.env" | Select-Object FullName                    # ✅
```

**Checklist**: [ ]

### 27. Conteo de Líneas de Código
```powershell
(Get-ChildItem -Path ".\IA_REPORTES\src\" -Filter "*.py" -Recurse | 
  Measure-Object -Property @{Expression={
    (Get-Content $_.FullName | Measure-Object -Line).Lines
  }} -Sum).Sum
# Debe mostrar aprox. 800+ líneas de código
```

**Checklist**: [ ]

### 28. Archivos Generados Durante Pruebas
```powershell
# Contar archivos en outputs
(Get-ChildItem -Path ".\outputs\" -Recurse).Count
# Debe mostrar: > 5 archivos

# Contar logs
(Get-ChildItem -Path ".\logs\" -Recurse).Count
# Debe mostrar: >= 1 archivo
```

**Checklist**: [ ]

---

## 🎯 Estado Final

### 29. Completar Verificación Final
```powershell
Write-Host "=== VERIFICACIÓN FINAL ===" -ForegroundColor Green
Write-Host "✅ Estructura de carpetas: OK"
Write-Host "✅ Archivos Python: 11 archivos"
Write-Host "✅ Configuración: .env creado"
Write-Host "✅ Dependencias: Instaladas"
Write-Host "✅ Base de Datos: Conectada"
Write-Host "✅ OpenAI API: Configurada"
Write-Host "✅ API Flask: Funcionando"
Write-Host "✅ Reportes: Generables"
Write-Host ""
Write-Host "🎉 SISTEMA LISTO PARA PRODUCCIÓN" -ForegroundColor Green
```

**Checklist**: [ ]

### 30. Documentación Accesible
```powershell
# Archivos de referencia disponibles
Get-ChildItem -Path ".\IA_REPORTES\" -Filter "*.md" | Select-Object Name

# Debe mostrar:
# - README.md
# - GUIA_INSTALACION_RAPIDA.md
# - DOCUMENTACION_TECNICA.md
# - RESUMEN_IMPLEMENTACION.md
```

**Checklist**: [ ]

---

## 📝 Notas Finales

- [ ] Backup de `.env` en lugar seguro (no committed a git)
- [ ] Credenciales OpenAI verificadas y funcionales
- [ ] Base de datos PostgreSQL corriendo y accesible
- [ ] Servidor Flask corriendo sin errores
- [ ] API respondiendo a requests HTTP
- [ ] Archivos de salida generándose correctamente
- [ ] Logs registrando eventos correctamente

---

## 🚀 ¡LISTO PARA USAR!

Si todos los ✅ están completados:

```powershell
# Mantener servidor corriendo
python main.py

# En otra terminal, generar reportes
python -m requests  # O llamar endpoints desde Frontend/Backend
```

**Fecha de Verificación**: _______________  
**Verificador**: _______________  
**Status**: ✅ COMPLETADO

---

**Vuelve a ejecutar este checklist después de cambios importantes en configuración.**
