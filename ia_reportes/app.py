from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Agregar rutas de módulos
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import FLASK_PORT, FLASK_ENV
from routes import create_routes

app = Flask(__name__)
CORS(app)

# Crear rutas
create_routes(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Verificar que el servicio esté activo"""
    return jsonify({
        "status": "ok",
        "service": "ia_reportes",
        "environment": FLASK_ENV
    }), 200

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"error": "Bad Request", "message": str(error)}), 400

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({"error": "Unauthorized", "message": "Token inválido o expirado"}), 401

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal Server Error", "message": str(error)}), 500

if __name__ == '__main__':
    print(f"🚀 Iniciando servicio IA Reportes en puerto {FLASK_PORT}")
    print(f"📍 Entorno: {FLASK_ENV}")
    app.run(host='0.0.0.0', port=FLASK_PORT, debug=(FLASK_ENV == 'development'))
