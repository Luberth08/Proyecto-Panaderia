import json
from datetime import datetime, timedelta

class DateUtils:
    """Utilidades para manejo de fechas"""
    
    @staticmethod
    def get_current_month_range():
        """Rango de fechas del mes actual"""
        today = datetime.now()
        first_day = today.replace(day=1)
        last_day = (first_day + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        return first_day.date(), last_day.date()
    
    @staticmethod
    def get_last_month_range():
        """Rango de fechas del mes pasado"""
        today = datetime.now()
        first_day = today.replace(day=1) - timedelta(days=1)
        first_day = first_day.replace(day=1)
        last_day = today.replace(day=1) - timedelta(days=1)
        return first_day.date(), last_day.date()
    
    @staticmethod
    def get_year_range():
        """Rango de fechas del año actual"""
        today = datetime.now()
        first_day = today.replace(month=1, day=1)
        last_day = today.replace(month=12, day=31)
        return first_day.date(), last_day.date()

class Formatters:
    """Utilidades para formateo de datos"""
    
    @staticmethod
    def format_currency(value):
        """Formatear valor como moneda"""
        if value is None:
            return "$0.00"
        return f"${float(value):,.2f}"
    
    @staticmethod
    def format_percentage(value, total):
        """Formatear como porcentaje"""
        if total == 0:
            return "0%"
        return f"{(value / total * 100):.2f}%"
    
    @staticmethod
    def format_date(date_obj):
        """Formatear fecha"""
        if isinstance(date_obj, str):
            date_obj = datetime.strptime(date_obj, "%Y-%m-%d")
        return date_obj.strftime("%d de %B de %Y")
    
    @staticmethod
    def to_json(data):
        """Convertir a JSON"""
        return json.dumps(data, ensure_ascii=False, indent=2)

class Validators:
    """Utilidades para validación"""
    
    @staticmethod
    def validate_texto_solicitud(texto):
        """Validar que el texto sea válido"""
        if not texto or len(texto.strip()) < 10:
            return False, "El texto debe tener al menos 10 caracteres"
        if len(texto) > 500:
            return False, "El texto no puede exceder 500 caracteres"
        return True, "Válido"
    
    @staticmethod
    def validate_modulo(modulo):
        """Validar que el módulo exista"""
        from config import TIPOS_REPORTES
        if modulo not in TIPOS_REPORTES:
            return False
        return True
    
    @staticmethod
    def validate_fecha(fecha_str):
        """Validar formato de fecha"""
        try:
            datetime.strptime(fecha_str, "%Y-%m-%d")
            return True
        except:
            return False
