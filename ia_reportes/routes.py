from flask import Blueprint, request, jsonify
from services.interpret_service import InterpretService
from services.report_service import ReportService

def create_routes(app):
    """Crear todas las rutas del servicio"""
    
    interpret_service = InterpretService()
    report_service = ReportService()
    
    # ==========================================
    # RUTAS DE INTERPRETACIÓN
    # ==========================================
    
    @app.route('/ia/interpretar', methods=['POST'])
    def interpretar_solicitud():
        """
        Interpreta un prompt en lenguaje natural
        
        Request JSON:
        {
            "texto_solicitud": "Genera un reporte de ventas de este mes",
            "contexto": "opcional - información sobre la empresa"
        }
        """
        try:
            data = request.get_json()
            texto_solicitud = data.get('texto_solicitud')
            contexto = data.get('contexto', {})
            
            if not texto_solicitud or len(texto_solicitud) < 10:
                return jsonify({"error": "Solicitud muy corta"}), 400
            
            # Interpretar con IA
            interpretacion = interpret_service.interpretar(texto_solicitud, contexto)
            
            return jsonify({
                "success": True,
                "solicitud_original": texto_solicitud,
                "interpretacion": interpretacion
            }), 200
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    # ==========================================
    # RUTAS DE REPORTES
    # ==========================================
    
    @app.route('/ia/generar-reporte', methods=['POST'])
    def generar_reporte():
        """
        Genera un reporte completo basado en prompt en lenguaje natural
        
        Request JSON:
        {
            "texto_solicitud": "Dime las ventas de noviembre",
            "modulo": "ventas",
            "usuario_id": 1,
            "formato": "json" | "excel" | "pdf"
        }
        """
        try:
            data = request.get_json()
            texto_solicitud = data.get('texto_solicitud')
            modulo = data.get('modulo', 'ventas')
            usuario_id = data.get('usuario_id')
            formato = data.get('formato', 'json')
            
            if not texto_solicitud:
                return jsonify({"error": "texto_solicitud requerido"}), 400
            
            # Generar reporte
            resultado = report_service.generar_reporte(
                texto_solicitud=texto_solicitud,
                modulo=modulo,
                usuario_id=usuario_id,
                formato=formato
            )
            
            return jsonify({
                "success": True,
                "solicitud_original": texto_solicitud,
                "modulo": modulo,
                "reporte": resultado
            }), 200
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/ia/reportes/ejemplos/<modulo>', methods=['GET'])
    def obtener_ejemplos(modulo):
        """
        Obtiene ejemplos de prompts para un módulo específico
        """
        try:
            ejemplos = report_service.obtener_ejemplos_modulo(modulo)
            return jsonify({
                "modulo": modulo,
                "ejemplos": ejemplos
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    
    @app.route('/ia/modulos', methods=['GET'])
    def obtener_modulos():
        """
        Retorna los módulos disponibles para generar reportes
        """
        from config import TIPOS_REPORTES
        
        return jsonify({
            "modulos_disponibles": list(TIPOS_REPORTES.keys()),
            "detalles": TIPOS_REPORTES
        }), 200
    
    # ==========================================
    # RUTAS DE CONTEXTO
    # ==========================================
    
    @app.route('/ia/contexto/empresa', methods=['GET'])
    def obtener_contexto_empresa():
        """
        Obtiene el contexto de la empresa (catálogos, configuraciones, etc.)
        """
        try:
            contexto = report_service.obtener_contexto_empresa()
            return jsonify({
                "success": True,
                "contexto": contexto
            }), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
