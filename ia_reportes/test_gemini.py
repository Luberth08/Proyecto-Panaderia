#!/usr/bin/env python3
"""Script para probar la conexión con Gemini API"""

import google.generativeai as genai
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

API_KEY = os.getenv('OPENAI_API_KEY')

print(f"API Key cargada: {API_KEY[:20]}...")
print(f"Longitud: {len(API_KEY)}")

try:
    # Configurar la API
    genai.configure(api_key=API_KEY)
    
    # Crear modelo
    model = genai.GenerativeModel('gemini-pro')
    
    # Hacer una prueba simple
    response = model.generate_content("Hola, ¿puedes responder?")
    
    print("\n✅ ¡Conexión exitosa!")
    print(f"Respuesta: {response.text[:100]}...")
    
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
    print(f"Tipo de error: {type(e).__name__}")
