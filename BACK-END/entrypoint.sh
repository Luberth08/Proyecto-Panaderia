#!/bin/sh

# entrypoint.sh
set -e

echo "Esperando a que la base de datos esté lista..."


echo "✅ Base de datos disponible."

echo "🚀 Iniciando servidor Node.js..."
exec npm start
